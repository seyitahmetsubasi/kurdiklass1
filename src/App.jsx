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
  GraduationCap,
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
  Star,
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
  learn_sentence_placeholder: 'Li peyvên jêrîn bitikîne da ku hevokê rêz bikî...',
  learn_correct_msg: 'Gelek baş e! Bersiva te rast e.',
  learn_wrong_prefix: 'Bersiva rast:',
  learn_check_btn: 'Kontrol Bike',
  learn_next_btn: 'Berdewam Bike'
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

const BUILTIN_ZAROK_FEKI = [
  {
    id: 'feki-1',
    unit_title: 'ZAROK: Fêkî',
    exercise_type: 'choice',
    question_text: '🍎 Guhdarî bike! Ev kîjan fêkî ye?',
    options: ['sêv', 'hinar', 'zebeş', 'hêjîr'],
    correct_answer: 'sêv',
    explanation: 'Sêv (Elma)',
    audio_url: 'https://mzsxryxuvyllljvbrzul.supabase.co/storage/v1/object/public/materyal/exercise_audio/1795116991119-y0yjbc.mp3#t=21,23'
  },
  {
    id: 'feki-2',
    unit_title: 'ZAROK: Fêkî',
    exercise_type: 'choice',
    question_text: '🍎 Guhdarî bike! Ev kîjan fêkî ye?',
    options: ['hinar', 'gûz', 'alû', 'xox'],
    correct_answer: 'hinar',
    explanation: 'Hinar (Nar)',
    audio_url: 'https://mzsxryxuvyllljvbrzul.supabase.co/storage/v1/object/public/materyal/exercise_audio/1795116991119-y0yjbc.mp3#t=3,4.5'
  },
  {
    id: 'feki-3',
    unit_title: 'ZAROK: Fêkî',
    exercise_type: 'choice',
    question_text: '🌰 Guhdarî bike! Ev kîjan fêkî ye?',
    options: ['gûz', 'mişmiş', 'vîşne', 'tirî'],
    correct_answer: 'gûz',
    explanation: 'Gûz (Ceviz)',
    audio_url: 'https://mzsxryxuvyllljvbrzul.supabase.co/storage/v1/object/public/materyal/exercise_audio/1795116991119-y0yjbc.mp3#t=4.5,6'
  },
  {
    id: 'feki-4',
    unit_title: 'ZAROK: Fêkî',
    exercise_type: 'choice',
    question_text: '🍑 Guhdarî bike! Ev kîjan fêkî ye?',
    options: ['alû', 'hirmî', 'pirteqal', 'sêv'],
    correct_answer: 'alû',
    explanation: 'Alû (Erik)',
    audio_url: 'https://mzsxryxuvyllljvbrzul.supabase.co/storage/v1/object/public/materyal/exercise_audio/1795116991119-y0yjbc.mp3#t=6,7.5'
  },
  {
    id: 'feki-5',
    unit_title: 'ZAROK: Fêkî',
    exercise_type: 'choice',
    question_text: '🍑 Guhdarî bike! Ev kîjan fêkî ye?',
    options: ['xox', 'zebeş', 'hinar', 'hêjîr'],
    correct_answer: 'xox',
    explanation: 'Xox (Şeftali)',
    audio_url: 'https://mzsxryxuvyllljvbrzul.supabase.co/storage/v1/object/public/materyal/exercise_audio/1795116991119-y0yjbc.mp3#t=7.5,9'
  },
  {
    id: 'feki-6',
    unit_title: 'ZAROK: Fêkî',
    exercise_type: 'choice',
    question_text: '🍊 Guhdarî bike! Ev kîjan fêkî ye?',
    options: ['mişmiş', 'gûz', 'tirî', 'vîşne'],
    correct_answer: 'mişmiş',
    explanation: 'Mişmiş (Kayısı)',
    audio_url: 'https://mzsxryxuvyllljvbrzul.supabase.co/storage/v1/object/public/materyal/exercise_audio/1795116991119-y0yjbc.mp3#t=9,10.8'
  },
  {
    id: 'feki-7',
    unit_title: 'ZAROK: Fêkî',
    exercise_type: 'choice',
    question_text: '🍉 Guhdarî bike! Ev kîjan fêkî ye?',
    options: ['zebeş', 'alû', 'hirmî', 'pirteqal'],
    correct_answer: 'zebeş',
    explanation: 'Zebeş (Karpuz)',
    audio_url: 'https://mzsxryxuvyllljvbrzul.supabase.co/storage/v1/object/public/materyal/exercise_audio/1795116991119-y0yjbc.mp3#t=10.8,12.5'
  },
  {
    id: 'feki-8',
    unit_title: 'ZAROK: Fêkî',
    exercise_type: 'choice',
    question_text: '🍒 Guhdarî bike! Ev kîjan fêkî ye?',
    options: ['vîşne', 'xox', 'sêv', 'hinar'],
    correct_answer: 'vîşne',
    explanation: 'Vîşne (Vişne)',
    audio_url: 'https://mzsxryxuvyllljvbrzul.supabase.co/storage/v1/object/public/materyal/exercise_audio/1795116991119-y0yjbc.mp3#t=12.5,14.2'
  },
  {
    id: 'feki-9',
    unit_title: 'ZAROK: Fêkî',
    exercise_type: 'choice',
    question_text: '🍐 Guhdarî bike! Ev kîjan fêkî ye?',
    options: ['hirmî', 'mişmiş', 'gûz', 'zebeş'],
    correct_answer: 'hirmî',
    explanation: 'Hirmî (Armut)',
    audio_url: 'https://mzsxryxuvyllljvbrzul.supabase.co/storage/v1/object/public/materyal/exercise_audio/1795116991119-y0yjbc.mp3#t=14.2,15.8'
  },
  {
    id: 'feki-10',
    unit_title: 'ZAROK: Fêkî',
    exercise_type: 'choice',
    question_text: '🫒 Guhdarî bike! Ev kîjan fêkî ye?',
    options: ['hêjîr', 'vîşne', 'alû', 'tirî'],
    correct_answer: 'hêjîr',
    explanation: 'Hêjîr (İncir)',
    audio_url: 'https://mzsxryxuvyllljvbrzul.supabase.co/storage/v1/object/public/materyal/exercise_audio/1795116991119-y0yjbc.mp3#t=15.8,17.5'
  },
  {
    id: 'feki-11',
    unit_title: 'ZAROK: Fêkî',
    exercise_type: 'choice',
    question_text: '🍊 Guhdarî bike! Ev kîjan fêkî ye?',
    options: ['pirteqal', 'hirmî', 'xox', 'sêv'],
    correct_answer: 'pirteqal',
    explanation: 'Pirteqal (Portakal)',
    audio_url: 'https://mzsxryxuvyllljvbrzul.supabase.co/storage/v1/object/public/materyal/exercise_audio/1795116991119-y0yjbc.mp3#t=17.5,19.3'
  },
  {
    id: 'feki-12',
    unit_title: 'ZAROK: Fêkî',
    exercise_type: 'choice',
    question_text: '🍇 Guhdarî bike! Ev kîjan fêkî ye?',
    options: ['tirî', 'hêjîr', 'hinar', 'gûz'],
    correct_answer: 'tirî',
    explanation: 'Tirî (Üzüm)',
    audio_url: 'https://mzsxryxuvyllljvbrzul.supabase.co/storage/v1/object/public/materyal/exercise_audio/1795116991119-y0yjbc.mp3#t=19.3,21'
  }
];
export default function App() {
  const [viewMode, setViewMode] = useState('student');
  const [selectedLang, setSelectedLang] = useState(() => localStorage.getItem('kk_lang') || 'KU');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const audioPlayerRef = useRef(null);

  const [rawUi, setRawUi] = useState(DEFAULT_UI);
  const ui = rawUi;

  // Dersler & Kategoriler
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonTab, setLessonTab] = useState('content');

  // Admin & Form State
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('kk_admin') === 'true');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [uploadingField, setUploadingField] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [catMsg, setCatMsg] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [settingsMsg, setSettingsMsg] = useState('');

  const [formData, setFormData] = useState({
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
  });

  // Ferheng State
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

  // Hînbûn / Lîstik State
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

  // Eşleştirme (Match) oyunu state
  const [shuffledRightOptions, setShuffledRightOptions] = useState([]);
  const [matchLeftSelected, setMatchLeftSelected] = useState(null);
  const [matchRightSelected, setMatchRightSelected] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [matchWrongFlash, setMatchWrongFlash] = useState(false);

  // Admin Lîstik Form State
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

  // =========================================================================
  // FERHENG FONKSİYONLARI
  // =========================================================================
  const fetchDictionary = async (searchText = '', letter = 'all') => {
    setSearchingDict(true);
    let query = supabase
      .from('dictionary')
      .select('*', { count: 'exact' })
      .order('word', { ascending: true });

    const q = searchText.trim();
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

    if (editingWordId) {
      const { error } = await supabase
        .from('dictionary')
        .update(wordForm)
        .eq('id', editingWordId);
      if (!error) {
        setWordMsg('Peyv hat nûkirin!');
        resetWordForm();
        fetchDictionary(ferhengQuery, selectedLetter);
      }
    } else {
      const { error } = await supabase.from('dictionary').insert([wordForm]);
      if (!error) {
        setWordMsg('Peyva nû hat zêdekirin!');
        resetWordForm();
        fetchDictionary(ferhengQuery, selectedLetter);
      }
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
    if (!error) fetchDictionary(ferhengQuery, selectedLetter);
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
      return item.word?.toLocaleUpperCase('ku').startsWith(selectedLetter);
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

  // =========================================================================
  // HÎNBÛN / LÎSTIK MOTORU (ZAROK OYUNLARI HÎNBÛN LİSTESİNDEN GİZLİ)
  // =========================================================================
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

  const handleExImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingExImg(true);
    const fileExt = file.name.split('.').pop();
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `exercises/${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from('materyal')
      .upload(filePath, file);

    if (!uploadError) {
      const { data: publicData } = supabase.storage
        .from('materyal')
        .getPublicUrl(filePath);

      if (publicData?.publicUrl) {
        setExForm((prev) => ({ ...prev, image_url: publicData.publicUrl }));
      }
    }
    setUploadingExImg(false);
  };

  const handleExAudioUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingExAudio(true);
    const fileExt = file.name.split('.').pop();
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `exercise_audio/${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from('materyal')
      .upload(filePath, file);

    if (!uploadError) {
      const { data: publicData } = supabase.storage
        .from('materyal')
        .getPublicUrl(filePath);

      if (publicData?.publicUrl) {
        setExForm((prev) => ({ ...prev, audio_url: publicData.publicUrl }));
      }
    }
    setUploadingExAudio(false);
  };

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
    if (!error) fetchExercises();
  };

  // ZAROK: Fêkî ve ZAROK: Lîstika Hevnasînê Hînbûn / Lîstik listesinden tamamen çıkarılır
  const unitList = [
    ...new Set(
      exercises
        .filter((ex) => {
          const title = (ex.unit_title || '').toLowerCase().trim();
          return (
            !title.startsWith('zarok') &&
            !title.includes('fêkî') &&
            !title.includes('feki') &&
            !title.includes('hevnasîn') &&
            !title.includes('hevnasin')
          );
        })
        .map((ex) => ex.unit_title)
    )
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
    if (answerState || matchedPairs.includes(pairId)) return;

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

  const goToNextExercise = () => {
    if (currentExIndex + 1 < unitExercises.length) {
      setCurrentExIndex((prev) => prev + 1);
      setSelectedOption('');
      setBuiltWords([]);
      setAnswerState(null);
    } else {
      setUnitCompleted(true);
      if (selectedUnit && !completedUnits.includes(selectedUnit)) {
        const updatedUnits = [...completedUnits, selectedUnit];
        setCompletedUnits(updatedUnits);
        localStorage.setItem('kk_completed_units', JSON.stringify(updatedUnits));
        const nextStreak = streakDays + 1;
        setStreakDays(nextStreak);
        localStorage.setItem('kk_streak', String(nextStreak));
      }
    }
  };
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
                          value={rawUi[field.key] || ''}
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
