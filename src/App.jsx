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
  Globe,
  ChevronDown,
  Flame,
  Star,
  Check,
  Zap,
  Image as ImageIcon,
  Eye,
  LayoutDashboard
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
  { code: 'TR', nativeName: 'Türkçe' },
  { code: 'EN', nativeName: 'English' }
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
  ferheng_search_placeholder: 'Peyvekê bi Kurmancî an Tirkî binivîse...',
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
    question_text: 'Peyvên Kurmancî bi wateyên wan ên Tirkî re bighîne hev:',
    options: ['Silav=Merhaba', 'Spas=Teşekkürler', 'Belê=Evet', 'Na=Hayır'],
    correct_answer: '4',
    explanation: 'Silav (Merhaba) û Spas (Teşekkürler) peyvên herî bingehîn ên rojane ne.'
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
    question_text: 'Peyvan rêz bike û vê hevokê saz bike: "Ben okula gidiyorum."',
    options: ['Ez', 'diçim', 'dibistanê.', 'tu', 'malê'],
    correct_answer: 'Ez diçim dibistanê.',
    explanation: 'Di Kurmancî de lêker (diçim) berî cihê çûnê (dibistanê) tê.'
  },
  {
    unit_title: 'Beşa 2: Malbat û Hejmar',
    exercise_type: 'fill_blank',
    question_text: 'Valahiyê tije bike: "Navê _____ Azad e." (Benim adım Azad.)',
    options: ['min', 'te', 'wî', 'me'],
    correct_answer: 'min',
    explanation: 'Cînavka "min" wateya "benim" dide: Navê min = Benim adım.'
  },
  {
    unit_title: 'Beşa 2: Malbat û Hejmar',
    exercise_type: 'match',
    question_text: 'Endamên malbatê bi hev re bighîne:',
    options: ['Dayik=Anne', 'Bav=Baba', 'Xwişk=Kız kardeş', 'Bira=Erkek kardeş'],
    correct_answer: '4',
    explanation: 'Dayik (anne), Bav (baba), Xwişk (kız kardeş), Bira (erkek kardeş).'
  }
];

export default function App() {
  const [viewMode, setViewMode] = useState('student');
  const [selectedLang, setSelectedLang] = useState(() => localStorage.getItem('kk_lang') || 'KU');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef(null);

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
  const [externalDictResults, setExternalDictResults] = useState([]);
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

  // Duolingo Hînbûn / Lîstik State
  const [exercises, setExercises] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [builtWords, setBuiltWords] = useState([]);
  const [answerState, setAnswerState] = useState(null);
  const [unitCompleted, setUnitCompleted] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [comboCount, setComboCount] = useState(0);
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
  const [exForm, setExForm] = useState({
    unit_title: 'Beşa 1: Silav û Nasîn',
    exercise_type: 'choice',
    question_text: '',
    options_raw: '',
    correct_answer: '',
    explanation: '',
    image_url: ''
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
    fetchDictionary();
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
  const fetchDictionary = async () => {
    const { data, error } = await supabase
      .from('dictionary')
      .select('*')
      .order('word', { ascending: true })
      .limit(1000);
    if (!error && data) {
      setFerhengWords(data);
    }
  };

  const handleDictionarySearchSubmit = async (e) => {
    e.preventDefault();
    const q = ferhengQuery.trim();
    if (!q) return;

    setSearchingDict(true);
    try {
      const url = `https://ku.wiktionary.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*`;
      const res = await fetch(url);
      const json = await res.json();
      const hits = json?.query?.search || [];
      const mapped = hits.map((h, idx) => ({
        id: `wiki-${idx}-${h.pageid}`,
        word: h.title,
        part_of_speech: 'wîkîferheng',
        meaning_tr: h.snippet.replace(/<[^>]+>/g, ''),
        meaning_ku: '',
        example_sentence: '',
        isPriorityMatch: h.title.toLowerCase() === q.toLowerCase()
      }));
      setExternalDictResults(mapped);
    } catch {
      setExternalDictResults([]);
    }
    setSearchingDict(false);
  };

  const handleBulkImportDictionary = async () => {
    setSyncingProgress('Peyvên bingehîn tên barkirin...');
    const sampleWords = [
      { word: 'av', part_of_speech: 'navdêr', meaning_tr: 'su', meaning_ku: 'Şileya bingehîn a jiyanê.', example_sentence: 'Av jiyan e.' },
      { word: 'nan', part_of_speech: 'navdêr', meaning_tr: 'ekmek', meaning_ku: 'Xwarina bingehîn a ji ardê.', example_sentence: 'Nanê germ xweş e.' },
      { word: 'roj', part_of_speech: 'navdêr', meaning_tr: 'güneş / gün', meaning_ku: 'Stêrka ku ronahiyê dide cîhanê.', example_sentence: 'Îro roj gelekî germ e.' },
      { word: 'pirtûk', part_of_speech: 'navdêr', meaning_tr: 'kitap', meaning_ku: 'Berhema nivîskî ya xwendinê.', example_sentence: 'Ez her roj pirtûkekê dixwînim.' },
      { word: 'dibistan', part_of_speech: 'navdêr', meaning_tr: 'okul', meaning_ku: 'Saziya perwerdehiyê.', example_sentence: 'Zarok diçin dibistanê.' }
    ];
    const { error } = await supabase.from('dictionary').insert(sampleWords);
    if (error) {
      setSyncingProgress('Çewtî: ' + error.message);
    } else {
      setSyncingProgress('Peyv bi serkeftî hatin zêdekirin!');
      fetchDictionary();
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
        fetchDictionary();
      }
    } else {
      const { error } = await supabase.from('dictionary').insert([wordForm]);
      if (!error) {
        setWordMsg('Peyva nû hat zêdekirin!');
        resetWordForm();
        fetchDictionary();
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
    if (!error) fetchDictionary();
  };

  const mergedDictionary = (() => {
    const q = ferhengQuery.trim().toLowerCase();
    const localFiltered = ferhengWords.map((w) => ({
      ...w,
      isPriorityMatch: Boolean(q && w.word?.toLowerCase() === q)
    }));
    const localSet = new Set(localFiltered.map((w) => w.word?.toLowerCase()));
    const otherExternal = externalDictResults.filter(
      (ext) => !localSet.has(ext.word?.toLowerCase())
    );
    const combined = [...localFiltered, ...otherExternal];

    return combined.sort((a, b) => {
      if (a.isPriorityMatch && !b.isPriorityMatch) return -1;
      if (!a.isPriorityMatch && b.isPriorityMatch) return 1;
      const aExact = a.word?.toLowerCase() === q ? 0 : 1;
      const bExact = b.word?.toLowerCase() === q ? 0 : 1;
      if (aExact !== bExact) return aExact - bExact;
      const aStarts = a.word?.toLowerCase().startsWith(q) ? 0 : 1;
      const bStarts = b.word?.toLowerCase().startsWith(q) ? 0 : 1;
      return aStarts - bStarts;
    });
  })();

  const filteredDictionary = mergedDictionary.filter((item) => {
    const q = ferhengQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.isPriorityMatch ||
      item.word?.toLowerCase().includes(q) ||
      item.meaning_tr?.toLowerCase().includes(q) ||
      item.meaning_ku?.toLowerCase().includes(q);
    const matchesLetter =
      selectedLetter === 'all' ||
      item.word?.toLocaleUpperCase('ku').startsWith(selectedLetter);
    return matchesSearch && matchesLetter;
  });

  // =========================================================================
  // DUOLINGO TARZI HÎNBÛN / LÎSTIK MOTORU
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
    setExMsg('Paketa lîstikên Duolingo tê barkirin...');
    const rows = STARTER_GAMES.map((g, idx) => ({
      ...g,
      sort_order: exercises.length + idx + 1
    }));
    const { error } = await supabase.from('kurmanci_exercises').insert(rows);
    if (error) {
      setExMsg('Çewtî: ' + error.message);
    } else {
      setExMsg('5 lîstikên înteraktîf (Eşleştirme, Cümle Kurma, Boşluk Doldurma) hatin zêdekirin!');
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
      image_url: exForm.image_url.trim()
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
        setExMsg('Lîstika nû li beşa Hînbûn / Lîstik hat zêdekirin!');
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
      image_url: ex.image_url || ''
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
      image_url: ''
    });
  };

  const handleDeleteExercise = async (id) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vê lîstikê jê bibî?')) return;
    const { error } = await supabase.from('kurmanci_exercises').delete().eq('id', id);
    if (!error) fetchExercises();
  };

  const unitList = [...new Set(exercises.map((ex) => ex.unit_title))];
  const unitExercises = selectedUnit
    ? exercises.filter((ex) => ex.unit_title === selectedUnit)
    : [];
  const currentEx = unitExercises[currentExIndex];

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
      setRawUi((prev) => ({
        ...prev,
        all_categories_label: data.all_categories_label || prev.all_categories_label,
        hero_badge: data.hero_badge || prev.hero_badge,
        hero_title: data.hero_title || prev.hero_title,
        hero_subtitle: data.hero_subtitle || prev.hero_subtitle,
        footer_text: data.footer_text || prev.footer_text,
        ...(data.ui_texts || {})
      }));
    }
  };

  const handleSaveAllUiTexts = async (e) => {
    e.preventDefault();
    setSettingsMsg('Tê tomarkirin...');
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 1,
        all_categories_label: rawUi.all_categories_label,
        hero_badge: rawUi.hero_badge,
        hero_title: rawUi.hero_title,
        hero_subtitle: rawUi.hero_subtitle,
        footer_text: rawUi.footer_text,
        ui_texts: rawUi
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
          <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
            <form onSubmit={handleDictionarySearchSubmit} className="flex gap-2.5">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={ferhengQuery}
                  onChange={(e) => {
                    setFerhengQuery(e.target.value);
                    setSelectedWordDetail(null);
                  }}
                  placeholder={ui.ferheng_search_placeholder}
                  className="w-full pl-12 pr-10 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 text-base"
                />
                {ferhengQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setFerhengQuery('');
                      setSelectedWordDetail(null);
                    }}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold px-6 py-3 rounded-2xl transition whitespace-nowrap"
              >
                {ui.ferheng_search_btn}
              </button>
            </form>

            {selectedWordDetail && (
              <div className="bg-slate-800 border border-sky-500/40 rounded-2xl p-5 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-black text-white">{selectedWordDetail.word}</h2>
                    <p className="text-sky-300 font-semibold text-base mt-0.5">
                      {selectedWordDetail.meaning_tr}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-sky-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-lg">
                      {selectedWordDetail.part_of_speech || 'navdêr'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedWordDetail(null)}
                      className="p-1.5 rounded-lg bg-slate-700 text-slate-300 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {selectedWordDetail.meaning_ku && (
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedWordDetail.meaning_ku}
                  </p>
                )}
                {selectedWordDetail.example_sentence && (
                  <p className="text-xs italic text-slate-400 border-l-2 border-sky-400 pl-3">
                    “{selectedWordDetail.example_sentence}”
                  </p>
                )}
              </div>
            )}

            <div className="divide-y divide-slate-800 bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden">
              {searchingDict && filteredDictionary.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400">
                  Tê lêgerîn...
                </div>
              ) : filteredDictionary.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400">
                  {ui.ferheng_empty_text}
                </div>
              ) : (
                filteredDictionary.slice(0, 20).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedWordDetail(item)}
                    className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-800/70 cursor-pointer transition"
                  >
                    <div className="min-w-0">
                      <div className="text-lg font-extrabold text-white truncate">
                        {item.word}
                      </div>
                      <div className="text-sm text-sky-300 font-medium truncate">
                        {item.meaning_tr}
                      </div>
                    </div>

                    <span className="shrink-0 bg-sky-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-lg">
                      {item.part_of_speech || 'navdêr'}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedLetter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold tracking-wider transition ${
                  selectedLetter === 'all'
                    ? 'bg-sky-400 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                HEMÛ
              </button>
              {kurdishAlphabet.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-7 h-7 rounded-lg text-xs font-extrabold transition ${
                    selectedLetter === letter
                      ? 'bg-sky-400 text-slate-950'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        ) : viewMode === 'learn' ? (
          <div className="max-w-2xl mx-auto">
            {/* DUOLINGO ÜST DURUM ÇUBUĞU: SERİ (STREAK) + XP + CAN */}
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
              /* DUOLINGO DİKEY ZİKZAK ÖĞRENME YOLU (LEARNING PATH) */
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
              /* DERS SONU ÖDÜL EKRANI */
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
                    onClick={() => setSelectedUnit(null)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-black px-6 py-3 rounded-2xl shadow-[0_4px_0_rgb(148,163,184)] active:translate-y-0.5 transition"
                  >
                    {ui.learn_back_units_btn}
                  </button>
                </div>
              </div>
            ) : (
              /* AKTİF DUOLINGO OYUN ARENASI */
              <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-lg">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={() => setSelectedUnit(null)}
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
                      {ui.learn_next_btn}
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
                          : 'Hînbûn / Lîstik — Lîstikên Duolingo Zêde Bike û Biguherîne'}
                      </span>
                    </h2>

                    <button
                      type="button"
                      onClick={handleLoadStarterGames}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                    >
                      + Paketa Destpêkê ya Lîstikan Bar Bike (Duolingo)
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 mb-4">
                    Cureyên lîstikan: <strong>Çoktan Seçmeli</strong>, <strong>Kelime Sıralama</strong>, <strong>Eşleştirme</strong> (Mînak: <code>Silav=Merhaba, Spas=Teşekkürler</code>) û <strong>Boşluk Doldurma</strong>.
                  </p>

                  {exMsg && (
                    <div className="p-3 rounded-xl mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium">
                      {exMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveExercise} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Navê Beşê / Qonaxê (Ünite Adı)
                      </label>
                      <input
                        type="text"
                        required
                        value={exForm.unit_title}
                        onChange={(e) => setExForm({ ...exForm, unit_title: e.target.value })}
                        placeholder="Mînak: Beşa 1: Silav û Nasîn"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Cureyê Lîstikê (Oyun Türü)
                      </label>
                      <select
                        value={exForm.exercise_type}
                        onChange={(e) => setExForm({ ...exForm, exercise_type: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      >
                        <option value="choice">Çoktan Seçmeli (Vebijêrka Rast)</option>
                        <option value="sentence">Kelime Sıralama / Cümle Kurma (Peyvan Rêz Bike)</option>
                        <option value="match">Eşleştirme Oyunu (Peyvan Bighîne Hev)</option>
                        <option value="fill_blank">Boşluk Doldurma (Valahiyê Tije Bike)</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Pirs an Rênîşander (Soru / Talimat Metni)
                      </label>
                      <input
                        type="text"
                        required
                        value={exForm.question_text}
                        onChange={(e) => setExForm({ ...exForm, question_text: e.target.value })}
                        placeholder="Mînak: Peyvên Kurmancî bi wateyên wan re bighîne hev:"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Wêneyê Lîstikê (Görsel Yükle / URL - Opsiyonel)
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
                          ? 'Cotên Peyvan (Virgülle ayırın: Kürtçe=Karşılığı)'
                          : 'Vebijêrk an Peyv (Virgülle ayırın)'}
                      </label>
                      <input
                        type="text"
                        required
                        value={exForm.options_raw}
                        onChange={(e) => setExForm({ ...exForm, options_raw: e.target.value })}
                        placeholder={
                          exForm.exercise_type === 'match'
                            ? 'Silav=Merhaba, Spas=Teşekkürler, Belê=Evet, Na=Hayır'
                            : 'Ez, diçim, dibistanê., tu, malê'
                        }
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    {exForm.exercise_type !== 'match' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          Bersiva Rast (Tam Doğru Cevap)
                        </label>
                        <input
                          type="text"
                          required
                          value={exForm.correct_answer}
                          onChange={(e) => setExForm({ ...exForm, correct_answer: e.target.value })}
                          placeholder="Ez diçim dibistanê."
                          className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                        />
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Ravekirin (Cevap Sonrası Açıklama - Opsiyonel)
                      </label>
                      <input
                        type="text"
                        value={exForm.explanation}
                        onChange={(e) => setExForm({ ...exForm, explanation: e.target.value })}
                        placeholder="Kısa dilbilgisi veya kelime notu..."
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
                        Sernavê Dersê (Başlık) *
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
                        Lînka Materyalê an Pel Bar Bike (PDF / Deng / Vîdyo)
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
                        Wêneyê Bergê (Kapak Görseli Yükle / URL)
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
                        Ast (Seviye)
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
                        Pola Perwerdehiyê (Sınıf Düzeyi)
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
                        Daxuyanî û Naveroka Dersê (Öğrenci Açıklaması)
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
                          <span>Rêbera Mamosteyan (Öğretmen Rehberi & Ders Planı - Opsiyonel)</span>
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
                          : `Ferheng — Peyvên Nû Zêde Bike û Biguherîne (${ferhengWords.length} peyv)`}
                      </span>
                    </h2>

                    <button
                      type="button"
                      onClick={handleBulkImportDictionary}
                      disabled={Boolean(syncingProgress)}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                    >
                      + Hemû Peyvên Çavkaniya Vekirî Bikişîne Ferhengê
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
                        placeholder="Mînak: ziman"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Cureyê Peyvê (Kelime Türü)
                      </label>
                      <select
                        value={wordForm.part_of_speech}
                        onChange={(e) => setWordForm({ ...wordForm, part_of_speech: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      >
                        <option value="navdêr">navdêr (isim)</option>
                        <option value="lêker">lêker (fiil)</option>
                        <option value="rengdêr">rengdêr (sıfat)</option>
                        <option value="hoker">hoker (zarf)</option>
                        <option value="cînavk">cînavk (zamir)</option>
                        <option value="hejmar">hejmar (sayı)</option>
                        <option value="baneşan">baneşan (ünlem)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Wateya bi Tirkî (Türkçe Karşılığı) *
                      </label>
                      <input
                        type="text"
                        required
                        value={wordForm.meaning_tr}
                        onChange={(e) => setWordForm({ ...wordForm, meaning_tr: e.target.value })}
                        placeholder="Mînak: dil"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Ravekirina bi Kurdî (Kürtçe Açıklama - Opsiyonel)
                      </label>
                      <input
                        type="text"
                        value={wordForm.meaning_ku}
                        onChange={(e) => setWordForm({ ...wordForm, meaning_ku: e.target.value })}
                        placeholder="Amûra axaftin û ragihandinê..."
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Hevoka Mînak (Örnek Cümle - Opsiyonel)
                      </label>
                      <input
                        type="text"
                        value={wordForm.example_sentence}
                        onChange={(e) => setWordForm({ ...wordForm, example_sentence: e.target.value })}
                        placeholder="Zimanê Kurdî gelekî dewlemend e."
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
                    <span>Beş û Sernavên Sereke Biguherîne (Ana Menü Kategorileri)</span>
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
                      placeholder="Navê Beşa Nû (Mînak: DÎROK û ERDNÎGARÎ)"
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
                    <span>Hemû Nivîsên Malperê Biguherîne (Sitedeki Tüm Yazılar)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mb-5">
                    Sernav, bişkojk, beşa Ferheng, Hînbûn / Lîstik, parzûn, ast û hemû nivîsên ku li ser malperê xuya dikin ji vir biguherîne.
                  </p>

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
