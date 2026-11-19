import os
import requests
import time
import re

API_URL = "https://ku.wiktionary.org/w/api.php"
HEADERS = {"User-Agent": "KurdiKlassSync/2.0 (https://kurdiklass.org)"}

SUPABASE_URL = os.environ["SUPABASE_URL"].rstrip("/")
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

# Her kategoriden çekilecek maksimum kelime sayısı (Toplam ~5000+ kelime)
KATEGORILER = [
    ("Kategorî:Navdêr bi kurmancî", "navdêr", 2500),
    ("Kategorî:Lêker bi kurmancî", "lêker", 1000),
    ("Kategorî:Rengdêr bi kurmancî", "rengdêr", 1000),
    ("Kategorî:Hoker bi kurmancî", "hoker", 500),
]

def get_category_titles(cat_name, limit):
    titles = []
    cmcontinue = None
    while len(titles) < limit:
        params = {
            "action": "query",
            "list": "categorymembers",
            "cmtitle": cat_name,
            "cmnamespace": 0,
            "cmlimit": 500,
            "format": "json"
        }
        if cmcontinue:
            params["cmcontinue"] = cmcontinue
        res = requests.get(API_URL, params=params, headers=HEADERS, timeout=20).json()
        items = res.get("query", {}).get("categorymembers", [])
        for item in items:
            t = item["title"].strip()
            if not t.startswith("-") and not t.endswith("-") and ":" not in t:
                titles.append(t)
                if len(titles) >= limit:
                    break
        cmcontinue = res.get("continue", {}).get("cmcontinue")
        if not cmcontinue or not items:
            break
        time.sleep(0.2)
    return titles

def parse_page(title, wikitext, default_pos):
    tr_matches = re.findall(r"\{\{W\+?\|tr\|([^}|]+)", wikitext)
    if not tr_matches:
        tr_matches = re.findall(r"\*\s*Tirkî\s*:\s*\[\[([^\]]+)\]\]", wikitext)
    meaning_tr = ", ".join(dict.fromkeys([m.strip() for m in tr_matches if m.strip()]))[:250]

    meaning_ku = ""
    for line in wikitext.splitlines():
        line = line.strip()
        if line.startswith("# ") and not line.startswith("#*") and not line.startswith("#:"):
            clean = re.sub(r"\[\[([^|\]]+\|)?([^\]]+)\]\]", r"\2", line[2:])
            clean = re.sub(r"\{\{[^}]+\}\}", "", clean).strip()
            if len(clean) > 2:
                meaning_ku = clean[:300]
                break

    example_sentence = ""
    for line in wikitext.splitlines():
        line = line.strip()
        if line.startswith("#:"):
            clean_ex = re.sub(r"\[\[([^|\]]+\|)?([^\]]+)\]\]", r"\2", line[2:])
            clean_ex = re.sub(r"['\"]{2,}", "", clean_ex).strip()
            if len(clean_ex) > 4:
                example_sentence = clean_ex[:300]
                break

    if not meaning_tr and not meaning_ku:
        return None

    return {
        "word": title,
        "part_of_speech": default_pos,
        "meaning_tr": meaning_tr,
        "meaning_ku": meaning_ku,
        "example_sentence": example_sentence
    }

def upload_to_supabase(rows):
    url = f"{SUPABASE_URL}/rest/v1/dictionary"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=ignore-duplicates"
    }
    for i in range(0, len(rows), 250):
        chunk = rows[i:i + 250]
        r = requests.post(url, json=chunk, headers=headers, timeout=25)
        print(f"Supabase yükleme ({i + len(chunk)}/{len(rows)}): HTTP {r.status_code}")

def main():
    seen = set()
    all_records = []

    for cat_name, pos, limit in KATEGORILER:
        titles = get_category_titles(cat_name, limit)
        print(f"{cat_name}: {len(titles)} başlık bulundu.")
        for i in range(0, len(titles), 50):
            batch = [t for t in titles[i:i + 50] if t not in seen]
            if not batch:
                continue
            params = {
                "action": "query",
                "prop": "revisions",
                "rvprop": "content",
                "rvslots": "main",
                "titles": "|".join(batch),
                "format": "json"
            }
            res = requests.get(API_URL, params=params, headers=HEADERS, timeout=25).json()
            pages = res.get("query", {}).get("pages", {})
            for pid, pdata in pages.items():
                if int(pid) < 0:
                    continue
                revs = pdata.get("revisions", [])
                if not revs:
                    continue
                wikitext = revs[0].get("slots", {}).get("main", {}).get("*", "")
                title = pdata.get("title", "")
                parsed = parse_page(title, wikitext, pos)
                if parsed and title not in seen:
                    seen.add(title)
                    all_records.append(parsed)
            time.sleep(0.2)

    print(f"Toplam benzersiz Kürtçe kelime: {len(all_records)}")
    if all_records:
        upload_to_supabase(all_records)

if __name__ == "__main__":
    main()
