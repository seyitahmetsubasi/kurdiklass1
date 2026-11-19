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
    unit_title: 'ZAROK: Fêkî',
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
  // HÎNBÛN / LÎSTIK MOTORU (SESLİ + GÖRSELLİ + GARANTİLİ MEYVE OYUNU)
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
      unit_title: 'ZAROK: Fêkî',
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

  // ZAROK: oyunları Hînbûn / Lîstik listesinde gizlenir, sadece ZAROK kategorisinden açılır
  const unitList = [
    ...new Set(
      exercises
        .filter((ex) => !ex.unit_title?.toUpperCase().startsWith('ZAROK:'))
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
  // =========================================================================
  // KATEGORİLER, AYARLAR VE DERSLER
  // =========================================================================
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      setCategories(data);
    }
  };

  const handleUpdateCategoryName = (slug, value) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.slug === slug ? { ...cat, name: value } : cat))
    );
  };

  const handleSaveCategories = async () => {
    setCatMsg('Tê tomarkirin...');
    const { error } = await supabase.from('categories').upsert(categories);
    if (error) {
      setCatMsg('Çewtî: ' + error.message);
    } else {
      setCatMsg('Navên beşan (kategorî) bi serkeftî hatin nûkirin!');
      fetchCategories();
    }
    setTimeout(() => setCatMsg(''), 4000);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const generatedSlug =
      newCatName
        .toLowerCase()
        .replace(/î/g, 'i')
        .replace(/ê/g, 'e')
        .replace(/û/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `cat-${Date.now()}`;

    const newCat = {
      slug: `${generatedSlug}-${Math.floor(100 + Math.random() * 900)}`,
      name: newCatName.trim(),
      description: '',
      sort_order: categories.length + 1
    };

    const { error } = await supabase.from('categories').insert([newCat]);
    if (error) {
      setCatMsg('Çewtî: ' + error.message);
    } else {
      setNewCatName('');
      setCatMsg('Beşa nû hat zêdekirin!');
      fetchCategories();
    }
    setTimeout(() => setCatMsg(''), 4000);
  };

  const handleDeleteCategory = async (slug) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vê beşê jê bibî?')) return;
    const { error } = await supabase.from('categories').delete().eq('slug', slug);
    if (!error) {
      fetchCategories();
    }
  };

  const fetchSiteSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (data) {
      const mergedUi = {
        ...DEFAULT_UI,
        all_categories_label: data.all_categories_label || DEFAULT_UI.all_categories_label,
        hero_badge: data.hero_badge || DEFAULT_UI.hero_badge,
        hero_title: data.hero_title || DEFAULT_UI.hero_title,
        hero_subtitle: data.hero_subtitle || DEFAULT_UI.hero_subtitle,
        footer_text: data.footer_text || DEFAULT_UI.footer_text,
        ...(data.ui_texts || {}),
        learn_next_btn: 'Berdewam Bike'
      };
      setRawUi(mergedUi);
    }
  };

  const handleSaveAllUiTexts = async (e) => {
    e.preventDefault();
    setSettingsMsg('Tê tomarkirin...');
    const cleanUi = { ...rawUi, learn_next_btn: 'Berdewam Bike' };
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 1,
        all_categories_label: cleanUi.all_categories_label,
        hero_badge: cleanUi.hero_badge,
        hero_title: cleanUi.hero_title,
        hero_subtitle: cleanUi.hero_subtitle,
        footer_text: cleanUi.footer_text,
        ui_texts: cleanUi
      });

    if (error) {
      setSettingsMsg('Çewtî: ' + error.message);
    } else {
      setSettingsMsg('Hemû nivîsên malperê bi serkeftî hatin nûkirin!');
    }
    setTimeout(() => setSettingsMsg(''), 4000);
  };

  const fetchLessons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLessons(data);
    }
    setLoading(false);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASS) {
      setIsAdmin(true);
      localStorage.setItem('kk_admin', 'true');
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Şîfre xelet e! Ji kerema xwe dîsa biceribîne.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('kk_admin');
    setViewMode('student');
  };

  const handleFileUpload = async (event, targetField) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingField(targetField);
    setStatusMsg({ type: 'loading', text: `"${file.name}" tê barkirin...` });

    const fileExt = file.name.split('.').pop();
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${targetField}/${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from('materyal')
      .upload(filePath, file);

    if (uploadError) {
      setStatusMsg({ type: 'error', text: 'Barkirin bi ser neket: ' + uploadError.message });
      setUploadingField('');
      return;
    }

    const { data: publicData } = supabase.storage
      .from('materyal')
      .getPublicUrl(filePath);

    if (publicData?.publicUrl) {
      setFormData((prev) => ({
        ...prev,
        [targetField]: publicData.publicUrl
      }));
      setStatusMsg({ type: 'success', text: 'Pel (dosya) bi serkeftî hat barkirin!' });
    }

    setUploadingField('');
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setStatusMsg({ type: 'loading', text: 'Tê tomarkirin...' });

    if (editingId) {
      const { error } = await supabase
        .from('lessons')
        .update(formData)
        .eq('id', editingId);

      if (error) {
        setStatusMsg({ type: 'error', text: 'Çewtî çêbû: ' + error.message });
      } else {
        setStatusMsg({ type: 'success', text: 'Ders bi serkeftî hat nûkirin!' });
        resetForm();
        fetchLessons();
      }
    } else {
      const { error } = await supabase
        .from('lessons')
        .insert([formData]);

      if (error) {
        setStatusMsg({ type: 'error', text: 'Çewtî çêbû: ' + error.message });
      } else {
        setStatusMsg({ type: 'success', text: 'Dersa nû li KurdiKlass hat zêdekirin!' });
        resetForm();
        fetchLessons();
      }
    }

    setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vê dersê jê bibî?')) return;
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (!error) {
      fetchLessons();
    }
  };

  const startEditing = (lesson) => {
    setEditingId(lesson.id);
    setFormData({
      title: lesson.title || '',
      description: lesson.description || '',
      category_slug: lesson.category_slug || categories[0]?.slug || 'zanist',
      media_type: lesson.media_type || 'video',
      media_url: lesson.media_url || '',
      thumbnail_url: lesson.thumbnail_url || '',
      level: lesson.level || rawUi.level_1,
      grade_level: lesson.grade_level || rawUi.grade_2,
      teacher_guide: lesson.teacher_guide || '',
      guide_pdf_url: lesson.guide_pdf_url || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      category_slug: categories[0]?.slug || 'zanist',
      media_type: 'video',
      media_url: '',
      thumbnail_url: '',
      level: rawUi.level_1,
      grade_level: rawUi.grade_2,
      teacher_guide: '',
      guide_pdf_url: ''
    });
  };

  const filteredLessons = lessons.filter((lesson) => {
    const matchesCat = selectedCategory === 'all' || lesson.category_slug === selectedCategory;
    const matchesLvl = selectedLevel === 'all' || lesson.level === selectedLevel;
    const matchesMedia = selectedMedia === 'all' || lesson.media_type === selectedMedia;
    const matchesSearch =
      lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesLvl && matchesMedia && matchesSearch;
  });

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="bg-red-700 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <div
            onClick={() => {
              setViewMode('student');
              setSelectedCategory('all');
              setActiveLesson(null);
            }}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <div className="bg-white text-red-700 font-black px-2.5 py-1 rounded text-xl tracking-tight">
              KK
            </div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {ui.brand_first}<span className="text-red-200 font-light">{ui.brand_second}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
              <button
                onClick={() => setViewMode('student')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                  viewMode === 'student'
                    ? 'bg-white text-red-700 shadow-sm'
                    : 'text-red-100 hover:bg-red-600'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{ui.nav_site}</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('learn');
                  setSelectedUnit(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                  viewMode === 'learn'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-emerald-600/90 text-white hover:bg-emerald-500'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{ui.nav_learn}</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('ferheng');
                  setSelectedWordDetail(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                  viewMode === 'ferheng'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-sky-600/90 text-white hover:bg-sky-500'
                }`}
              >
                <BookA className="w-4 h-4" />
                <span>{ui.nav_ferheng}</span>
              </button>
            </div>

            <div className="relative shrink-0" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen((prev) => !prev)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold tracking-wide bg-red-800/80 hover:bg-red-900 text-white border border-red-500/40 transition"
              >
                <span>{selectedLang}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-150 ${
                    langMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-neutral-900/95 backdrop-blur-md text-white shadow-2xl border border-neutral-700/80 py-1.5 z-50">
                  {LANGUAGE_OPTIONS.map((lang) => {
                    const isActive = selectedLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition ${
                          isActive
                            ? 'bg-neutral-800 text-white font-extrabold'
                            : 'text-neutral-200 hover:bg-neutral-800/70 font-semibold'
                        }`}
                      >
                        <span className="text-sm">{lang.nativeName}</span>
                        <span className="text-xs font-bold tracking-wider text-neutral-400">
                          {lang.code}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition ${
                viewMode === 'admin'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-red-800 text-white hover:bg-red-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">{ui.nav_admin}</span>
              <span className="sm:hidden">Admin</span>
            </button>
          </div>
        </div>

        {viewMode === 'student' && (
          <nav className="bg-red-800 border-t border-red-600/40 overflow-x-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 py-2 whitespace-nowrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold tracking-wider transition ${
                  selectedCategory === 'all'
                    ? 'bg-white text-red-800'
                    : 'text-red-100 hover:bg-red-700'
                }`}
              >
                {ui.all_categories_label}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setActiveLesson(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-bold tracking-wider transition ${
                    selectedCategory === cat.slug
                      ? 'bg-white text-red-800'
                      : 'text-red-100 hover:bg-red-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'ferheng' ? (
          <div className="max-w-3xl mx-auto bg-neutral-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-neutral-800 space-y-7">
            <div className="space-y-2">
              <div className="text-xs font-extrabold tracking-[0.2em] uppercase text-neutral-400">
                {ui.brand_first}{ui.brand_second} FERHENG
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
                {ui.nav_ferheng}
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base">
                Ferhenga Kurmancî — Peyvên Kurdî, Tirkî û Îngilîzî bibîne.
              </p>
            </div>

            <form onSubmit={handleDictionarySearchSubmit} className="relative">
              <Search className="w-5 h-5 text-neutral-300 absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={ferhengQuery}
                onChange={(e) => {
                  setFerhengQuery(e.target.value);
                  setSelectedWordDetail(null);
                }}
                placeholder={ui.ferheng_search_placeholder}
                className="w-full pl-14 pr-12 py-4 rounded-full bg-neutral-900 border-2 border-white/90 text-white placeholder-neutral-500 focus:outline-none focus:ring-4 focus:ring-white/15 text-lg font-medium transition"
              />
              {ferhengQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setFerhengQuery('');
                    setSelectedWordDetail(null);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </form>

            {ferhengQuery.trim() && filteredDictionary.length > 0 && (
              <div className="rounded-2xl bg-neutral-900/90 border border-neutral-700 p-5 sm:p-6 space-y-2 shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
                      {filteredDictionary[0].word}
                    </div>
                    <div className="text-base sm:text-lg text-neutral-200 font-medium mt-1">
                      {filteredDictionary[0].meaning_tr}
                      {filteredDictionary[0].meaning_en ? ` • ${filteredDictionary[0].meaning_en}` : ''}
                    </div>
                  </div>
                  {filteredDictionary[0].part_of_speech && (
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {filteredDictionary[0].part_of_speech}
                    </span>
                  )}
                </div>

                {filteredDictionary[0].meaning_ku && (
                  <p className="text-sm text-neutral-400 pt-1">
                    {filteredDictionary[0].meaning_ku}
                  </p>
                )}

                {filteredDictionary[0].example_sentence && (
                  <p className="text-xs italic text-neutral-400 border-l-2 border-neutral-600 pl-3 pt-0.5">
                    “{filteredDictionary[0].example_sentence}”
                  </p>
                )}
              </div>
            )}

            {selectedWordDetail && (
              <div className="rounded-2xl bg-neutral-900 border border-neutral-600 p-5 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-white">
                      {selectedWordDetail.word}
                    </h2>
                    <p className="text-neutral-200 font-medium mt-0.5">
                      {selectedWordDetail.meaning_tr}
                      {selectedWordDetail.meaning_en ? ` • ${selectedWordDetail.meaning_en}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedWordDetail(null)}
                    className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {selectedWordDetail.meaning_ku && (
                  <p className="text-sm text-neutral-400">{selectedWordDetail.meaning_ku}</p>
                )}
                {selectedWordDetail.example_sentence && (
                  <p className="text-xs italic text-neutral-400 border-l-2 border-neutral-600 pl-3">
                    “{selectedWordDetail.example_sentence}”
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedLetter('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider transition ${
                  selectedLetter === 'all'
                    ? 'bg-white text-neutral-950'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                HEMÛ
              </button>
              {kurdishAlphabet.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-7 h-7 rounded-full text-xs font-bold transition ${
                    selectedLetter === letter
                      ? 'bg-white text-neutral-950'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-1">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Hemû peyv{' '}
                {totalWordCount > 0 && (
                  <span className="text-sm font-normal text-neutral-400">
                    ({totalWordCount})
                  </span>
                )}
              </h2>

              {searchingDict && filteredDictionary.length === 0 ? (
                <div className="py-8 text-center text-sm text-neutral-400">
                  Tê lêgerîn...
                </div>
              ) : filteredDictionary.length === 0 ? (
                <div className="py-8 text-center text-sm text-neutral-400 bg-neutral-900/50 rounded-2xl border border-neutral-800">
                  {ui.ferheng_empty_text}
                </div>
              ) : (
                <div className="divide-y divide-neutral-800/90 rounded-2xl bg-neutral-900/50 border border-neutral-800 overflow-hidden">
                  {filteredDictionary.slice(0, 100).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedWordDetail(item)}
                      className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-neutral-800/70 cursor-pointer transition"
                    >
                      <div className="min-w-0">
                        <div className="font-serif text-lg font-bold text-white truncate">
                          {item.word}
                        </div>
                        <div className="text-sm text-neutral-400 truncate">
                          {item.meaning_tr}
                          {item.meaning_en ? ` • ${item.meaning_en}` : ''}
                        </div>
                      </div>

                      {item.part_of_speech && (
                        <span className="shrink-0 text-xs font-semibold text-neutral-400 bg-neutral-800 px-2.5 py-1 rounded-lg">
                          {item.part_of_speech}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : viewMode === 'learn' ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 mb-6 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black">
                  <Flame className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Rêze (Serî)</div>
                  <div className="text-sm font-black text-amber-600">{streakDays} Roj</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-black">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">{ui.learn_xp_label}</div>
                  <div className="text-sm font-black text-sky-600">{xpPoints} XP</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-black">
                  <Heart className="w-5 h-5 fill-rose-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Dil</div>
                  <div className="text-sm font-black text-rose-600">{hearts} / 5</div>
                </div>
              </div>
            </div>

            {!selectedUnit ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-6 text-white shadow-[0_6px_0_rgb(21,128,61)]">
                  <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                    BEŞA 1 • KURMANCÎ
                  </span>
                  <h1 className="text-2xl font-black mt-2">{ui.learn_title}</h1>
                  <p className="text-emerald-50 text-sm mt-1">{ui.learn_subtitle}</p>
                </div>

                {unitList.length === 0 ? (
                  <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 text-center space-y-3">
                    <p className="text-slate-600 font-semibold">{ui.learn_empty_units}</p>
                  </div>
                ) : (
                  <div className="relative py-6 flex flex-col items-center space-y-10">
                    {unitList.map((unitName, idx) => {
                      const unitItems = exercises.filter((e) => e.unit_title === unitName);
                      const isDone = completedUnits.includes(unitName);
                      const isNext =
                        !isDone &&
                        (idx === 0 || completedUnits.includes(unitList[idx - 1]));

                      const offsets = ['translate-x-0', '-translate-x-10', 'translate-x-0', 'translate-x-10'];
                      const offsetClass = offsets[idx % offsets.length];

                      return (
                        <div
                          key={unitName}
                          className={`relative flex flex-col items-center transition-transform ${offsetClass}`}
                        >
                          {isNext && (
                            <div className="mb-2 bg-white border-2 border-emerald-500 text-emerald-600 font-black text-xs px-3.5 py-1 rounded-xl shadow-md animate-bounce uppercase tracking-wider">
                              DEST PÊ BIKE!
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => startUnit(unitName)}
                            className={`w-20 h-20 rounded-full flex items-center justify-center transition active:translate-y-1 ${
                              isDone
                                ? 'bg-amber-400 text-amber-950 shadow-[0_6px_0_rgb(217,119,6)] hover:bg-amber-300'
                                : isNext
                                ? 'bg-emerald-500 text-white shadow-[0_6px_0_rgb(21,128,61)] hover:bg-emerald-400 ring-8 ring-emerald-500/20'
                                : 'bg-slate-200 text-slate-600 shadow-[0_6px_0_rgb(148,163,184)] hover:bg-slate-300'
                            }`}
                          >
                            {isDone ? (
                              <Check className="w-9 h-9 stroke-[3]" />
                            ) : (
                              <Star className="w-9 h-9 fill-current" />
                            )}
                          </button>

                          <div className="mt-3 text-center max-w-[220px]">
                            <div className="text-xs font-black uppercase text-emerald-700">
                              {ui.learn_stage_prefix} {idx + 1} • {unitItems.length} {ui.learn_question_count_suffix}
                            </div>
                            <div className="text-sm font-extrabold text-slate-800 mt-0.5">
                              {unitName}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : unitCompleted || hearts === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 text-center shadow-lg space-y-5">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                    hearts === 0
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-amber-100 text-amber-500'
                  }`}
                >
                  <Award className="w-11 h-11" />
                </div>

                <h2 className="text-2xl font-black text-slate-900">
                  {hearts === 0 ? ui.learn_lose_title : ui.learn_win_title}
                </h2>

                <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3">
                    <div className="text-xs font-bold text-amber-700 uppercase">XP</div>
                    <div className="text-xl font-black text-amber-600">+{xpPoints}</div>
                  </div>
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3">
                    <div className="text-xs font-bold text-emerald-700 uppercase">Serî</div>
                    <div className="text-xl font-black text-emerald-600">{streakDays} Roj</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => startUnit(selectedUnit)}
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black px-6 py-3 rounded-2xl shadow-[0_4px_0_rgb(21,128,61)] active:translate-y-0.5 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{ui.learn_replay_btn}</span>
                  </button>
                  <button
                    onClick={closeActiveUnit}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-black px-6 py-3 rounded-2xl shadow-[0_4px_0_rgb(148,163,184)] active:translate-y-0.5 transition"
                  >
                    {selectedUnit?.toUpperCase().startsWith('ZAROK:')
                      ? 'Vegere Beşa ZAROK'
                      : ui.learn_back_units_btn}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-lg">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={closeActiveUnit}
                      className="text-slate-400 hover:text-slate-700 p-1"
                    >
                      <X className="w-6 h-6" />
                    </button>

                    <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{
                          width: `${((currentExIndex + (answerState === 'correct' ? 1 : 0)) / unitExercises.length) * 100}%`
                        }}
                      />
                    </div>

                    {comboCount >= 2 && (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-black px-2.5 py-1 rounded-full">
                        <Zap className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{comboCount}x</span>
                      </span>
                    )}

                    <div className="flex items-center gap-1 text-rose-600 font-black text-base">
                      <Heart className="w-5 h-5 fill-rose-500" />
                      <span>{hearts}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {currentEx?.exercise_type === 'match'
                        ? ui.learn_type_match
                        : currentEx?.exercise_type === 'fill_blank'
                        ? ui.learn_type_fill
                        : currentEx?.exercise_type === 'sentence'
                        ? ui.learn_type_sentence
                        : ui.learn_type_choice}
                    </span>
                  </span>

                  {currentEx?.audio_url && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => playCurrentAudio(currentEx.audio_url)}
                        className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl font-black text-white transition active:translate-y-0.5 ${
                          isPlayingAudio
                            ? 'bg-sky-600 shadow-[0_4px_0_rgb(3,105,161)] ring-4 ring-sky-200'
                            : 'bg-sky-500 hover:bg-sky-400 shadow-[0_4px_0_rgb(2,132,199)]'
                        }`}
                      >
                        <Volume2 className={`w-6 h-6 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                        <span>Guhdarî Bike</span>
                      </button>
                    </div>
                  )}

                  {currentEx?.image_url && (
                    <div className="mt-4 mb-4 rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 h-48 sm:h-56">
                      <img
                        src={currentEx.image_url}
                        alt={currentEx.question_text}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-3 mb-6">
                    {currentEx?.question_text}
                  </h2>

                  {currentEx?.exercise_type === 'match' ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2.5">
                        {parsedMatchPairs.map((pair) => {
                          const isMatched = matchedPairs.includes(pair.id);
                          const isSelected = matchLeftSelected === pair.id;
                          return (
                            <button
                              key={`L-${pair.id}`}
                              type="button"
                              disabled={isMatched}
                              onClick={() => handleMatchSelect('left', pair.id)}
                              className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm sm:text-base border-2 transition ${
                                isMatched
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-600 opacity-60'
                                  : isSelected && matchWrongFlash
                                  ? 'bg-rose-50 border-rose-500 text-rose-700'
                                  : isSelected
                                  ? 'bg-sky-50 border-sky-500 text-sky-800 shadow-[0_3px_0_rgb(14,165,233)]'
                                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-[0_3px_0_rgb(226,232,240)]'
                              }`}
                            >
                              {pair.left}
                            </button>
                          );
                        })}
                      </div>

                      <div className="space-y-2.5">
                        {shuffledRightOptions.map((pair) => {
                          const isMatched = matchedPairs.includes(pair.id);
                          const isSelected = matchRightSelected === pair.id;
                          return (
                            <button
                              key={`R-${pair.id}`}
                              type="button"
                              disabled={isMatched}
                              onClick={() => handleMatchSelect('right', pair.id)}
                              className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm sm:text-base border-2 transition ${
                                isMatched
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-600 opacity-60'
                                  : isSelected && matchWrongFlash
                                  ? 'bg-rose-50 border-rose-500 text-rose-700'
                                  : isSelected
                                  ? 'bg-sky-50 border-sky-500 text-sky-800 shadow-[0_3px_0_rgb(14,165,233)]'
                                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-[0_3px_0_rgb(226,232,240)]'
                              }`}
                            >
                              {pair.right}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : currentEx?.exercise_type === 'sentence' ? (
                    <div className="space-y-6">
                      <div className="min-h-[72px] p-3.5 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-wrap gap-2 items-center">
                        {builtWords.length === 0 ? (
                          <span className="text-xs font-semibold text-slate-400">
                            {ui.learn_sentence_placeholder}
                          </span>
                        ) : (
                          builtWords.map((item) => (
                            <button
                              key={item.idx}
                              type="button"
                              onClick={() => toggleSentenceWord(item.word, item.idx)}
                              className="bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-xl text-sm shadow-[0_3px_0_rgb(21,128,61)]"
                            >
                              {item.word}
                            </button>
                          ))
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2.5 justify-center">
                        {(currentEx.options || []).map((word, idx) => {
                          const isUsed = builtWords.some((item) => item.idx === idx);
                          return (
                            <button
                              key={idx}
                              type="button"
                              disabled={isUsed || Boolean(answerState)}
                              onClick={() => toggleSentenceWord(word, idx)}
                              className={`px-4 py-2.5 rounded-2xl font-extrabold text-sm border-2 transition ${
                                isUsed
                                  ? 'bg-slate-100 text-slate-300 border-slate-200'
                                  : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-400 shadow-[0_3px_0_rgb(226,232,240)] active:translate-y-0.5'
                              }`}
                            >
                              {word}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {(currentEx?.options || []).map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          disabled={Boolean(answerState)}
                          onClick={() => setSelectedOption(opt)}
                          className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 font-bold text-base flex items-center gap-3 transition ${
                            selectedOption === opt
                              ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-[0_3px_0_rgb(14,165,233)]'
                              : 'border-slate-200 hover:border-slate-300 text-slate-800 shadow-[0_3px_0_rgb(226,232,240)]'
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-xs font-black shrink-0 ${
                              selectedOption === opt
                                ? 'border-sky-500 bg-sky-500 text-white'
                                : 'border-slate-300 text-slate-500'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className={`p-5 sm:px-8 border-t-2 transition-colors ${
                    answerState === 'correct'
                      ? 'bg-emerald-100 border-emerald-300'
                      : answerState === 'wrong'
                      ? 'bg-rose-100 border-rose-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {answerState === 'correct' && (
                    <div className="mb-4 text-emerald-900">
                      <div className="font-black text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        <span>{ui.learn_correct_msg}</span>
                      </div>
                      {currentEx?.explanation && (
                        <p className="text-sm mt-1 text-emerald-800 font-medium">{currentEx.explanation}</p>
                      )}
                    </div>
                  )}

                  {answerState === 'wrong' && (
                    <div className="mb-4 text-rose-900">
                      <div className="font-black text-lg flex items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-rose-600" />
                        <span>{ui.learn_wrong_prefix} {currentEx?.correct_answer}</span>
                      </div>
                      {currentEx?.explanation && (
                        <p className="text-sm mt-1 text-rose-800 font-medium">{currentEx.explanation}</p>
                      )}
                    </div>
                  )}

                  {!answerState ? (
                    currentEx?.exercise_type !== 'match' && (
                      <button
                        type="button"
                        onClick={checkExerciseAnswer}
                        disabled={
                          currentEx?.exercise_type === 'sentence'
                            ? builtWords.length === 0
                            : !selectedOption
                        }
                        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-300 disabled:shadow-none text-white font-black py-3.5 rounded-2xl shadow-[0_4px_0_rgb(21,128,61)] active:translate-y-0.5 transition uppercase tracking-wider"
                      >
                        {ui.learn_check_btn}
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={goToNextExercise}
                      className={`w-full font-black py-3.5 rounded-2xl text-white uppercase tracking-wider active:translate-y-0.5 transition ${
                        answerState === 'correct'
                          ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_4px_0_rgb(21,128,61)]'
                          : 'bg-rose-600 hover:bg-rose-500 shadow-[0_4px_0_rgb(190,18,60)]'
                      }`}
                    >
                      Berdewam Bike
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : viewMode === 'student' ? (
          <>
            <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-lg">
              <div className="max-w-2xl">
                <span className="inline-block bg-red-600/80 text-red-100 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                  {ui.hero_badge}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 leading-tight">
                  {ui.hero_title}
                </h1>
                <p className="text-red-100 text-sm sm:text-base mb-6">
                  {ui.hero_subtitle}
                </p>

                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={ui.search_placeholder}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-red-400/50 shadow-inner"
                  />
                </div>
              </div>
            </div>

            {activeLesson && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded">
                      {categories.find((c) => c.slug === activeLesson.category_slug)?.name || 'DERS'}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-2">{activeLesson.title}</h2>
                  </div>
                  <button
                    onClick={() => setActiveLesson(null)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
                  <button
                    onClick={() => setLessonTab('content')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition ${
                      lessonTab === 'content'
                        ? 'border-red-600 text-red-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{ui.tab_content}</span>
                  </button>

                  {(activeLesson.teacher_guide || activeLesson.guide_pdf_url) && (
                    <button
                      onClick={() => setLessonTab('guide')}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition ${
                        lessonTab === 'guide'
                          ? 'border-red-600 text-red-700'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <ClipboardList className="w-4 h-4" />
                      <span>{ui.tab_guide}</span>
                    </button>
                  )}
                </div>

                {lessonTab === 'content' ? (
                  <>
                    {activeLesson.media_url && (
                      <div className="mb-6">
                        {activeLesson.media_type === 'video' ? (
                          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                            <iframe
                              src={getEmbedUrl(activeLesson.media_url)}
                              title={activeLesson.title}
                              className="w-full h-full"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <a
                            href={activeLesson.media_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-xl transition"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>{ui.btn_open_material} ({activeLesson.media_type.toUpperCase()})</span>
                          </a>
                        )}
                      </div>
                    )}

                    <p className="text-slate-700 leading-relaxed whitespace-pre-line mb-4">
                      {activeLesson.description}
                    </p>
                  </>
                ) : (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <h3 className="font-bold text-amber-950 text-base flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-amber-700" />
                        <span>{ui.guide_heading}</span>
                      </h3>
                      {activeLesson.guide_pdf_url && (
                        <a
                          href={activeLesson.guide_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                        >
                          <Download className="w-4 h-4" />
                          <span>{ui.guide_download_btn}</span>
                        </a>
                      )}
                    </div>
                    <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                      {activeLesson.teacher_guide || ui.guide_empty_text}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600 pt-4 mt-4 border-t border-slate-100">
                  <span className="bg-slate-100 px-3 py-1 rounded-full">
                    {ui.meta_level_prefix} <strong>{activeLesson.level}</strong>
                  </span>
                  <span className="bg-slate-100 px-3 py-1 rounded-full">
                    {ui.meta_grade_prefix} <strong>{activeLesson.grade_level}</strong>
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1 space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                    <Filter className="w-4 h-4 text-red-600" />
                    <span>{ui.filter_title}</span>
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      {ui.filter_level_label}
                    </label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600"
                    >
                      <option value="all">{ui.filter_level_all}</option>
                      {dynamicLevels.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      {ui.filter_media_label}
                    </label>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => setSelectedMedia('all')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                          selectedMedia === 'all'
                            ? 'bg-red-50 text-red-700 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {ui.filter_media_all}
                      </button>
                      {dynamicMediaTypes.map((m) => {
                        const Icon = m.icon;
                        return (
                          <button
                            key={m.id}
                            onClick={() => setSelectedMedia(m.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                              selectedMedia === m.id
                                ? 'bg-red-50 text-red-700 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>

              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">
                    {selectedCategory === 'all'
                      ? ui.list_all_title
                      : categories.find((c) => c.slug === selectedCategory)?.name}
                  </h2>
                  <span className="text-sm text-slate-500 font-medium">
                    {filteredLessons.length} {ui.list_count_suffix}
                  </span>
                </div>

                {loading ? (
                  <div className="bg-white rounded-xl p-12 text-center border border-slate-200 text-slate-500">
                    {ui.loading_text}
                  </div>
                ) : filteredLessons.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-700 mb-1">
                      {ui.empty_title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">
                      {ui.empty_subtitle}
                    </p>
                    <button
                      onClick={() => setViewMode('admin')}
                      className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{ui.empty_button}</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredLessons.map((lesson) => {
                      const catObj = categories.find((c) => c.slug === lesson.category_slug);
                      const hasGuide = Boolean(lesson.teacher_guide || lesson.guide_pdf_url);
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            if (lesson.media_type === 'interactive') {
                              setViewMode('learn');
                              const targetUnit = lesson.media_url?.trim()
                                ? lesson.media_url.trim()
                                : lesson.title?.toLowerCase().includes('fêkî')
                                ? 'ZAROK: Fêkî'
                                : 'ZAROK: Lîstika Hevnasînê';
                              startUnit(targetUnit);
                              return;
                            }
                            setActiveLesson(lesson);
                            setLessonTab('content');
                            window.scrollTo({ top: 180, behavior: 'smooth' });
                          }}
                          className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-red-300 transition cursor-pointer flex flex-col"
                        >
                          <div className="h-40 bg-red-950 relative flex items-center justify-center overflow-hidden">
                            {lesson.thumbnail_url ? (
                              <img
                                src={lesson.thumbnail_url}
                                alt={lesson.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <GraduationCap className="w-14 h-14 text-red-400/50" />
                            )}
                            <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow">
                              {catObj?.name || 'DERS'}
                            </span>
                            {hasGuide && (
                              <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                                {ui.card_guide_badge}
                              </span>
                            )}
                            <span className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-xs px-2.5 py-0.5 rounded capitalize">
                              {lesson.media_type}
                            </span>
                          </div>

                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2">
                              {lesson.title}
                            </h3>
                            <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
                              {lesson.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                              <span>{lesson.grade_level}</span>
                              <span className="font-semibold text-red-600">{lesson.level}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
