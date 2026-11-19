import os
import requests
import time
import re

API_URL = "https://ku.wiktionary.org/w/api.php"
HEADERS = {"User-Agent": "KurdiKlassSync/1.0 (https://kurdiklass.org)"}

SUPABASE_URL = os.environ["SUPABASE_URL"].rstrip("/")
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

HEDEF_KELIME = 3000

def get_titles(limit=3000):
    titles = []
    eicontinue = None
    while len(titles) < limit:
        params = {
            "action": "query",
            "list": "embeddedin",
            "eititle": "Şablon:W",
            "einamespace": 0,
            "eilimit": 500,
            "format": "json"
        }
        if eicontinue:
            params["eicontinue"] = eicontinue
        res = requests.get(API_URL, params=params, headers=HEADERS, timeout=20).json()
        items = res.get("query", {}).get("embeddedin", [])
        for item in items:
            t = item["title"].strip()
            if not t.startswith("-") and not t.endswith("-") and ":" not in t:
                titles.append(t)
                if len(titles) >= limit:
                    break
        eicontinue = res.get("continue", {}).get("eicontinue")
        if not eicontinue or not items:
            break
        time.sleep(0.2)
    return titles

def parse_page(title, wikitext):
    if "{{ziman|ku}}" not in wikitext.lower():
        return None

    pos = "navdêr"
    for k in ["navdêr", "lêker", "rengdêr", "hoker", "cînavk", "daçek", "gihanek", "baneşan", "hejmar"]:
        if k in wikitext.lower():
            pos = k
            break

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
        "part_of_speech": pos,
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
    for i in range(0, len(rows), 200):
        chunk = rows[i:i + 200]
        r = requests.post(url, json=chunk, headers=headers, timeout=20)
        print(f"Supabase yükleme ({i + len(chunk)}/{len(rows)}): HTTP {r.status_code}")

def main():
    titles = get_titles(HEDEF_KELIME)
    print(f"Toplam {len(titles)} başlık tarandı.")
    records = []
    for i in range(0, len(titles), 50):
        batch = titles[i:i + 50]
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
            parsed = parse_page(pdata.get("title", ""), wikitext)
            if parsed:
                records.append(parsed)
        time.sleep(0.2)

    print(f"Geçerli Kürtçe kelime sayısı: {len(records)}")
    if records:
        upload_to_supabase(records)

if __name__ == "__main__":
    main()
