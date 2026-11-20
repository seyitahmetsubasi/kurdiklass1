import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Search,
  BookOpen,
  Video,
  FileText,
  Headphones,
  Plus,
  Trash2,
  Edit3,
  Lock,
  LogOut,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Upload,
  FolderEdit,
  Settings,
  ClipboardList,
  Download,
  BookA,
  Sparkles,
  Award,
  Heart,
  RotateCcw,
  ChevronDown,
  Flame,
  Check,
  Zap,
  Image as ImageIcon,
  Eye,
  LayoutDashboard,
  Volume2
} from 'lucide-react';

// =========================================================================
// SUPABASE BAĞLANTI AYARLARI
// =========================================================================
const SUPABASE_URL = 'https://mzsxryxuvyllljvbrzul.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_a_Ujek9gxuIV9vESF2xl4A_ibpGwUV_';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'kurdiklass2026';
const BRAND_LOGO_URL = '/logo.jpg';

const DEFAULT_CATEGORIES = [
  { slug: 'zanist', name: 'ZANIST', sort_order: 1 },
  { slug: 'birkari', name: 'BÎRKARÎ', sort_order: 2 },
  { slug: 'ziman-u-wejeya-kurdi', name: 'ZIMAN û WÊJEYA KURDÎ', sort_order: 3 },
  { slug: 'zarok', name: 'ZAROK', sort_order: 4 },
  { slug: 'huner', name: 'HUNER', sort_order: 5 },
  { slug: 'teknoloji', name: 'TEKNOLOJÎ', sort_order: 6 }
];

const LANGUAGE_OPTIONS = [
  { code: 'KU', nativeName: 'Kurmancî' },
  { code: 'ZZA', nativeName: 'Zazakî' },
  { code: 'CKB', nativeName: 'Soranî' },
  { code: 'TR', nativeName: 'Türkçe' },
  { code: 'EN', nativeName: 'English' },
  { code: 'DE', nativeName: 'Deutsch' },
  { code: 'FR', nativeName: 'Français' },
  { code: 'IT', nativeName: 'Italiano' }
];

const normalizeKurdish = (str = '') =>
  str
    .toLocaleLowerCase('tr')
    .replace(/[êéèë]/g, 'e')
    .replace(/[îíìïı]/g, 'i')
    .replace(/[ûúùü]/g, 'u')
    .replace(/[ş]/g, 's')
    .replace(/[ç]/g, 'c')
    .trim();

const sanitizeSearch = (str = '') => str.replace(/[,()%*\\]/g, ' ').trim();

const slugify = (str = '') =>
  normalizeKurdish(str)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `beş-${Date.now()}`;

const BUILTIN_DICTIONARY = [
  { id: 'bi-1', word: 'heval', part_of_speech: 'navdêr', meaning_tr: 'arkadaş, dost', meaning_en: 'friend', meaning_ku: 'Kesê ku mirov pê re dostanî dike.', example_sentence: 'Ew hevalê min ê herî baş e.' },
  { id: 'bi-2', word: 'bijîşk', part_of_speech: 'navdêr', meaning_tr: 'doktor, hekim', meaning_en: 'doctor', meaning_ku: 'Kesê ku nexweşan derman dike.', example_sentence: 'Bijîşk li nexweşxaneyê dixebite.' },
  { id: 'bi-3', word: 'silav', part_of_speech: 'navdêr', meaning_tr: 'selam, merhaba', meaning_en: 'hello, greeting', meaning_ku: 'Peyva pêşwazîkirinê.', example_sentence: 'Silav û rêz ji bo we hemûyan.' },
  { id: 'bi-4', word: 'rojbaş', part_of_speech: 'baneşan', meaning_tr: 'günaydın, iyi günler', meaning_en: 'good morning, good day', meaning_ku: 'Silava sibeh û nîvro.', example_sentence: 'Rojbaş hevalno, hûn çawa ne?' },
  { id: 'bi-5', word: 'spas', part_of_speech: 'navdêr', meaning_tr: 'teşekkür', meaning_en: 'thank you, thanks', meaning_ku: 'Peyva rêzdarî û minetdariyê.', example_sentence: 'Gelek spas ji bo alîkariya te.' },
  { id: 'bi-6', word: 'av', part_of_speech: 'navdêr', meaning_tr: 'su', meaning_en: 'water', meaning_ku: 'Şileya bingehîn a jiyanê.', example_sentence: 'Av jiyan e.' },
  { id: 'bi-7', word: 'nan', part_of_speech: 'navdêr', meaning_tr: 'ekmek', meaning_en: 'bread', meaning_ku: 'Xwarina bingehîn a ji ardê.', example_sentence: 'Nanê germ gelekî xweş e.' },
  { id: 'bi-8', word: 'pirtûk', part_of_speech: 'navdêr', meaning_tr: 'kitap', meaning_en: 'book', meaning_ku: 'Berhema nivîskî ya xwendinê.', example_sentence: 'Ez her roj pirtûkekê dixwînim.' },
  { id: 'bi-9', word: 'dibistan', part_of_speech: 'navdêr', meaning_tr: 'okul', meaning_en: 'school', meaning_ku: 'Saziya perwerdehiyê.', example_sentence: 'Zarok sibehê zû diçin dibistanê.' },
  { id: 'bi-10', word: 'mamoste', part_of_speech: 'navdêr', meaning_tr: 'öğretmen', meaning_en: 'teacher', meaning_ku: 'Kesê ku dersê dide xwendekaran.', example_sentence: 'Mamoste dersa Kurdî dide.' },
  { id: 'bi-11', word: 'xwendekar', part_of_speech: 'navdêr', meaning_tr: 'öğrenci', meaning_en: 'student', meaning_ku: 'Kesê ku li dibistan an zanîngehê dixwîne.', example_sentence: 'Xwendekar li pirtûkxaneyê ne.' },
  { id: 'bi-12', word: 'mal', part_of_speech: 'navdêr', meaning_tr: 'ev', meaning_en: 'home, house', meaning_ku: 'Cihê jiyanê yê malbatê.', example_sentence: 'Mala me nêzîkî parkê ye.' },
  { id: 'bi-13', word: 'malbat', part_of_speech: 'navdêr', meaning_tr: 'aile', meaning_en: 'family', meaning_ku: 'Dayik, bav û zarok bi hev re.', example_sentence: 'Malbata min li Stenbolê dijî.' },
  { id: 'bi-14', word: 'dayik', part_of_speech: 'navdêr', meaning_tr: 'anne', meaning_en: 'mother', meaning_ku: 'Jina ku zarok aniye dinyayê.', example_sentence: 'Dayika min xwarinên xweş çêdike.' },
  { id: 'bi-15', word: 'bav', part_of_speech: 'navdêr', meaning_tr: 'baba', meaning_en: 'father', meaning_ku: 'Mêrê ku zarokê wî heye.', example_sentence: 'Bavê min endezyar e.' },
  { id: 'bi-16', word: 'ziman', part_of_speech: 'navdêr', meaning_tr: 'dil, lisan', meaning_en: 'language, tongue', meaning_ku: 'Amûra axaftin û ragihandinê.', example_sentence: 'Zimanê Kurdî gelekî dewlemend e.' },
  { id: 'bi-17', word: 'roj', part_of_speech: 'navdêr', meaning_tr: 'güneş, gün', meaning_en: 'sun, day', meaning_ku: 'Stêrka ku ronahiyê dide cîhanê.', example_sentence: 'Îro roj gelekî germ e.' },
  { id: 'bi-18', word: 'şev', part_of_speech: 'navdêr', meaning_tr: 'gece', meaning_en: 'night', meaning_ku: 'Dema tarî ya piştî rojavabûnê.', example_sentence: 'Şevbaş, xewên xweş.' },
  { id: 'bi-19', word: 'evîn', part_of_speech: 'navdêr', meaning_tr: 'aşk, sevgi', meaning_en: 'love', meaning_ku: 'Hezkirina kûr.', example_sentence: 'Evîna welat di dilê me de ye.' },
  { id: 'bi-20', word: 'azadî', part_of_speech: 'navdêr', meaning_tr: 'özgürlük, hürriyet', meaning_en: 'freedom, liberty', meaning_ku: 'Rewşa serbixwebûnê.', example_sentence: 'Azadî mafê her mirovî ye.' }
];

const DEFAULT_UI = {
  brand_first: 'Kurdi',
  brand_second: 'Klass',
  nav_site: 'Malper',
  nav_learn: 'Hînbûn / Lîstik',
  nav_ferheng: 'Ferheng',
  nav_admin: 'Rêveber',
  all_categories_label: 'HEMÛ BEŞ',
  hero_badge: 'ÇAVKANIYÊN PERWERDEHIYÊ',
  hero_title: 'Navenda Fêrbûn û Materyalên Kurdî',
  hero_subtitle: 'Vîdyo, belge, lîstik û rêberên mamosteyan ji bo hemû astan.',
  search_placeholder: 'Li ders, mijar an peyvekê bigere...',
  tab_content: 'Naveroka Dersê',
  tab_guide: 'Rêbera Mamosteyan',
  btn_open_material: 'Materyalê Veke',
  guide_heading: 'Plana Dersê û Rêbera Mamosteyan',
  guide_download_btn: 'PDFya Rêberê Daxe',
  guide_empty_text: 'Ji bo vê dersê hîn nivîsa rêberê nehatiye zêdekirin.',
  meta_level_prefix: 'Ast:',
  meta_grade_prefix: 'Pol:',
  filter_title: 'Parzûn (Fîltre)',
  filter_level_label: 'Ast (Seviye)',
  filter_level_all: 'Hemû Ast',
  filter_media_label: 'Cureyê Materyalê',
  filter_media_all: 'Hemû Cure',
  level_1: 'Destpêk',
  level_2: 'Navîn',
  level_3: 'Pêşketî',
  grade_1: 'Pêşdibistan',
  grade_2: 'Dibistana Seretayî',
  grade_3: 'Dibistana Navîn',
  grade_4: 'Lîse / Mezinan',
  media_video: 'Vîdyo',
  media_document: 'Belge / PDF',
  media_audio: 'Deng / Podcast',
  media_interactive: 'Lîstik / Çalakî',
  list_all_title: 'Hemû Ders û Materyal',
  list_count_suffix: 'materyal hatin dîtin',
  loading_text: 'Materyal tên barkirin...',
  empty_title: 'Hîn materyal nehatiye dîtin',
  empty_subtitle: 'Tu dikarî ji Panela Rêveber materyalên nû li vê beşê zêde bikî.',
  empty_button: 'Materyal Zêde Bike',
  card_guide_badge: 'RÊBER',
  footer_text: 'Platforma Perwerdehiya Vekirî ya Kurdî • KurdiKlass',
  ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
  ferheng_search_btn: 'Bigere',
  ferheng_empty_text: 'Peyva ku tu lê digerî nehat dîtin.',
  learn_title: 'Rêwîtiya Fêrbûna Kurmancî',
  learn_subtitle: 'Bi lîstikên kurt û kêfxweş gav bi gav Kurmancî fêr bibe!',
  learn_xp_label: 'Pûan',
  learn_empty_units: 'Hîn lîstik nehatine zêdekirin. Ji Panela Rêveber paketa destpêkê bar bike.',
  learn_stage_prefix: 'Qonax',
  learn_question_count_suffix: 'lîstik',
  learn_win_title: 'Pîroz be! Te ev qonax bi serkeftî qedand!',
  learn_lose_title: 'Dilên te qediyan! Careke din biceribîne.',
  learn_replay_btn: 'Dîsa Bilîze',
  learn_back_units_btn: 'Vegere Qonaxan',
  learn_type_choice: 'Vebijêrka Rast',
  learn_type_sentence: 'Hevokê Saz Bike',
  learn_type_match: 'Peyvan Bighîne Hev',
  learn_type_fill: 'Valahiyê Tije Bike',
  learn_type_image: 'Wêneyê Bibîne, Peyvê Hilbijêre',
  learn_sentence_placeholder: 'Li peyvên jêrîn bitikîne da ku hevokê rêz bikî...',
  learn_correct_msg: 'Gelek baş e! Bersiva te rast e.',
  learn_wrong_prefix: 'Bersiva rast:',
  learn_check_btn: 'Kontrol Bike',
  learn_next_btn: 'Berdewam Bike'
};

const UI_TRANSLATIONS = {
  KU: {},
  ZZA: {
    nav_site: 'Keyepel',
    nav_learn: 'Muşayîş / Kayî',
    nav_ferheng: 'Ferheng',
    nav_admin: 'Îdarekar',
    all_categories_label: 'PÊRO BEŞÎ',
    hero_badge: 'ÇAVKANÎYÊ PERWERDEYÎ',
    hero_title: 'Merkezê Musayîş û Materyalanê Kirmanckî',
    hero_subtitle: 'Vîdyoyî, belgeyî, kayî û rêberê mamostayan seba pêro sewîyan.',
    search_placeholder: 'Ders, mijar ya zi çekuyêk bigêre...',
    tab_content: 'Tedeokê Dersî',
    tab_guide: 'Rêberê Mamostayan',
    btn_open_material: 'Materyalî Rake',
    guide_heading: 'Planê Dersî û Rêberê Mamostayan',
    guide_download_btn: 'PDFyê Rêberî Daxî',
    guide_empty_text: 'Seba na derse hewna nuşteyê rêberî çin o.',
    meta_level_prefix: 'Sewîye:',
    meta_grade_prefix: 'Sinif:',
    filter_title: 'Fîltre',
    filter_level_label: 'Sewîye',
    filter_level_all: 'Pêro Sewîyeyî',
    filter_media_label: 'Tevrê Materyalî',
    filter_media_all: 'Pêro Tevrî',
    level_1: 'Destpêk',
    level_2: 'Miyanên',
    level_3: 'Averşîyayîş',
    grade_1: 'Ver-Mekteb',
    grade_2: 'Mektebo Verên',
    grade_3: 'Mektebo Miyanên',
    grade_4: 'Lîse / Pîlî',
    media_video: 'Vîdyo',
    media_document: 'Belge / PDF',
    media_audio: 'Veng / Podcast',
    media_interactive: 'Kayî / Çalakî',
    list_all_title: 'Pêro Ders û Materyalî',
    list_count_suffix: 'materyalî vînîyayî',
    loading_text: 'Materyalî bar benê...',
    empty_title: 'Hewna materyal nêvînîya',
    empty_subtitle: 'Ti şênayî Panelê Îdarekarî ra materyalê neweyî îlawe bikê.',
    empty_button: 'Materyal Îlawe Bike',
    card_guide_badge: 'RÊBER',
    footer_text: 'Platformê Perwerdeyê Akerdeyî yê Kurdî • KurdiKlass',
    ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
    ferheng_search_btn: 'Bigêre',
    ferheng_empty_text: 'Çekuya ke ti gêrenê nêvînîya.',
    learn_title: 'Raywanîya Musayîşê Kurmancî',
    learn_subtitle: 'Bi kayanê kılman û weşan gam bi gam musa!',
    learn_xp_label: 'Pûan',
    learn_empty_units: 'Hewna kayî çin ê. Panelê Îdarekarî ra paketa destpêkî bar bike.',
    learn_stage_prefix: 'Merhele',
    learn_question_count_suffix: 'kayî',
    learn_win_title: 'Bimbarek bo! To na merhele bi serkewtiş qedênaye!',
    learn_lose_title: 'Zerreyê to qedîyayî! Reyna biceribne.',
    learn_replay_btn: 'Reyna Kay Bike',
    learn_back_units_btn: 'Ageyre Merheleyan',
    learn_type_choice: 'Weçînayîşo Rast',
    learn_type_sentence: 'Cumle Vıraze',
    learn_type_match: 'Çekuyan Pê Girede',
    learn_type_fill: 'Vengî Pirr Bike',
    learn_type_image: 'Resimî Vîne, Çekuye Weçîne',
    learn_sentence_placeholder: 'Çekuyanê cêrênan ser o bitikne ke cumle rêz bikê...',
    learn_correct_msg: 'Zaf weş o! Cewabê to rast o.',
    learn_wrong_prefix: 'Cewabo rast:',
    learn_check_btn: 'Kontrol Bike',
    learn_next_btn: 'Dewam Bike'
  },
  CKB: {
    nav_site: 'ماڵپەڕ',
    nav_learn: 'فێربوون / یاری',
    nav_ferheng: 'فەرهەنگ',
    nav_admin: 'بەڕێوەبەر',
    all_categories_label: 'هەموو بەشەکان',
    hero_badge: 'سەرچاوەکانی پەروەردە',
    hero_title: 'ناوەندی فێربوون و ماددەکانی کوردی',
    hero_subtitle: 'ڤیدیۆ، بەڵگەنامە، یاری و ڕێبەری مامۆستایان بۆ هەموو ئاستەکان.',
    search_placeholder: 'بەدوای وانە، بابەت یان وشەیەکدا بگەڕێ...',
    tab_content: 'ناوەڕۆکی وانە',
    tab_guide: 'ڕێبەری مامۆستایان',
    btn_open_material: 'کردنەوەی ماددە',
    guide_heading: 'پلانی وانە و ڕێبەری مامۆستایان',
    guide_download_btn: 'داگرتنی PDF ڕێبەر',
    guide_empty_text: 'بۆ ئەم وانەیە هێشتا دەقی ڕێبەر زیاد نەکراوە.',
    meta_level_prefix: 'ئاست:',
    meta_grade_prefix: 'پۆل:',
    filter_title: 'پاڵاوتن',
    filter_level_label: 'ئاست',
    filter_level_all: 'هەموو ئاستەکان',
    filter_media_label: 'جۆری ماددە',
    filter_media_all: 'هەموو جۆرەکان',
    level_1: 'سەرەتایی',
    level_2: 'ناوەند',
    level_3: 'پێشکەوتوو',
    grade_1: 'باخچەی ساوایان',
    grade_2: 'قوتابخانەی سەرەتایی',
    grade_3: 'ناوەندی',
    grade_4: 'ئامادەیی / گەورەساڵان',
    media_video: 'ڤیدیۆ',
    media_document: 'بەڵگە / PDF',
    media_audio: 'دەنگ / پۆدکاست',
    media_interactive: 'یاری / چالاکی',
    list_all_title: 'هەموو وانە و ماددەکان',
    list_count_suffix: 'ماددە دۆزرانەوە',
    loading_text: 'ماددەکان بار دەکرێن...',
    empty_title: 'هێشتا هیچ ماددەیەک نەدۆزراوەتەوە',
    empty_subtitle: 'دەتوانیت لە پانێڵی بەڕێوەبەر ماددەی نوێ زیاد بکەیت.',
    empty_button: 'زیادکردنی ماددە',
    card_guide_badge: 'ڕێبەر',
    footer_text: 'پلاتفۆرمی پەروەردەی کراوەی کوردی • KurdiKlass',
    ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
    ferheng_search_btn: 'گەڕان',
    ferheng_empty_text: 'ئەو وشەیەی بەدوایدا دەگەڕێیت نەدۆزرایەوە.',
    learn_title: 'گەشتی فێربوونی کورمانجی',
    learn_subtitle: 'بە یاریی کورت و چێژبەخش هەنگاو بە هەنگاو فێر ببە!',
    learn_xp_label: 'خاڵ',
    learn_empty_units: 'هێشتا یاری زیاد نەکراوە. پاکێجی دەستپێک لە بەڕێوەبەر بار بکە.',
    learn_stage_prefix: 'قۆناغ',
    learn_question_count_suffix: 'یاری',
    learn_win_title: 'پیرۆزە! ئەم قۆناغەت بە سەرکەوتوویی تەواو کرد!',
    learn_lose_title: 'دڵەکانت تەواو بوون! دووبارە هەوڵ بدەرەوە.',
    learn_replay_btn: 'دووبارە یاری بکە',
    learn_back_units_btn: 'گەڕانەوە بۆ قۆناغەکان',
    learn_type_choice: 'هەڵبژاردنی دروست',
    learn_type_sentence: 'ڕستە دروست بکە',
    learn_type_match: 'وشەکان بەیەکەوە ببەستەرەوە',
    learn_type_fill: 'بۆشایی پڕ بکەرەوە',
    learn_type_image: 'وێنەکە بدۆزەرەوە، وشەکە هەڵبژێرە',
    learn_sentence_placeholder: 'لەسەر وشەکانی خوارەوە کلیک بکە بۆ ڕێکخستنی ڕستە...',
    learn_correct_msg: 'زۆر باشە! وەڵامەکەت دروستە.',
    learn_wrong_prefix: 'وەڵامی دروست:',
    learn_check_btn: 'پشکنین',
    learn_next_btn: 'بەردەوام بە'
  },
  TR: {
    nav_site: 'Site',
    nav_learn: 'Öğren / Oyun',
    nav_ferheng: 'Sözlük',
    nav_admin: 'Yönetici',
    all_categories_label: 'TÜM BÖLÜMLER',
    hero_badge: 'EĞİTİM KAYNAKLARI',
    hero_title: 'Kürtçe Öğrenme ve Materyal Merkezi',
    hero_subtitle: 'Tüm seviyeler için videolar, belgeler, oyunlar ve öğretmen rehberleri.',
    search_placeholder: 'Ders, konu veya kelime ara...',
    tab_content: 'Ders İçeriği',
    tab_guide: 'Öğretmen Rehberi',
    btn_open_material: 'Materyali Aç',
    guide_heading: 'Ders Planı ve Öğretmen Rehberi',
    guide_download_btn: 'Rehber PDF İndir',
    guide_empty_text: 'Bu ders için henüz rehber metni eklenmemiş.',
    meta_level_prefix: 'Seviye:',
    meta_grade_prefix: 'Sınıf:',
    filter_title: 'Filtre',
    filter_level_label: 'Seviye',
    filter_level_all: 'Tüm Seviyeler',
    filter_media_label: 'Materyal Türü',
    filter_media_all: 'Tüm Türler',
    level_1: 'Başlangıç',
    level_2: 'Orta',
    level_3: 'İleri',
    grade_1: 'Okul Öncesi',
    grade_2: 'İlkokul',
    grade_3: 'Ortaokul',
    grade_4: 'Lise / Yetişkin',
    media_video: 'Video',
    media_document: 'Belge / PDF',
    media_audio: 'Ses / Podcast',
    media_interactive: 'Oyun / Etkinlik',
    list_all_title: 'Tüm Ders ve Materyaller',
    list_count_suffix: 'materyal bulundu',
    loading_text: 'Materyaller yükleniyor...',
    empty_title: 'Henüz materyal bulunamadı',
    empty_subtitle: 'Yönetici Panelinden bu bölüme yeni materyaller ekleyebilirsiniz.',
    empty_button: 'Materyal Ekle',
    card_guide_badge: 'REHBER',
    footer_text: 'Açık Kürtçe Eğitim Platformu • KurdiKlass',
    ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
    ferheng_search_btn: 'Ara',
    ferheng_empty_text: 'Aradığınız kelime bulunamadı.',
    learn_title: 'Kurmancî Öğrenme Yolculuğu',
    learn_subtitle: 'Kısa ve eğlenceli oyunlarla adım adım Kurmancî öğren!',
    learn_xp_label: 'Puan',
    learn_empty_units: 'Henüz oyun eklenmemiş. Yönetici Panelinden başlangıç paketini yükleyin.',
    learn_stage_prefix: 'Aşama',
    learn_question_count_suffix: 'oyun',
    learn_win_title: 'Tebrikler! Bu aşamayı başarıyla tamamladın!',
    learn_lose_title: 'Canların bitti! Tekrar dene.',
    learn_replay_btn: 'Tekrar Oyna',
    learn_back_units_btn: 'Aşamalara Dön',
    learn_type_choice: 'Doğru Seçenek',
    learn_type_sentence: 'Cümle Kur',
    learn_type_match: 'Kelimeleri Eşleştir',
    learn_type_fill: 'Boşluğu Doldur',
    learn_type_image: 'Görseli Bul, Kelimeyi Seç',
    learn_sentence_placeholder: 'Cümleyi sıralamak için aşağıdaki kelimelere tıkla...',
    learn_correct_msg: 'Harika! Cevabın doğru.',
    learn_wrong_prefix: 'Doğru cevap:',
    learn_check_btn: 'Kontrol Et',
    learn_next_btn: 'Devam Et'
  },
  EN: {
    nav_site: 'Site',
    nav_learn: 'Learn / Game',
    nav_ferheng: 'Dictionary',
    nav_admin: 'Admin',
    all_categories_label: 'ALL SECTIONS',
    hero_badge: 'EDUCATIONAL RESOURCES',
    hero_title: 'Kurdish Learning & Material Hub',
    hero_subtitle: 'Videos, documents, games, and teacher guides for all levels.',
    search_placeholder: 'Search lessons, topics, or words...',
    tab_content: 'Lesson Content',
    tab_guide: 'Teacher Guide',
    btn_open_material: 'Open Material',
    guide_heading: 'Lesson Plan & Teacher Guide',
    guide_download_btn: 'Download Guide PDF',
    guide_empty_text: 'No guide text has been added for this lesson yet.',
    meta_level_prefix: 'Level:',
    meta_grade_prefix: 'Grade:',
    filter_title: 'Filter',
    filter_level_label: 'Level',
    filter_level_all: 'All Levels',
    filter_media_label: 'Material Type',
    filter_media_all: 'All Types',
    level_1: 'Beginner',
    level_2: 'Intermediate',
    level_3: 'Advanced',
    grade_1: 'Preschool',
    grade_2: 'Elementary',
    grade_3: 'Middle School',
    grade_4: 'High School / Adult',
    media_video: 'Video',
    media_document: 'Document / PDF',
    media_audio: 'Audio / Podcast',
    media_interactive: 'Game / Activity',
    list_all_title: 'All Lessons & Materials',
    list_count_suffix: 'materials found',
    loading_text: 'Loading materials...',
    empty_title: 'No materials found yet',
    empty_subtitle: 'You can add new materials to this section from the Admin Panel.',
    empty_button: 'Add Material',
    card_guide_badge: 'GUIDE',
    footer_text: 'Open Kurdish Education Platform • KurdiKlass',
    ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
    ferheng_search_btn: 'Search',
    ferheng_empty_text: 'The word you are looking for was not found.',
    learn_title: 'Kurmanji Learning Journey',
    learn_subtitle: 'Learn Kurmanji step by step with short, fun games!',
    learn_xp_label: 'Points',
    learn_empty_units: 'No games added yet. Load the starter pack from the Admin Panel.',
    learn_stage_prefix: 'Stage',
    learn_question_count_suffix: 'games',
    learn_win_title: 'Congratulations! You completed this stage!',
    learn_lose_title: 'Out of hearts! Try again.',
    learn_replay_btn: 'Play Again',
    learn_back_units_btn: 'Back to Stages',
    learn_type_choice: 'Correct Choice',
    learn_type_sentence: 'Build the Sentence',
    learn_type_match: 'Match the Words',
    learn_type_fill: 'Fill in the Blank',
    learn_type_image: 'Find the Image, Pick the Word',
    learn_sentence_placeholder: 'Click the words below to order the sentence...',
    learn_correct_msg: 'Great job! Your answer is correct.',
    learn_wrong_prefix: 'Correct answer:',
    learn_check_btn: 'Check',
    learn_next_btn: 'Continue'
  },
  DE: {
    nav_site: 'Startseite',
    nav_learn: 'Lernen / Spiel',
    nav_ferheng: 'Wörterbuch',
    nav_admin: 'Admin',
    all_categories_label: 'ALLE BEREICHE',
    hero_badge: 'BILDUNGSRESSOURCEN',
    hero_title: 'Kurdisches Lern- & Materialzentrum',
    hero_subtitle: 'Videos, Dokumente, Spiele und Lehrerhandbücher für alle Niveaus.',
    search_placeholder: 'Nach Lektionen, Themen oder Wörtern suchen...',
    tab_content: 'Lektionsinhalt',
    tab_guide: 'Lehrerhandbuch',
    btn_open_material: 'Material öffnen',
    guide_heading: 'Unterrichtsplan & Lehrerhandbuch',
    guide_download_btn: 'Handbuch-PDF laden',
    guide_empty_text: 'Für diese Lektion wurde noch kein Handbuchtext hinzugefügt.',
    meta_level_prefix: 'Niveau:',
    meta_grade_prefix: 'Stufe:',
    filter_title: 'Filter',
    filter_level_label: 'Niveau',
    filter_level_all: 'Alle Niveaus',
    filter_media_label: 'Materialart',
    filter_media_all: 'Alle Arten',
    level_1: 'Anfänger',
    level_2: 'Mittelstufe',
    level_3: 'Fortgeschritten',
    grade_1: 'Vorschule',
    grade_2: 'Grundschule',
    grade_3: 'Sekundarstufe I',
    grade_4: 'Gymnasium / Erwachsene',
    media_video: 'Video',
    media_document: 'Dokument / PDF',
    media_audio: 'Audio / Podcast',
    media_interactive: 'Spiel / Aktivität',
    list_all_title: 'Alle Lektionen & Materialien',
    list_count_suffix: 'Materialien gefunden',
    loading_text: 'Materialien werden geladen...',
    empty_title: 'Noch keine Materialien gefunden',
    empty_subtitle: 'Über das Admin-Panel können neue Materialien hinzugefügt werden.',
    empty_button: 'Material hinzufügen',
    card_guide_badge: 'HANDBUCH',
    footer_text: 'Offene Kurdische Bildungsplattform • KurdiKlass',
    ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
    ferheng_search_btn: 'Suchen',
    ferheng_empty_text: 'Das gesuchte Wort wurde nicht gefunden.',
    learn_title: 'Kurmancî-Lernreise',
    learn_subtitle: 'Lerne Schritt für Schritt Kurmancî mit kurzen Spielen!',
    learn_xp_label: 'Punkte',
    learn_empty_units: 'Noch keine Spiele hinzugefügt. Lade das Starterpaket im Admin-Panel.',
    learn_stage_prefix: 'Stufe',
    learn_question_count_suffix: 'Spiele',
    learn_win_title: 'Glückwunsch! Du hast diese Stufe abgeschlossen!',
    learn_lose_title: 'Keine Herzen mehr! Versuch es noch einmal.',
    learn_replay_btn: 'Nochmal spielen',
    learn_back_units_btn: 'Zurück zu den Stufen',
    learn_type_choice: 'Richtige Wahl',
    learn_type_sentence: 'Satz bilden',
    learn_type_match: 'Wörter zuordnen',
    learn_type_fill: 'Lücke füllen',
    learn_type_image: 'Bild finden, Wort wählen',
    learn_sentence_placeholder: 'Klicke unten auf die Wörter, um den Satz zu ordnen...',
    learn_correct_msg: 'Sehr gut! Deine Antwort ist richtig.',
    learn_wrong_prefix: 'Richtige Antwort:',
    learn_check_btn: 'Prüfen',
    learn_next_btn: 'Weiter'
  },
  FR: {
    nav_site: 'Site',
    nav_learn: 'Apprendre / Jeu',
    nav_ferheng: 'Dictionnaire',
    nav_admin: 'Admin',
    all_categories_label: 'TOUTES SECTIONS',
    hero_badge: 'RESSOURCES ÉDUCATIVES',
    hero_title: 'Centre d’Apprentissage et de Ressources Kurdes',
    hero_subtitle: 'Vidéos, documents, jeux et guides pédagogiques pour tous niveaux.',
    search_placeholder: 'Rechercher des cours, sujets ou mots...',
    tab_content: 'Contenu du cours',
    tab_guide: 'Guide enseignant',
    btn_open_material: 'Ouvrir le matériel',
    guide_heading: 'Plan de cours et guide enseignant',
    guide_download_btn: 'Télécharger le PDF',
    guide_empty_text: 'Aucun texte de guide n’a encore été ajouté pour ce cours.',
    meta_level_prefix: 'Niveau :',
    meta_grade_prefix: 'Classe :',
    filter_title: 'Filtre',
    filter_level_label: 'Niveau',
    filter_level_all: 'Tous les niveaux',
    filter_media_label: 'Type de support',
    filter_media_all: 'Tous les types',
    level_1: 'Débutant',
    level_2: 'Intermédiaire',
    level_3: 'Avancé',
    grade_1: 'Maternelle',
    grade_2: 'École primaire',
    grade_3: 'Collège',
    grade_4: 'Lycée / Adultes',
    media_video: 'Vidéo',
    media_document: 'Document / PDF',
    media_audio: 'Audio / Podcast',
    media_interactive: 'Jeu / Activité',
    list_all_title: 'Tous les cours et ressources',
    list_count_suffix: 'ressources trouvées',
    loading_text: 'Chargement des ressources...',
    empty_title: 'Aucune ressource trouvée pour le moment',
    empty_subtitle: 'Vous pouvez ajouter de nouvelles ressources depuis le panneau admin.',
    empty_button: 'Ajouter une ressource',
    card_guide_badge: 'GUIDE',
    footer_text: 'Plateforme Éducative Kurde Ouverte • KurdiKlass',
    ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
    ferheng_search_btn: 'Rechercher',
    ferheng_empty_text: 'Le mot recherché est introuvable.',
    learn_title: 'Parcours d’Apprentissage du Kurmanji',
    learn_subtitle: 'Apprends le kurmanji pas à pas avec des jeux courts !',
    learn_xp_label: 'Points',
    learn_empty_units: 'Aucun jeu ajouté. Chargez le pack de départ depuis l’admin.',
    learn_stage_prefix: 'Étape',
    learn_question_count_suffix: 'jeux',
    learn_win_title: 'Bravo ! Tu as terminé cette étape !',
    learn_lose_title: 'Plus de vies ! Réessaie.',
    learn_replay_btn: 'Rejouer',
    learn_back_units_btn: 'Retour aux étapes',
    learn_type_choice: 'Bon choix',
    learn_type_sentence: 'Construire la phrase',
    learn_type_match: 'Associer les mots',
    learn_type_fill: 'Compléter le blanc',
    learn_type_image: 'Trouver l’image, choisir le mot',
    learn_sentence_placeholder: 'Clique sur les mots ci-dessous pour ordonner la phrase...',
    learn_correct_msg: 'Très bien ! Ta réponse est juste.',
    learn_wrong_prefix: 'Bonne réponse :',
    learn_check_btn: 'Vérifier',
    learn_next_btn: 'Continuer'
  },
  IT: {
    nav_site: 'Sito',
    nav_learn: 'Impara / Gioco',
    nav_ferheng: 'Dizionario',
    nav_admin: 'Admin',
    all_categories_label: 'TUTTE LE SEZIONI',
    hero_badge: 'RISORSE EDUCATIVE',
    hero_title: 'Centro di Apprendimento e Materiali Curdi',
    hero_subtitle: 'Video, documenti, giochi e guide per insegnanti per tutti i livelli.',
    search_placeholder: 'Cerca lezioni, argomenti o parole...',
    tab_content: 'Contenuto lezione',
    tab_guide: 'Guida insegnante',
    btn_open_material: 'Apri materiale',
    guide_heading: 'Piano di lezione e guida insegnante',
    guide_download_btn: 'Scarica PDF guida',
    guide_empty_text: 'Nessun testo di guida aggiunto ancora per questa lezione.',
    meta_level_prefix: 'Livello:',
    meta_grade_prefix: 'Classe:',
    filter_title: 'Filtro',
    filter_level_label: 'Livello',
    filter_level_all: 'Tutti i livelli',
    filter_media_label: 'Tipo materiale',
    filter_media_all: 'Tutti i tipi',
    level_1: 'Principiante',
    level_2: 'Intermedio',
    level_3: 'Avanzato',
    grade_1: 'Scuola dell’infanzia',
    grade_2: 'Scuola primaria',
    grade_3: 'Scuola secondaria I grado',
    grade_4: 'Scuola superiore / Adulti',
    media_video: 'Video',
    media_document: 'Documento / PDF',
    media_audio: 'Audio / Podcast',
    media_interactive: 'Gioco / Attività',
    list_all_title: 'Tutte le lezioni e i materiali',
    list_count_suffix: 'materiali trovati',
    loading_text: 'Caricamento materiali...',
    empty_title: 'Nessun materiale trovato finora',
    empty_subtitle: 'Puoi aggiungere nuovi materiali dal pannello amministratore.',
    empty_button: 'Aggiungi materiale',
    card_guide_badge: 'GUIDA',
    footer_text: 'Piattaforma Educativa Curda Aperta • KurdiKlass',
    ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
    ferheng_search_btn: 'Cerca',
    ferheng_empty_text: 'La parola cercata non è stata trovata.',
    learn_title: 'Percorso di Apprendimento del Kurmanji',
    learn_subtitle: 'Impara il kurmanji passo dopo passo con brevi giochi!',
    learn_xp_label: 'Punti',
    learn_empty_units: 'Nessun gioco aggiunto. Carica il pacchetto iniziale dall’admin.',
    learn_stage_prefix: 'Tappa',
    learn_question_count_suffix: 'giochi',
    learn_win_title: 'Complimenti! Hai completato questa tappa!',
    learn_lose_title: 'Cuori esauriti! Riprova.',
    learn_replay_btn: 'Gioca ancora',
    learn_back_units_btn: 'Torna alle tappe',
    learn_type_choice: 'Scelta corretta',
    learn_type_sentence: 'Componi la frase',
    learn_type_match: 'Abbina le parole',
    learn_type_fill: 'Riempi lo spazio',
    learn_type_image: 'Trova l’immagine, scegli la parola',
    learn_sentence_placeholder: 'Tocca le parole qui sotto per ordinare la frase...',
    learn_correct_msg: 'Ottimo! La tua risposta è corretta.',
    learn_wrong_prefix: 'Risposta corretta:',
    learn_check_btn: 'Controlla',
    learn_next_btn: 'Continua'
  }
};

const UI_FIELD_LABELS = [
  { key: 'brand_first', label: 'Navê Malperê (Beşa 1)' },
  { key: 'brand_second', label: 'Navê Malperê (Beşa 2)' },
  { key: 'nav_site', label: 'Bişkojka Malperê' },
  { key: 'nav_learn', label: 'Bişkojka Hînbûn / Lîstik' },
  { key: 'nav_ferheng', label: 'Bişkojka Ferhengê' },
  { key: 'nav_admin', label: 'Bişkojka Rêveber' },
  { key: 'all_categories_label', label: 'Bişkojka Hemû Beş' },
  { key: 'hero_badge', label: 'Nîşana Jorîn (Hero Badge)' },
  { key: 'hero_title', label: 'Sernavê Sereke (Hero Title)' },
  { key: 'hero_subtitle', label: 'Binnivîsa Sereke (Hero Subtitle)' },
  { key: 'search_placeholder', label: 'Nivîsa Qutiya Lêgerînê' },
  { key: 'learn_title', label: 'Sernavê Hînbûn / Lîstik' },
  { key: 'learn_subtitle', label: 'Binnivîsa Hînbûn / Lîstik' },
  { key: 'footer_text', label: 'Nivîsa Jêrîn (Footer)' }
];

const STARTER_GAMES = [
  {
    unit_title: 'Beşa 1: Silav û Nasîn',
    exercise_type: 'match',
    question_text: 'Peyvên Kurmancî bi ravekirinên wan re bighîne hev:',
    options: [
      'Silav=Peyva pêşwazîkirinê',
      'Spas=Peyva rêzdarî û minetdariyê',
      'Belê=Bersiva erênî',
      'Na=Bersiva neyînî'
    ],
    correct_answer: '4',
    explanation: 'Silav, Spas, Belê û Na peyvên herî bingehîn ên axaftina rojane ne.'
  },
  {
    unit_title: 'Beşa 1: Silav û Nasîn',
    exercise_type: 'choice',
    question_text: 'Dema tu sibehê kesekî dibînî, tu çi dibêjî?',
    options: ['Rojbaş', 'Şevbaş', 'Êvarbaş', 'Bi xatirê te'],
    correct_answer: 'Rojbaş',
    explanation: 'Rojbaş ji bo silavdayîna sibeh û nîvro tê bikaranîn.'
  },
  {
    unit_title: 'Beşa 1: Silav û Nasîn',
    exercise_type: 'sentence',
    question_text: 'Peyvan li gorî rêzimanê rêz bike û hevokeke rast saz bike:',
    options: ['Ez', 'diçim', 'dibistanê.', 'tu', 'malê'],
    correct_answer: 'Ez diçim dibistanê.',
    explanation: 'Di Kurmancî de lêker (diçim) berî cihê çûnê (dibistanê) tê.'
  },
  {
    unit_title: 'Beşa 2: Malbat û Cînavk',
    exercise_type: 'fill_blank',
    question_text: 'Valahiyê bi cînavka rast tije bike: "Navê _____ Azad e."',
    options: ['min', 'ez', 'tu', 'em'],
    correct_answer: 'min',
    explanation: 'Piştî veqetandeka "-ê" (Navê), cînavka tewandî "min" tê bikaranîn: Navê min.'
  },
  {
    unit_title: 'Beşa 2: Malbat û Cînavk',
    exercise_type: 'match',
    question_text: 'Peyvên dijwate bi hev re bighîne:',
    options: [
      'Mezin=Biçûk',
      'Germ=Sar',
      'Dirêj=Kurt',
      'Spî=Reş'
    ],
    correct_answer: '4',
    explanation: 'Mezin û biçûk, germ û sar, dirêj û kurt, spî û reş rengdêrên dijwate ne.'
  }
];

const FEKI_AUDIO =
  'https://mzsxryxuvyllljvbrzul.supabase.co/storage/v1/object/public/materyal/exercise_audio/1795116991119-y0yjbc.mp3';

const FEKI_DATA = [
  ['🍎', 'sêv', ['hinar', 'zebeş', 'hêjîr'], 'Sêv (Elma)', '21,23'],
  ['🍎', 'hinar', ['gûz', 'alû', 'xox'], 'Hinar (Nar)', '3,4.5'],
  ['🌰', 'gûz', ['mişmiş', 'vîşne', 'tirî'], 'Gûz (Ceviz)', '4.5,6'],
  ['🍑', 'alû', ['hirmî', 'pirteqal', 'sêv'], 'Alû (Erik)', '6,7.5'],
  ['🍑', 'xox', ['zebeş', 'hinar', 'hêjîr'], 'Xox (Şeftali)', '7.5,9'],
  ['🍊', 'mişmiş', ['gûz', 'tirî', 'vîşne'], 'Mişmiş (Kayısı)', '9,10.8'],
  ['🍉', 'zebeş', ['alû', 'hirmî', 'pirteqal'], 'Zebeş (Karpuz)', '10.8,12.5'],
  ['🍒', 'vîşne', ['xox', 'sêv', 'hinar'], 'Vîşne (Vişne)', '12.5,14.2'],
  ['🍐', 'hirmî', ['mişmiş', 'gûz', 'zebeş'], 'Hirmî (Armut)', '14.2,15.8'],
  ['🫒', 'hêjîr', ['vîşne', 'alû', 'tirî'], 'Hêjîr (İncir)', '15.8,17.5'],
  ['🍊', 'pirteqal', ['hirmî', 'xox', 'sêv'], 'Pirteqal (Portakal)', '17.5,19.3'],
  ['🍇', 'tirî', ['hêjîr', 'hinar', 'gûz'], 'Tirî (Üzüm)', '19.3,21']
];

const BUILTIN_ZAROK_FEKI = FEKI_DATA.map(([emoji, answer, wrong, explanation, range], i) => ({
  id: `feki-${i + 1}`,
  unit_title: 'ZAROK: Fêkî',
  exercise_type: 'choice',
  question_text: `${emoji} Guhdarî bike! Ev kîjan fêkî ye?`,
  options: [answer, ...wrong].sort((a, b) => ((a.charCodeAt(1) + i) % 3) - ((b.charCodeAt(1) + i) % 3)),
  correct_answer: answer,
  explanation,
  audio_url: `${FEKI_AUDIO}#t=${range}`
}));

export default function App() {
  const [viewMode, setViewMode] = useState('student');
  const [selectedLang, setSelectedLang] = useState(() => localStorage.getItem('kk_lang') || 'KU');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const audioPlayerRef = useRef(null);

  const [rawUi, setRawUi] = useState(DEFAULT_UI);
  const ui = { ...rawUi, ...(UI_TRANSLATIONS[selectedLang] || {}) };

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonTab, setLessonTab] = useState('content');

  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('kk_admin') === 'true');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [uploadingField, setUploadingField] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [catMsg, setCatMsg] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [settingsMsg, setSettingsMsg] = useState('');

  const emptyLessonForm = {
    title: '',
    description: '',
    category_slug: 'zanist',
    media_type: 'video',
    media_url: '',
    thumbnail_url: '',
    level: DEFAULT_UI.level_1,
    grade_level: DEFAULT_UI.grade_2,
    teacher_guide: '',
    guide_pdf_url: ''
  };
  const [formData, setFormData] = useState(emptyLessonForm);

  const [ferhengWords, setFerhengWords] = useState([]);
  const [totalWordCount, setTotalWordCount] = useState(0);
  const [searchingDict, setSearchingDict] = useState(false);
  const [ferhengQuery, setFerhengQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('all');
  const [selectedWordDetail, setSelectedWordDetail] = useState(null);
  const [editingWordId, setEditingWordId] = useState(null);
  const [wordMsg, setWordMsg] = useState('');
  const [syncingProgress, setSyncingProgress] = useState('');
  const [wordForm, setWordForm] = useState({
    word: '',
    part_of_speech: 'navdêr',
    meaning_tr: '',
    meaning_ku: '',
    example_sentence: ''
  });

  const [exercises, setExercises] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [builtWords, setBuiltWords] = useState([]);
  const [answerState, setAnswerState] = useState(null);
  const [unitCompleted, setUnitCompleted] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [comboCount, setComboCount] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [xpPoints, setXpPoints] = useState(() => Number(localStorage.getItem('kk_xp') || 0));
  const [streakDays, setStreakDays] = useState(() => Number(localStorage.getItem('kk_streak') || 1));
  const [completedUnits, setCompletedUnits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kk_completed_units') || '[]');
    } catch {
      return [];
    }
  });

  const [shuffledRightOptions, setShuffledRightOptions] = useState([]);
  const [matchLeftSelected, setMatchLeftSelected] = useState(null);
  const [matchRightSelected, setMatchRightSelected] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [matchWrongFlash, setMatchWrongFlash] = useState(false);

  const [editingExId, setEditingExId] = useState(null);
  const [exMsg, setExMsg] = useState('');
  const [uploadingExImg, setUploadingExImg] = useState(false);
  const [uploadingExAudio, setUploadingExAudio] = useState(false);
  const [exForm, setExForm] = useState({
    unit_title: 'Beşa 1: Silav û Nasîn',
    exercise_type: 'choice',
    question_text: '',
    options_raw: '',
    correct_answer: '',
    explanation: '',
    image_url: '',
    audio_url: ''
  });

  const kurdishAlphabet = [
    'A', 'B', 'C', 'Ç', 'D', 'E', 'Ê', 'F', 'G', 'H', 'I', 'Î',
    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'Ş', 'T',
    'U', 'Û', 'V', 'W', 'X', 'Y', 'Z'
  ];

  const dynamicLevels = [ui.level_1, ui.level_2, ui.level_3];
  const dynamicGrades = [ui.grade_1, ui.grade_2, ui.grade_3, ui.grade_4];
  const dynamicMediaTypes = [
    { id: 'video', label: ui.media_video, icon: Video },
    { id: 'document', label: ui.media_document, icon: FileText },
    { id: 'audio', label: ui.media_audio, icon: Headphones },
    { id: 'interactive', label: ui.media_interactive, icon: BookOpen }
  ];

  useEffect(() => {
    fetchCategories();
    fetchSiteSettings();
    fetchLessons();
    fetchDictionary('', 'all');
    fetchExercises();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectLanguage = (code) => {
    setSelectedLang(code);
    localStorage.setItem('kk_lang', code);
    setLangMenuOpen(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data && data.length > 0) setCategories(data);
  };

  const fetchSiteSettings = async () => {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (!error && data) {
      const merged = { ...DEFAULT_UI };
      data.forEach((row) => {
        if (row.key in DEFAULT_UI && row.value) merged[row.key] = row.value;
      });
      setRawUi(merged);
    }
  };

  const fetchLessons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setLessons(data);
    setLoading(false);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASS) {
      setIsAdmin(true);
      localStorage.setItem('kk_admin', 'true');
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Şîfre çewt e. Ji kerema xwe dîsa biceribîne.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('kk_admin');
    setViewMode('student');
  };

  const handleFileUpload = async (event, field) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingField(field);
    const fileExt = file.name.split('.').pop();
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${field}/${safeName}`;

    const { error: uploadError } = await supabase.storage.from('materyal').upload(filePath, file);
    if (uploadError) {
      setStatusMsg({ type: 'error', text: 'Barkirin têk çû: ' + uploadError.message });
    } else {
      const { data: publicData } = supabase.storage.from('materyal').getPublicUrl(filePath);
      if (publicData?.publicUrl) {
        setFormData((prev) => ({ ...prev, [field]: publicData.publicUrl }));
      }
    }
    setUploadingField('');
    event.target.value = '';
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyLessonForm);
  };

  const startEditing = (lesson) => {
    setEditingId(lesson.id);
    setFormData({
      title: lesson.title || '',
      description: lesson.description || '',
      category_slug: lesson.category_slug || 'zanist',
      media_type: lesson.media_type || 'video',
      media_url: lesson.media_url || '',
      thumbnail_url: lesson.thumbnail_url || '',
      level: lesson.level || DEFAULT_UI.level_1,
      grade_level: lesson.grade_level || DEFAULT_UI.grade_2,
      teacher_guide: lesson.teacher_guide || '',
      guide_pdf_url: lesson.guide_pdf_url || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const payload = { ...formData, title: formData.title.trim() };
    const query = editingId
      ? supabase.from('lessons').update(payload).eq('id', editingId)
      : supabase.from('lessons').insert([payload]);

    const { error } = await query;
    if (error) {
      setStatusMsg({ type: 'error', text: 'Çewtî: ' + error.message });
    } else {
      setStatusMsg({
        type: 'success',
        text: editingId ? 'Ders bi serkeftî hat nûkirin!' : 'Materyala nû hat zêdekirin!'
      });
      resetForm();
      fetchLessons();
    }
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vî materyalî jê bibî?')) return;
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (error) {
      setStatusMsg({ type: 'error', text: 'Çewtî: ' + error.message });
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
    } else {
      fetchLessons();
    }
  };

  const handleUpdateCategoryName = (slug, name) => {
    setCategories((prev) => prev.map((c) => (c.slug === slug ? { ...c, name } : c)));
  };

  const handleSaveCategories = async () => {
    const rows = categories.map((c, idx) => ({
      slug: c.slug,
      name: c.name,
      sort_order: c.sort_order ?? idx + 1
    }));
    const { error } = await supabase.from('categories').upsert(rows, { onConflict: 'slug' });
    setCatMsg(error ? 'Çewtî: ' + error.message : 'Navên beşan hatin tomarkirin!');
    setTimeout(() => setCatMsg(''), 3500);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;
    let slug = slugify(name);
    if (categories.some((c) => c.slug === slug)) slug = `${slug}-${Date.now()}`;
    const row = { slug, name, sort_order: categories.length + 1 };
    const { error } = await supabase.from('categories').upsert([row], { onConflict: 'slug' });
    if (error) {
      setCatMsg('Çewtî: ' + error.message);
    } else {
      setCategories((prev) => [...prev, row]);
      setNewCatName('');
      setCatMsg('Beşa nû hat zêdekirin!');
    }
    setTimeout(() => setCatMsg(''), 3500);
  };

  const handleDeleteCategory = async (slug) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vê beşê jê bibî?')) return;
    const { error } = await supabase.from('categories').delete().eq('slug', slug);
    if (error) {
      setCatMsg('Çewtî: ' + error.message);
    } else {
      setCategories((prev) => prev.filter((c) => c.slug !== slug));
      if (selectedCategory === slug) setSelectedCategory('all');
      setCatMsg('Beş hat jêbirin.');
    }
    setTimeout(() => setCatMsg(''), 3500);
  };

  const handleSaveAllUiTexts = async (e) => {
    e.preventDefault();
    const rows = UI_FIELD_LABELS.map((f) => ({ key: f.key, value: rawUi[f.key] || '' }));
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    setSettingsMsg(error ? 'Çewtî: ' + error.message : 'Hemû nivîsên malperê hatin tomarkirin!');
    setTimeout(() => setSettingsMsg(''), 3500);
  };

  const fetchDictionary = async (searchText = '', letter = 'all') => {
    setSearchingDict(true);
    let query = supabase
      .from('dictionary')
      .select('*', { count: 'exact' })
      .order('word', { ascending: true });

    const q = sanitizeSearch(searchText);
    if (q) {
      query = query.or(
        `word.ilike.%${q}%,meaning_tr.ilike.%${q}%,meaning_ku.ilike.%${q}%`
      );
    } else if (letter !== 'all') {
      query = query.ilike('word', `${letter}%`);
    }

    const { data, count, error } = await query.limit(100);
    if (!error && data) {
      setFerhengWords(data);
      if (count !== null) setTotalWordCount(count);
    }
    setSearchingDict(false);
  };

  useEffect(() => {
    if (viewMode !== 'ferheng') return;
    const timer = setTimeout(() => {
      fetchDictionary(ferhengQuery, selectedLetter);
    }, 250);
    return () => clearTimeout(timer);
  }, [ferhengQuery, selectedLetter, viewMode]);

  const handleDictionarySearchSubmit = (e) => {
    e.preventDefault();
    fetchDictionary(ferhengQuery, selectedLetter);
  };

  const handleBulkImportDictionary = async () => {
    setSyncingProgress('Peyvên bingehîn tên barkirin...');
    const sampleWords = BUILTIN_DICTIONARY.map(({ word, part_of_speech, meaning_tr, meaning_ku, example_sentence }) => ({
      word,
      part_of_speech,
      meaning_tr,
      meaning_ku,
      example_sentence
    }));
    const { error } = await supabase.from('dictionary').insert(sampleWords);
    if (error) {
      setSyncingProgress('Çewtî: ' + error.message);
    } else {
      setSyncingProgress('Peyv bi serkeftî hatin zêdekirin!');
      fetchDictionary(ferhengQuery, selectedLetter);
    }
    setTimeout(() => setSyncingProgress(''), 4000);
  };

  const handleSaveWord = async (e) => {
    e.preventDefault();
    if (!wordForm.word.trim() || !wordForm.meaning_tr.trim()) return;

    const query = editingWordId
      ? supabase.from('dictionary').update(wordForm).eq('id', editingWordId)
      : supabase.from('dictionary').insert([wordForm]);

    const { error } = await query;
    if (error) {
      setWordMsg('Çewtî: ' + error.message);
    } else {
      setWordMsg(editingWordId ? 'Peyv hat nûkirin!' : 'Peyva nû hat zêdekirin!');
      resetWordForm();
      fetchDictionary(ferhengQuery, selectedLetter);
    }
    setTimeout(() => setWordMsg(''), 3500);
  };

  const startEditingWord = (item) => {
    setEditingWordId(item.id);
    setWordForm({
      word: item.word || '',
      part_of_speech: item.part_of_speech || 'navdêr',
      meaning_tr: item.meaning_tr || '',
      meaning_ku: item.meaning_ku || '',
      example_sentence: item.example_sentence || ''
    });
  };

  const resetWordForm = () => {
    setEditingWordId(null);
    setWordForm({
      word: '',
      part_of_speech: 'navdêr',
      meaning_tr: '',
      meaning_ku: '',
      example_sentence: ''
    });
  };

  const handleDeleteWord = async (id) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vê peyvê jê bibî?')) return;
    const { error } = await supabase.from('dictionary').delete().eq('id', id);
    if (error) {
      setWordMsg('Çewtî: ' + error.message);
      setTimeout(() => setWordMsg(''), 3500);
    } else {
      fetchDictionary(ferhengQuery, selectedLetter);
    }
  };

  const filteredDictionary = (() => {
    const rawQ = ferhengQuery.trim();
    const normQ = normalizeKurdish(rawQ);

    const dbList = ferhengWords.map((w) => ({
      ...w,
      sourceType: 'db'
    }));

    const seenWords = new Set(dbList.map((w) => normalizeKurdish(w.word)));

    const builtinList = BUILTIN_DICTIONARY.filter(
      (b) => !seenWords.has(normalizeKurdish(b.word))
    );

    const combined = [...dbList, ...builtinList].filter((item) => {
      if (selectedLetter === 'all') return true;
      return (item.word || '').toUpperCase().startsWith(selectedLetter);
    });

    if (!normQ) return combined;

    return combined
      .map((item) => {
        const wNorm = normalizeKurdish(item.word || '');
        const trNorm = normalizeKurdish(item.meaning_tr || '');
        const enNorm = normalizeKurdish(item.meaning_en || '');
        const kuNorm = normalizeKurdish(item.meaning_ku || '');

        let score = 0;
        if (wNorm === normQ) score = 100;
        else if (trNorm.split(/[,;/]/).map((s) => s.trim()).includes(normQ)) score = 95;
        else if (enNorm.split(/[,;/]/).map((s) => s.trim()).includes(normQ)) score = 95;
        else if (wNorm.startsWith(normQ)) score = 80;
        else if (trNorm.startsWith(normQ) || enNorm.startsWith(normQ)) score = 75;
        else if (wNorm.includes(normQ)) score = 60;
        else if (trNorm.includes(normQ) || enNorm.includes(normQ)) score = 50;
        else if (kuNorm.includes(normQ)) score = 30;

        return { ...item, _score: score };
      })
      .filter((item) => item._score > 0)
      .sort((a, b) => b._score - a._score);
  })();

  const fetchExercises = async () => {
    const { data, error } = await supabase
      .from('kurmanci_exercises')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setExercises(data);
    }
  };

  const handleLoadStarterGames = async () => {
    setExMsg('Paketa lîstikên Kurmancî tê barkirin...');
    const rows = STARTER_GAMES.map((g, idx) => ({
      ...g,
      sort_order: exercises.length + idx + 1
    }));
    const { error } = await supabase.from('kurmanci_exercises').insert(rows);
    if (error) {
      setExMsg('Çewtî: ' + error.message);
    } else {
      setExMsg('Lîstikên înteraktîf hatin zêdekirin!');
      fetchExercises();
    }
    setTimeout(() => setExMsg(''), 5000);
  };

  const uploadExFile = async (event, folder, setBusy, field) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    const fileExt = file.name.split('.').pop();
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${folder}/${safeName}`;

    const { error: uploadError } = await supabase.storage.from('materyal').upload(filePath, file);

    if (uploadError) {
      setExMsg('Barkirin têk çû: ' + uploadError.message);
      setTimeout(() => setExMsg(''), 4000);
    } else {
      const { data: publicData } = supabase.storage.from('materyal').getPublicUrl(filePath);
      if (publicData?.publicUrl) {
        setExForm((prev) => ({ ...prev, [field]: publicData.publicUrl }));
      }
    }
    setBusy(false);
    event.target.value = '';
  };

  const handleExImageUpload = (event) =>
    uploadExFile(event, 'exercises', setUploadingExImg, 'image_url');

  const handleExAudioUpload = (event) =>
    uploadExFile(event, 'exercise_audio', setUploadingExAudio, 'audio_url');

  const handleSaveExercise = async (e) => {
    e.preventDefault();
    const parsedOptions = exForm.options_raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!exForm.question_text.trim() || parsedOptions.length < 2) {
      setExMsg('Ji kerema xwe pirs û herî kêm 2 vebijêrk (bi bêhnokê veqetandî) binivîse.');
      return;
    }

    const finalCorrect =
      exForm.exercise_type === 'match'
        ? String(parsedOptions.length)
        : exForm.correct_answer.trim();

    if (exForm.exercise_type !== 'match' && !finalCorrect) {
      setExMsg('Ji kerema xwe bersiva rast binivîse.');
      return;
    }

    if (exForm.exercise_type === 'image_choice' && !exForm.image_url.trim()) {
      setExMsg('Ji bo vê cureyê lîstikê wêne pêwîst e. Wêneyek bar bike.');
      return;
    }

    if (
      exForm.exercise_type !== 'match' &&
      exForm.exercise_type !== 'sentence' &&
      !parsedOptions.some((o) => o.toLowerCase() === finalCorrect.toLowerCase())
    ) {
      setExMsg('Bersiva rast divê di nav vebijêrkan de hebe.');
      return;
    }

    const payload = {
      unit_title: exForm.unit_title.trim(),
      exercise_type: exForm.exercise_type,
      question_text: exForm.question_text.trim(),
      options: parsedOptions,
      correct_answer: finalCorrect,
      explanation: exForm.explanation.trim(),
      image_url: exForm.image_url.trim(),
      audio_url: exForm.audio_url.trim()
    };

    if (editingExId) {
      const { error } = await supabase
        .from('kurmanci_exercises')
        .update(payload)
        .eq('id', editingExId);

      if (error) {
        setExMsg('Çewtî: ' + error.message);
      } else {
        setExMsg('Lîstik bi serkeftî hat nûkirin!');
        resetExForm();
        fetchExercises();
      }
    } else {
      const { error } = await supabase.from('kurmanci_exercises').insert([
        { ...payload, sort_order: exercises.length + 1 }
      ]);

      if (error) {
        setExMsg('Çewtî: ' + error.message);
      } else {
        setExMsg('Lîstika nû hat zêdekirin!');
        resetExForm();
        fetchExercises();
      }
    }
    setTimeout(() => setExMsg(''), 4000);
  };

  const startEditingExercise = (ex) => {
    setEditingExId(ex.id);
    setExForm({
      unit_title: ex.unit_title || '',
      exercise_type: ex.exercise_type || 'choice',
      question_text: ex.question_text || '',
      options_raw: Array.isArray(ex.options) ? ex.options.join(', ') : '',
      correct_answer: ex.correct_answer || '',
      explanation: ex.explanation || '',
      image_url: ex.image_url || '',
      audio_url: ex.audio_url || ''
    });
  };

  const resetExForm = () => {
    setEditingExId(null);
    setExForm({
      unit_title: 'Beşa 1: Silav û Nasîn',
      exercise_type: 'choice',
      question_text: '',
      options_raw: '',
      correct_answer: '',
      explanation: '',
      image_url: '',
      audio_url: ''
    });
  };

  const handleDeleteExercise = async (id) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vê lîstikê jê bibî?')) return;
    const { error } = await supabase.from('kurmanci_exercises').delete().eq('id', id);
    if (error) {
      setExMsg('Çewtî: ' + error.message);
      setTimeout(() => setExMsg(''), 4000);
    } else {
      fetchExercises();
    }
  };

  const isZarokUnit = (title = '') => {
    const t = title.toLowerCase().trim();
    return (
      t.startsWith('zarok') ||
      t.includes('fêkî') ||
      t.includes('feki') ||
      t.includes('hevnasîn') ||
      t.includes('hevnasin')
    );
  };

  const unitList = [
    ...new Set(
      exercises.filter((ex) => !isZarokUnit(ex.unit_title)).map((ex) => ex.unit_title)
    )
  ];

  const zarokUnitList = [
    ...new Set([
      'ZAROK: Fêkî',
      ...exercises
        .filter((ex) => (ex.unit_title || '').toLowerCase().trim().startsWith('zarok'))
        .map((ex) => ex.unit_title)
    ])
  ];

  const unitExercises = (() => {
    if (!selectedUnit) return [];
    if (selectedUnit === 'ZAROK: Fêkî') {
      const dbFeki = exercises.filter(
        (ex) => ex.unit_title === 'ZAROK: Fêkî' && ex.audio_url
      );
      return dbFeki.length > 0 ? dbFeki : BUILTIN_ZAROK_FEKI;
    }
    return exercises.filter((ex) => ex.unit_title === selectedUnit);
  })();

  const currentEx = unitExercises[currentExIndex];

  const playCurrentAudio = (url) => {
    if (!url) return;
    try {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const [baseUrl, hashPart] = url.split('#t=');
      let startSec = 0;
      let endSec = null;
      if (hashPart) {
        const parts = hashPart.split(',');
        startSec = parseFloat(parts[0]) || 0;
        if (parts[1]) endSec = parseFloat(parts[1]);
      }

      const audio = new Audio(baseUrl);
      audio.preload = 'auto';
      audioPlayerRef.current = audio;
      setIsPlayingAudio(true);

      audio.onloadedmetadata = () => {
        if (startSec > 0) {
          audio.currentTime = startSec;
        }
      };

      audio.ontimeupdate = () => {
        if (endSec !== null && audio.currentTime >= endSec) {
          audio.pause();
          setIsPlayingAudio(false);
        }
      };

      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);

      audio.play().catch((err) => {
        console.error('Audio play error:', err);
        setIsPlayingAudio(false);
      });
    } catch {
      setIsPlayingAudio(false);
    }
  };

  useEffect(() => {
    setIsPlayingAudio(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if (currentEx?.audio_url && viewMode === 'learn' && selectedUnit && !unitCompleted) {
      const timer = setTimeout(() => {
        playCurrentAudio(currentEx.audio_url);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [currentEx?.id, viewMode, selectedUnit, unitCompleted]);

  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
    };
  }, []);

  const parsedMatchPairs = (() => {
    if (!currentEx || currentEx.exercise_type !== 'match') return [];
    return (currentEx.options || [])
      .map((pairStr, idx) => {
        const parts = pairStr.split('=');
        if (parts.length < 2) return null;
        return {
          id: idx,
          left: parts[0].trim(),
          right: parts.slice(1).join('=').trim()
        };
      })
      .filter(Boolean);
  })();

  useEffect(() => {
    if (currentEx?.exercise_type === 'match') {
      const pairs = (currentEx.options || [])
        .map((pairStr, idx) => {
          const parts = pairStr.split('=');
          if (parts.length < 2) return null;
          return { id: idx, right: parts.slice(1).join('=').trim() };
        })
        .filter(Boolean);
      const shuffled = [...pairs].sort(() => Math.random() - 0.5);
      setShuffledRightOptions(shuffled);
      setMatchLeftSelected(null);
      setMatchRightSelected(null);
      setMatchedPairs([]);
      setMatchWrongFlash(false);
    }
  }, [currentEx?.id]);

  const handleMatchSelect = (side, pairId) => {
    if (answerState || matchedPairs.includes(pairId) || hearts === 0) return;

    const nextLeft = side === 'left' ? pairId : matchLeftSelected;
    const nextRight = side === 'right' ? pairId : matchRightSelected;

    setMatchLeftSelected(nextLeft);
    setMatchRightSelected(nextRight);

    if (nextLeft !== null && nextRight !== null) {
      if (nextLeft === nextRight) {
        const updated = [...matchedPairs, nextLeft];
        setMatchedPairs(updated);
        setMatchLeftSelected(null);
        setMatchRightSelected(null);

        if (updated.length === parsedMatchPairs.length) {
          setAnswerState('correct');
          const nextXp = xpPoints + 15;
          setXpPoints(nextXp);
          setComboCount((c) => c + 1);
          localStorage.setItem('kk_xp', String(nextXp));
        }
      } else {
        setMatchWrongFlash(true);
        setHearts((prev) => Math.max(0, prev - 1));
        setComboCount(0);
        setTimeout(() => {
          setMatchLeftSelected(null);
          setMatchRightSelected(null);
          setMatchWrongFlash(false);
        }, 550);
      }
    }
  };

  const startUnit = (unitName) => {
    setSelectedUnit(unitName);
    setCurrentExIndex(0);
    setSelectedOption('');
    setBuiltWords([]);
    setAnswerState(null);
    setComboCount(0);
    setHearts(5);
    setUnitCompleted(false);
  };

  const closeActiveUnit = () => {
    const wasZarok = selectedUnit?.toUpperCase().startsWith('ZAROK:');
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    setSelectedUnit(null);
    if (wasZarok) {
      setViewMode('student');
      setSelectedCategory('zarok');
    }
  };

  const toggleSentenceWord = (word, idx) => {
    if (answerState) return;
    const existsIndex = builtWords.findIndex((item) => item.idx === idx);
    if (existsIndex > -1) {
      setBuiltWords((prev) => prev.filter((_, i) => i !== existsIndex));
    } else {
      setBuiltWords((prev) => [...prev, { word, idx }]);
    }
  };

  const checkExerciseAnswer = () => {
    if (!currentEx || currentEx.exercise_type === 'match') return;
    const userAnswer =
      currentEx.exercise_type === 'sentence'
        ? builtWords.map((w) => w.word).join(' ').trim()
        : selectedOption.trim();

    if (!userAnswer) return;

    if (userAnswer.toLowerCase() === currentEx.correct_answer.trim().toLowerCase()) {
      setAnswerState('correct');
      const bonus = comboCount >= 2 ? 15 : 10;
      const nextXp = xpPoints + bonus;
      setXpPoints(nextXp);
      setComboCount((c) => c + 1);
      localStorage.setItem('kk_xp', String(nextXp));
    } else {
      setAnswerState('wrong');
      setComboCount(0);
      setHearts((prev) => Math.max(0, prev - 1));
    }
  };

  const updateStreak = () => {
    const today = new Date().toISOString().slice(0, 10);
    const last = localStorage.getItem('kk_last_day');
    if (last === today) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const nextStreak = last === yesterday ? streakDays + 1 : 1;
    setStreakDays(nextStreak);
    localStorage.setItem('kk_streak', String(nextStreak));
    localStorage.setItem('kk_last_day', today);
  };

  const goToNextExercise = () => {
    if (hearts === 0) return;
    if (currentExIndex + 1 < unitExercises.length) {
      setCurrentExIndex((prev) => prev + 1);
      setSelectedOption('');
      setBuiltWords([]);
      setAnswerState(null);
    } else {
      setUnitCompleted(true);
      updateStreak();
      if (selectedUnit && !completedUnits.includes(selectedUnit)) {
        const updatedUnits = [...completedUnits, selectedUnit];
        setCompletedUnits(updatedUnits);
        localStorage.setItem('kk_completed_units', JSON.stringify(updatedUnits));
      }
    }
  };

  const filteredLessons = lessons.filter((l) => {
    if (selectedCategory !== 'all' && l.category_slug !== selectedCategory) return false;
    if (selectedLevel !== 'all' && l.level !== selectedLevel) return false;
    if (selectedMedia !== 'all' && l.media_type !== selectedMedia) return false;
    const q = normalizeKurdish(searchQuery);
    if (!q) return true;
    return (
      normalizeKurdish(l.title || '').includes(q) ||
      normalizeKurdish(l.description || '').includes(q)
    );
  });

  const mediaIconFor = (type) =>
    (dynamicMediaTypes.find((m) => m.id === type) || dynamicMediaTypes[0]).icon;

  const wrongAnswerLocked = answerState === 'wrong';
  const outOfHearts = hearts === 0 && !unitCompleted;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* ÜST MENÜ */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setViewMode('student')}
            className="flex items-center gap-2.5 font-extrabold text-xl text-slate-900"
          >
            <img
              src={BRAND_LOGO_URL}
              alt="KurdiKlass Logo"
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <span>
              {ui.brand_first}
              <span className="text-red-600">{ui.brand_second}</span>
            </span>
          </button>

          <nav className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'student', label: ui.nav_site, icon: LayoutDashboard },
              { id: 'learn', label: ui.nav_learn, icon: Sparkles },
              { id: 'ferheng', label: ui.nav_ferheng, icon: BookA },
              { id: 'admin', label: ui.nav_admin, icon: Lock }
            ].map((item) => {
              const Icon = item.icon;
              const active = viewMode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setViewMode(item.id);
                    if (item.id === 'learn') setSelectedUnit(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    active
                      ? 'bg-red-50 text-red-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}

            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen((o) => !o)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold text-slate-700 border border-slate-200 hover:bg-slate-100"
              >
                <span>{selectedLang}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-40">
                  {LANGUAGE_OPTIONS.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => handleSelectLanguage(l.code)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between ${
                        selectedLang === l.code ? 'font-bold text-red-700' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.nativeName}</span>
                      {selectedLang === l.code && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===================== MALPER (ÖĞRENCİ) ===================== */}
        {viewMode === 'student' && (
          <div className="space-y-8">
            <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12">
              <span className="inline-block bg-red-600 text-xs font-bold tracking-wide px-3 py-1 rounded-full mb-4">
                {ui.hero_badge}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3 max-w-3xl">{ui.hero_title}</h1>
              <p className="text-slate-300 max-w-2xl mb-6">{ui.hero_subtitle}</p>
              <div className="relative max-w-xl">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={ui.search_placeholder}
                  className="w-full rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </section>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                  selectedCategory === 'all'
                    ? 'bg-red-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {ui.all_categories_label}
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                    selectedCategory === c.slug
                      ? 'bg-red-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-end gap-4">
              <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                <Filter className="w-4 h-4" />
                <span>{ui.filter_title}</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  {ui.filter_level_label}
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">{ui.filter_level_all}</option>
                  {dynamicLevels.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  {ui.filter_media_label}
                </label>
                <select
                  value={selectedMedia}
                  onChange={(e) => setSelectedMedia(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">{ui.filter_media_all}</option>
                  {dynamicMediaTypes.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedCategory === 'zarok' && (
              <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h2 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Lîstikên Zarokan</span>
                </h2>
                <div className="flex flex-wrap gap-3">
                  {zarokUnitList.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => {
                        startUnit(u);
                        setViewMode('learn');
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition"
                    >
                      {u.replace(/^ZAROK:\s*/i, '')}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{ui.list_all_title}</h2>
              <span className="text-sm text-slate-500">
                {filteredLessons.length} {ui.list_count_suffix}
              </span>
            </div>

            {loading ? (
              <p className="text-center text-slate-500 py-12">{ui.loading_text}</p>
            ) : filteredLessons.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800">{ui.empty_title}</h3>
                <p className="text-sm text-slate-500 mb-4">{ui.empty_subtitle}</p>
                <button
                  type="button"
                  onClick={() => setViewMode('admin')}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2 rounded-lg text-sm"
                >
                  {ui.empty_button}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map((lesson) => {
                  const Icon = mediaIconFor(lesson.media_type);
                  const hasGuide = lesson.teacher_guide || lesson.guide_pdf_url;
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => {
                        setActiveLesson(lesson);
                        setLessonTab('content');
                      }}
                      className="text-left bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition"
                    >
                      <div className="aspect-video bg-slate-100 flex items-center justify-center relative">
                        {lesson.thumbnail_url ? (
                          <img
                            src={lesson.thumbnail_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon className="w-10 h-10 text-slate-300" />
                        )}
                        {hasGuide && (
                          <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                            {ui.card_guide_badge}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="text-xs font-bold text-red-600 mb-1">
                          {categories.find((c) => c.slug === lesson.category_slug)?.name}
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">{lesson.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2">{lesson.description}</p>
                        <div className="text-xs text-slate-400 mt-3">
                          {ui.meta_level_prefix} {lesson.level} • {ui.meta_grade_prefix} {lesson.grade_level}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeLesson && (
              <div
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                onClick={() => setActiveLesson(null)}
              >
                <div
                  className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-xl font-bold text-slate-900">{activeLesson.title}</h3>
                    <button
                      type="button"
                      onClick={() => setActiveLesson(null)}
                      className="p-1 rounded hover:bg-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex gap-2 mb-4 border-b border-slate-200">
                    {[
                      { id: 'content', label: ui.tab_content },
                      { id: 'guide', label: ui.tab_guide }
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setLessonTab(t.id)}
                        className={`px-4 py-2 text-sm font-bold border-b-2 -mb-px ${
                          lessonTab === t.id
                            ? 'border-red-600 text-red-700'
                            : 'border-transparent text-slate-500'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {lessonTab === 'content' ? (
                    <div className="space-y-4">
                      {activeLesson.thumbnail_url && (
                        <img
                          src={activeLesson.thumbnail_url}
                          alt=""
                          className="w-full rounded-xl"
                        />
                      )}
                      <p className="text-slate-700 whitespace-pre-line">{activeLesson.description}</p>
                      <div className="text-xs text-slate-500">
                        {ui.meta_level_prefix} {activeLesson.level} • {ui.meta_grade_prefix}{' '}
                        {activeLesson.grade_level}
                      </div>
                      {activeLesson.media_url && (
                        <a
                          href={activeLesson.media_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2.5 rounded-lg text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>{ui.btn_open_material}</span>
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-amber-600" />
                        <span>{ui.guide_heading}</span>
                      </h4>
                      {activeLesson.teacher_guide ? (
                        <p className="text-slate-700 whitespace-pre-line">{activeLesson.teacher_guide}</p>
                      ) : (
                        !activeLesson.guide_pdf_url && (
                          <p className="text-slate-500 text-sm">{ui.guide_empty_text}</p>
                        )
                      )}
                      {activeLesson.guide_pdf_url && (
                        <a
                          href={activeLesson.guide_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm"
                        >
                          <Download className="w-4 h-4" />
                          <span>{ui.guide_download_btn}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== HÎNBÛN / LÎSTIK ===================== */}
        {viewMode === 'learn' && (
          <div className="max-w-3xl mx-auto">
            {!selectedUnit ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{ui.learn_title}</h1>
                  <p className="text-slate-500">{ui.learn_subtitle}</p>
                </div>

                <div className="flex justify-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>{xpPoints}</span>
                    <span className="text-xs text-slate-500 font-semibold">{ui.learn_xp_label}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span>{streakDays}</span>
                  </div>
                </div>

                {unitList.length === 0 ? (
                  <p className="text-center text-slate-500 bg-white border border-dashed border-slate-300 rounded-2xl p-8">
                    {ui.learn_empty_units}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {unitList.map((unit, idx) => {
                      const count = exercises.filter((ex) => ex.unit_title === unit).length;
                      const done = completedUnits.includes(unit);
                      return (
                        <button
                          key={unit}
                          type="button"
                          onClick={() => startUnit(unit)}
                          className="w-full flex items-center justify-between gap-4 bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-5 text-left transition"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold ${
                                done ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {done ? <Check className="w-6 h-6" /> : idx + 1}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{unit}</div>
                              <div className="text-xs text-slate-500">
                                {ui.learn_stage_prefix} {idx + 1} • {count} {ui.learn_question_count_suffix}
                              </div>
                            </div>
                          </div>
                          {done && <Award className="w-6 h-6 text-amber-500" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : unitCompleted || outOfHearts ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-5">
                {unitCompleted ? (
                  <Award className="w-16 h-16 text-amber-500 mx-auto" />
                ) : (
                  <Heart className="w-16 h-16 text-slate-300 mx-auto" />
                )}
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {unitCompleted ? ui.learn_win_title : ui.learn_lose_title}
                </h2>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => startUnit(selectedUnit)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{ui.learn_replay_btn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeActiveUnit}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-xl"
                  >
                    {ui.learn_back_units_btn}
                  </button>
                </div>
              </div>
            ) : !currentEx ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4">
                <p className="text-slate-500">{ui.learn_empty_units}</p>
                <button
                  type="button"
                  onClick={closeActiveUnit}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2 rounded-xl"
                >
                  {ui.learn_back_units_btn}
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={closeActiveUnit}
                    className="p-1.5 rounded-lg hover:bg-slate-100"
                    aria-label="Derkeve"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${(currentExIndex / unitExercises.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1 font-bold text-red-600">
                    <Heart className="w-5 h-5 fill-red-500" />
                    <span>{hearts}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-emerald-700">
                    {{
                      choice: ui.learn_type_choice,
                      sentence: ui.learn_type_sentence,
                      match: ui.learn_type_match,
                      fill_blank: ui.learn_type_fill,
                      image_choice: ui.learn_type_image
                    }[currentEx.exercise_type] || ''}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{currentEx.question_text}</h2>

                  {currentEx.image_url && (
                    <img
                      src={currentEx.image_url}
                      alt=""
                      className={`rounded-xl border border-slate-200 mx-auto object-contain ${
                        currentEx.exercise_type === 'image_choice'
                          ? 'max-h-72 w-full bg-slate-50'
                          : 'max-h-56'
                      }`}
                    />
                  )}

                  {currentEx.audio_url && (
                    <button
                      type="button"
                      onClick={() => playCurrentAudio(currentEx.audio_url)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white ${
                        isPlayingAudio ? 'bg-sky-400' : 'bg-sky-600 hover:bg-sky-700'
                      }`}
                    >
                      <Volume2 className="w-5 h-5" />
                      <span>{isPlayingAudio ? '...' : 'Guhdarî Bike'}</span>
                    </button>
                  )}
                </div>

                {(currentEx.exercise_type === 'choice' ||
                  currentEx.exercise_type === 'fill_blank' ||
                  currentEx.exercise_type === 'image_choice') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(currentEx.options || []).map((opt) => {
                      const isSel = selectedOption === opt;
                      const isRight =
                        answerState && opt.toLowerCase() === currentEx.correct_answer.trim().toLowerCase();
                      let cls = 'border-slate-200 hover:border-emerald-400';
                      if (isSel && !answerState) cls = 'border-emerald-500 bg-emerald-50';
                      if (answerState && isRight) cls = 'border-emerald-500 bg-emerald-50';
                      if (answerState === 'wrong' && isSel && !isRight) cls = 'border-red-500 bg-red-50';
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={Boolean(answerState)}
                          onClick={() => setSelectedOption(opt)}
                          className={`border-2 rounded-xl px-4 py-3 font-semibold text-left transition ${cls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {currentEx.exercise_type === 'sentence' && (
                  <div className="space-y-4">
                    <div className="min-h-[56px] border-2 border-dashed border-slate-300 rounded-xl p-3 flex flex-wrap gap-2">
                      {builtWords.length === 0 && (
                        <span className="text-slate-400 text-sm">{ui.learn_sentence_placeholder}</span>
                      )}
                      {builtWords.map((w) => (
                        <button
                          key={w.idx}
                          type="button"
                          onClick={() => toggleSentenceWord(w.word, w.idx)}
                          className="bg-emerald-100 text-emerald-800 font-semibold px-3 py-1.5 rounded-lg"
                        >
                          {w.word}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(currentEx.options || []).map((word, idx) => {
                        const used = builtWords.some((b) => b.idx === idx);
                        return (
                          <button
                            key={`${word}-${idx}`}
                            type="button"
                            disabled={used}
                            onClick={() => toggleSentenceWord(word, idx)}
                            className={`border-2 border-slate-200 font-semibold px-3 py-1.5 rounded-lg transition ${
                              used ? 'opacity-30' : 'hover:border-emerald-400'
                            }`}
                          >
                            {word}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {currentEx.exercise_type === 'match' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {parsedMatchPairs.map((p) => {
                        const done = matchedPairs.includes(p.id);
                        const sel = matchLeftSelected === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            disabled={done}
                            onClick={() => handleMatchSelect('left', p.id)}
                            className={`w-full border-2 rounded-xl px-3 py-3 font-semibold text-sm transition ${
                              done
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : sel
                                ? matchWrongFlash
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-sky-500 bg-sky-50'
                                : 'border-slate-200 hover:border-sky-400'
                            }`}
                          >
                            {p.left}
                          </button>
                        );
                      })}
                    </div>
                    <div className="space-y-3">
                      {shuffledRightOptions.map((p) => {
                        const done = matchedPairs.includes(p.id);
                        const sel = matchRightSelected === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            disabled={done}
                            onClick={() => handleMatchSelect('right', p.id)}
                            className={`w-full border-2 rounded-xl px-3 py-3 font-semibold text-sm transition ${
                              done
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : sel
                                ? matchWrongFlash
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-sky-500 bg-sky-50'
                                : 'border-slate-200 hover:border-sky-400'
                            }`}
                          >
                            {p.right}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {answerState && (
                  <div
                    className={`rounded-xl p-4 text-sm font-medium ${
                      answerState === 'correct'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {answerState === 'correct' ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{ui.learn_correct_msg}</span>
                        {comboCount >= 3 && <Flame className="w-4 h-4 text-orange-500" />}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>
                          {ui.learn_wrong_prefix} <b>{currentEx.correct_answer}</b>
                        </span>
                      </div>
                    )}
                    {currentEx.explanation && (
                      <p className="mt-2 font-normal">{currentEx.explanation}</p>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  {!answerState && currentEx.exercise_type !== 'match' ? (
                    <button
                      type="button"
                      onClick={checkExerciseAnswer}
                      disabled={
                        currentEx.exercise_type === 'sentence'
                          ? builtWords.length === 0
                          : !selectedOption
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold px-8 py-3 rounded-xl"
                    >
                      {ui.learn_check_btn}
                    </button>
                  ) : answerState ? (
                    <button
                      type="button"
                      onClick={goToNextExercise}
                      className={`text-white font-bold px-8 py-3 rounded-xl ${
                        wrongAnswerLocked
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      {ui.learn_next_btn}
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== FERHENG ===================== */}
        {viewMode === 'ferheng' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center justify-center gap-2">
                <BookA className="w-8 h-8 text-sky-600" />
                <span>{ui.nav_ferheng}</span>
              </h1>
              <p className="text-sm text-slate-500">
                {totalWordCount || filteredDictionary.length} peyv
              </p>
            </div>

            <form onSubmit={handleDictionarySearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ferhengQuery}
                  onChange={(e) => setFerhengQuery(e.target.value)}
                  placeholder={ui.ferheng_search_placeholder}
                  className="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-sky-600"
                />
              </div>
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 rounded-xl"
              >
                {ui.ferheng_search_btn}
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedLetter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                  selectedLetter === 'all'
                    ? 'bg-sky-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                #
              </button>
              {kurdishAlphabet.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setSelectedLetter(l)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                    selectedLetter === l
                      ? 'bg-sky-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {searchingDict && <p className="text-xs text-slate-400">...</p>}

            {filteredDictionary.length === 0 ? (
              <p className="text-center text-slate-500 bg-white border border-dashed border-slate-300 rounded-2xl p-8">
                {ui.ferheng_empty_text}
              </p>
            ) : (
              <div className="space-y-2">
                {filteredDictionary.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedWordDetail(item)}
                    className="w-full text-left bg-white border border-slate-200 hover:border-sky-400 rounded-xl px-4 py-3 flex items-center justify-between gap-3 transition"
                  >
                    <div>
                      <span className="font-extrabold text-slate-900 mr-2">{item.word}</span>
                      <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                        {item.part_of_speech}
                      </span>
                      <div className="text-sm text-slate-600 mt-0.5">{item.meaning_tr}</div>
                    </div>
                    <Eye className="w-4 h-4 text-slate-300 shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {selectedWordDetail && (
              <div
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedWordDetail(null)}
              >
                <div
                  className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-900">
                        {selectedWordDetail.word}
                      </h3>
                      <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                        {selectedWordDetail.part_of_speech}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedWordDetail(null)}
                      className="p-1 rounded hover:bg-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-sm space-y-2">
                    <p><b>TR:</b> {selectedWordDetail.meaning_tr}</p>
                    {selectedWordDetail.meaning_en && (
                      <p><b>EN:</b> {selectedWordDetail.meaning_en}</p>
                    )}
                    {selectedWordDetail.meaning_ku && (
                      <p><b>KU:</b> {selectedWordDetail.meaning_ku}</p>
                    )}
                    {selectedWordDetail.example_sentence && (
                      <p className="italic text-slate-600 border-l-4 border-sky-300 pl-3">
                        {selectedWordDetail.example_sentence}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== REWEBER (ADMIN) ===================== */}
        {viewMode === 'admin' && (
          <div>
            {!isAdmin ? (
              <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md border border-slate-200 p-8 mt-8">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-center text-slate-900 mb-1">
                  Têketina Rêveber (Admin)
                </h2>
                <p className="text-sm text-center text-slate-500 mb-6">
                  Ji bo birêvebirina naveroka KurdiKlass şîfreyê binivîse.
                </p>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Şîfreya Rêveber
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  {authError && (
                    <p className="text-xs text-red-600 font-medium">{authError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 rounded-lg transition"
                  >
                    Têkeve Panelê
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">Panela Rêveberiya KurdiKlass</h1>
                    <p className="text-slate-400 text-sm">
                      Ders, PDF, pirsên Hînbûn / Lîstik, peyvên Ferhengê û hemû nivîsên malperê ji vir biguherîne.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-red-600 px-4 py-2 rounded-xl text-sm font-bold">
                      {lessons.length} materyal
                    </span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Derkeve</span>
                    </button>
                  </div>
                </div>

                {/* HÎNBÛN / LÎSTİK YÖNETİMİ */}
                <div className="bg-white rounded-2xl border-2 border-emerald-300 p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <span>
                        {editingExId
                          ? 'Lîstika Hînbûnê Sererast Bike'
                          : 'Hînbûn / Lîstik — Lîstikan Zêde Bike û Biguherîne'}
                      </span>
                    </h2>

                    <button
                      type="button"
                      onClick={handleLoadStarterGames}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                    >
                      + Paketa Destpêkê ya Lîstikan Bar Bike
                    </button>
                  </div>

                  {exMsg && (
                    <div className="p-3 rounded-xl mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium">
                      {exMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveExercise} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Navê Beşê / Qonaxê
                      </label>
                      <input
                        type="text"
                        required
                        value={exForm.unit_title}
                        onChange={(e) => setExForm({ ...exForm, unit_title: e.target.value })}
                        placeholder="Beşa 1: Silav û Nasîn"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Cureyê Lîstikê
                      </label>
                      <select
                        value={exForm.exercise_type}
                        onChange={(e) => setExForm({ ...exForm, exercise_type: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      >
                        <option value="choice">Vebijêrka Rast</option>
                        <option value="sentence">Hevokê Saz Bike</option>
                        <option value="match">Peyvan Bighîne Hev</option>
                        <option value="fill_blank">Valahiyê Tije Bike</option>
                        <option value="image_choice">Wêneyê Bibîne, Peyvê Hilbijêre</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Pirs an Rênîşander
                      </label>
                      <input
                        type="text"
                        required
                        value={exForm.question_text}
                        onChange={(e) => setExForm({ ...exForm, question_text: e.target.value })}
                        placeholder="Guhdarî bike û bersiva rast bibîne:"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Dengê Lîstikê (Vebijarkî)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={exForm.audio_url}
                          onChange={(e) => setExForm({ ...exForm, audio_url: e.target.value })}
                          placeholder="https://... an jî deng bar bike ->"
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        />
                        <label className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap">
                          <Volume2 className="w-4 h-4" />
                          <span>{uploadingExAudio ? 'Tê barkirin...' : 'Deng Bar Bike'}</span>
                          <input
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={handleExAudioUpload}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Wêneyê Lîstikê (Vebijarkî)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={exForm.image_url}
                          onChange={(e) => setExForm({ ...exForm, image_url: e.target.value })}
                          placeholder="https://... an jî wêne bar bike ->"
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        />
                        <label className="cursor-pointer bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap">
                          <ImageIcon className="w-4 h-4" />
                          <span>{uploadingExImg ? 'Tê barkirin...' : 'Wêne Bar Bike'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleExImageUpload}
                          />
                        </label>
                      </div>
                    </div>

                    <div className={exForm.exercise_type === 'match' ? 'md:col-span-2' : ''}>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        {exForm.exercise_type === 'match'
                          ? 'Cotên Peyvan (Mezin=Biçûk, Germ=Sar)'
                          : exForm.exercise_type === 'image_choice'
                          ? 'Vebijêrk (bi bêhnokê veqetandî) — wêne li jor bar bike'
                          : 'Vebijêrk an Peyv (bi bêhnokê veqetandî)'}
                      </label>
                      <input
                        type="text"
                        required
                        value={exForm.options_raw}
                        onChange={(e) => setExForm({ ...exForm, options_raw: e.target.value })}
                        placeholder={
                          exForm.exercise_type === 'match'
                            ? 'Mezin=Biçûk, Germ=Sar, Dirêj=Kurt, Spî=Reş'
                            : 'Rojbaş, Şevbaş, Êvarbaş, Bi xatirê te'
                        }
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    {exForm.exercise_type !== 'match' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          Bersiva Rast
                        </label>
                        <input
                          type="text"
                          required
                          value={exForm.correct_answer}
                          onChange={(e) => setExForm({ ...exForm, correct_answer: e.target.value })}
                          placeholder="Rojbaş"
                          className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                        />
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Ravekirin (Vebijarkî)
                      </label>
                      <input
                        type="text"
                        value={exForm.explanation}
                        onChange={(e) => setExForm({ ...exForm, explanation: e.target.value })}
                        placeholder="Ravekirin bi Kurmancî..."
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-lg text-sm transition"
                      >
                        {editingExId ? 'Guhertina Lîstikê Tomar Bike' : '+ Lîstika Nû Zêde Bike'}
                      </button>
                      {editingExId && (
                        <button
                          type="button"
                          onClick={resetExForm}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg text-sm"
                        >
                          Betal Bike
                        </button>
                      )}
                    </div>
                  </form>

                  <div className="space-y-2 max-h-64 overflow-y-auto border-t border-slate-100 pt-4">
                    {exercises.map((ex) => (
                      <div key={ex.id} className="flex items-center justify-between gap-2 bg-slate-50 px-3.5 py-2 rounded-lg text-sm">
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          {ex.audio_url && (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-sky-100 text-sky-700 shrink-0">
                              <Volume2 className="w-4 h-4" />
                            </span>
                          )}
                          {ex.image_url && (
                            <img
                              src={ex.image_url}
                              alt=""
                              className="w-9 h-9 rounded object-cover shrink-0 border border-slate-200"
                            />
                          )}
                          <div className="truncate">
                            <span className="text-xs font-bold text-emerald-700 mr-2">[{ex.unit_title}]</span>
                            <span className="font-medium text-slate-800">{ex.question_text}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditingExercise(ex)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-medium"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Sererast</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExercise(ex.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DERS EKLEME FORMU */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-red-600" />
                    <span>{editingId ? 'Dersê Sererast Bike' : 'Materyala Nû Zêde Bike'}</span>
                  </h2>

                  {statusMsg.text && (
                    <div
                      className={`p-3.5 rounded-xl mb-4 flex items-center gap-2 text-sm font-medium ${
                        statusMsg.type === 'error'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {statusMsg.type === 'error' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span>{statusMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveLesson} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Sernavê Dersê *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Mînak: Pergala Rojê û Gerstêrk"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Beş (Kategori)
                      </label>
                      <select
                        value={formData.category_slug}
                        onChange={(e) => setFormData({ ...formData, category_slug: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-600"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Cureyê Materyalê
                      </label>
                      <select
                        value={formData.media_type}
                        onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-600"
                      >
                        {dynamicMediaTypes.map((m) => (
                          <option key={m.id} value={m.id}>{m.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Lînka Materyalê an Pel Bar Bike
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.media_url}
                          onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                          placeholder="https://... an jî pel bar bike ->"
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600"
                        />
                        <label className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap">
                          <Upload className="w-4 h-4" />
                          <span>{uploadingField === 'media_url' ? 'Tê barkirin...' : 'Pel Bar Bike'}</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'media_url')}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Wêneyê Bergê
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.thumbnail_url}
                          onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                          placeholder="https://... an jî wêne bar bike ->"
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600"
                        />
                        <label className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap">
                          <Upload className="w-4 h-4" />
                          <span>{uploadingField === 'thumbnail_url' ? 'Tê barkirin...' : 'Wêne Bar Bike'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'thumbnail_url')}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Ast
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-600"
                      >
                        {dynamicLevels.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Pola Perwerdehiyê
                      </label>
                      <select
                        value={formData.grade_level}
                        onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-600"
                      >
                        {dynamicGrades.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Daxuyanî û Naveroka Dersê
                      </label>
                      <textarea
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Derbarê vê dersê de agahî binivîse..."
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div className="md:col-span-2 bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <label className="text-xs font-extrabold uppercase text-amber-900 flex items-center gap-1.5">
                          <ClipboardList className="w-4 h-4 text-amber-700" />
                          <span>Rêbera Mamosteyan</span>
                        </label>

                        <label className="cursor-pointer bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {uploadingField === 'guide_pdf_url'
                              ? 'PDF tê barkirin...'
                              : formData.guide_pdf_url
                              ? 'PDF Hat Barkirin ✓'
                              : 'PDFya Rêberê Bar Bike'}
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'guide_pdf_url')}
                          />
                        </label>
                      </div>

                      <textarea
                        rows="3"
                        value={formData.teacher_guide}
                        onChange={(e) => setFormData({ ...formData, teacher_guide: e.target.value })}
                        placeholder="Armancên dersê, çalakiyên polê û notên ji bo mamosteyan..."
                        className="w-full border border-amber-300 bg-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="bg-red-700 hover:bg-red-800 text-white font-bold px-6 py-2.5 rounded-lg transition"
                      >
                        {editingId ? 'Guhertinan Tomar Bike' : 'Li Malperê Zêde Bike'}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-5 py-2.5 rounded-lg transition"
                        >
                          Betal Bike
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* FERHENG YÖNETİMİ */}
                <div className="bg-white rounded-2xl border border-sky-300 p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <BookA className="w-5 h-5 text-sky-600" />
                      <span>
                        {editingWordId
                          ? 'Peyva Ferhengê Sererast Bike'
                          : `Ferheng — Peyvên Nû Zêde Bike (${totalWordCount || ferhengWords.length} tomarkirî)`}
                      </span>
                    </h2>

                    <button
                      type="button"
                      onClick={handleBulkImportDictionary}
                      disabled={Boolean(syncingProgress)}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                    >
                      + Peyvên Bingehîn Tomar Bike
                    </button>
                  </div>

                  {syncingProgress && (
                    <div className="p-3 rounded-xl mb-4 bg-sky-50 text-sky-900 border border-sky-200 text-xs font-bold">
                      {syncingProgress}
                    </div>
                  )}

                  {wordMsg && (
                    <div className="p-3 rounded-xl mb-4 bg-sky-50 text-sky-900 border border-sky-200 text-sm font-medium">
                      {wordMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveWord} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Peyv (Kurmancî) *
                      </label>
                      <input
                        type="text"
                        required
                        value={wordForm.word}
                        onChange={(e) => setWordForm({ ...wordForm, word: e.target.value })}
                        placeholder="Mînak: heval"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Cureyê Peyvê
                      </label>
                      <select
                        value={wordForm.part_of_speech}
                        onChange={(e) => setWordForm({ ...wordForm, part_of_speech: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      >
                        <option value="navdêr">navdêr</option>
                        <option value="lêker">lêker</option>
                        <option value="rengdêr">rengdêr</option>
                        <option value="hoker">hoker</option>
                        <option value="cînavk">cînavk</option>
                        <option value="hejmar">hejmar</option>
                        <option value="baneşan">baneşan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Wateya Peyvê *
                      </label>
                      <input
                        type="text"
                        required
                        value={wordForm.meaning_tr}
                        onChange={(e) => setWordForm({ ...wordForm, meaning_tr: e.target.value })}
                        placeholder="arkadaş"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Ravekirina bi Kurmancî
                      </label>
                      <input
                        type="text"
                        value={wordForm.meaning_ku}
                        onChange={(e) => setWordForm({ ...wordForm, meaning_ku: e.target.value })}
                        placeholder="Kesê ku mirov pê re dostanî dike."
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Hevoka Mînak
                      </label>
                      <input
                        type="text"
                        value={wordForm.example_sentence}
                        onChange={(e) => setWordForm({ ...wordForm, example_sentence: e.target.value })}
                        placeholder="Ew hevalê min ê herî baş e."
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-2 rounded-lg text-sm transition"
                      >
                        {editingWordId ? 'Guhertina Peyvê Tomar Bike' : '+ Peyva Nû Zêde Bike'}
                      </button>
                      {editingWordId && (
                        <button
                          type="button"
                          onClick={resetWordForm}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg text-sm"
                        >
                          Betal Bike
                        </button>
                      )}
                    </div>
                  </form>

                  <div className="space-y-2 max-h-60 overflow-y-auto border-t border-slate-100 pt-4">
                    {ferhengWords.slice(0, 100).map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-2 bg-slate-50 px-3.5 py-2 rounded-lg text-sm">
                        <div className="truncate">
                          <span className="font-bold text-slate-900 mr-2">{item.word}</span>
                          <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded mr-2">
                            {item.part_of_speech}
                          </span>
                          <span className="text-slate-600">— {item.meaning_tr}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditingWord(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-medium"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Sererast</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWord(item.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KAYITLI MATERYALLER */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">
                    Materyalên Tomarkirî ({lessons.length})
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                          <th className="py-3 px-4">Sernav</th>
                          <th className="py-3 px-4">Beş</th>
                          <th className="py-3 px-4">Ast</th>
                          <th className="py-3 px-4 text-right">Kiryar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {lessons.map((lesson) => (
                          <tr key={lesson.id} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-semibold text-slate-900">
                              {lesson.title}
                            </td>
                            <td className="py-3 px-4 text-red-600 font-medium">
                              {categories.find((c) => c.slug === lesson.category_slug)?.name}
                            </td>
                            <td className="py-3 px-4 text-slate-600">{lesson.level}</td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <button
                                onClick={() => startEditing(lesson)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Sererast</span>
                              </button>
                              <button
                                onClick={() => handleDeleteLesson(lesson.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100 font-medium"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Jê Bibe</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* KATEGORİ YÖNETİMİ */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FolderEdit className="w-5 h-5 text-red-600" />
                    <span>Beş û Sernavên Sereke Biguherîne</span>
                  </h2>

                  {catMsg && (
                    <div className="p-3 rounded-xl mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium">
                      {catMsg}
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    {categories.map((cat) => (
                      <div key={cat.slug} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => handleUpdateCategoryName(cat.slug, e.target.value)}
                          className="flex-1 border border-slate-300 rounded-lg px-3.5 py-2 text-sm font-semibold focus:outline-none focus:border-red-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.slug)}
                          className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                          title="Beşê Jê Bibe"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleSaveCategories}
                      className="bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2 rounded-lg text-sm transition"
                    >
                      Navên Beşan Tomar Bike
                    </button>
                  </div>

                  <form onSubmit={handleAddCategory} className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="Navê Beşa Nû"
                      className="flex-1 min-w-[220px] border border-slate-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-600"
                    />
                    <button
                      type="submit"
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-2 rounded-lg text-sm transition"
                    >
                      + Beşa Nû Zêde Bike
                    </button>
                  </form>
                </div>

                {/* TÜM SİTE YAZILARI */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-red-600" />
                    <span>Hemû Nivîsên Malperê Biguherîne</span>
                  </h2>

                  {settingsMsg && (
                    <div className="p-3 rounded-xl mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium">
                      {settingsMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveAllUiTexts} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {UI_FIELD_LABELS.map((field) => (
                      <div key={field.key}>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          value={ui[field.key] || ''}
                          onChange={(e) => setRawUi({ ...rawUi, [field.key]: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-600"
                        />
                      </div>
                    ))}

                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-lg transition text-sm"
                      >
                        Hemû Nivîsên Malperê Tomar Bike
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="font-bold text-white text-base">
            {ui.brand_first}<span className="text-red-500">{ui.brand_second}</span>
          </div>
          <p>{ui.footer_text}</p>
        </div>
      </footer>
    </div>
  );
}
