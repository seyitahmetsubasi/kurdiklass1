import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import {
  Search, BookOpen, Video, FileText, Headphones, MonitorPlay,
  Plus, Trash2, Edit3, LayoutDashboard, Eye, Filter, X,
  GraduationCap, CheckCircle2, AlertCircle, ExternalLink, Lock,
  Upload, LogOut, ClipboardList, Download, Settings, FolderEdit,
  Sparkles, Award, ArrowRight, RotateCcw, Heart, Image as ImageIcon,
  BookA, Globe, BookmarkPlus
} from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { slug: 'zanist', name: 'ZANIST', description: 'Fîzîk, kîmya, biyolojî û xweza', sort_order: 1 },
  { slug: 'birkari', name: 'BÎRKARÎ', description: 'Hejmêr, geometrî û mantiq', sort_order: 2 },
  { slug: 'ziman-weje', name: 'ZIMAN û WÊJEYA KURDÎ', description: 'Rêziman, çîrok, helbest û xwendin', sort_order: 3 },
  { slug: 'zarok', name: 'ZAROK', description: 'Pêşdibistan, lîstik û fêrbûna bingehîn', sort_order: 4 },
  { slug: 'huner', name: 'HUNER', description: 'Muzîk, wêne, şano û çand', sort_order: 5 },
  { slug: 'teknoloji', name: 'TEKNOLOJÎ', description: 'Bîrkarî, bernameçêkirin û zanista dîjîtal', sort_order: 6 }
];

const DEFAULT_UI_TEXTS = {
  brand_first: 'Kurdi',
  brand_second: 'Klass',
  nav_site: 'Malper (Sîte)',
  nav_learn: 'Hînbûn / Lîstik',
  nav_ferheng: 'Ferheng (Sözlük)',
  nav_admin: 'Panela Rêveber (Admin)',
  all_categories_label: 'HEMÛ BEŞ (TÜMÜ)',
  hero_badge: 'Çavkaniyên Perwerdehiyê yên Kurdî',
  hero_title: 'Fêrbûn, Lêkolîn û Pêşketin bi Zimanê Kurdî',
  hero_subtitle: 'Vîdyo, belge, rêbera mamosteyan û materyalên perwerdehiyê ji bo mamoste û xwendekaran.',
  search_placeholder: 'Li ders, mijar an materyalan bigere...',
  filter_title: 'Parzûn (Filtre)',
  filter_level_label: 'Ast (Seviye)',
  filter_level_all: 'Hemû Ast',
  level_1: 'Destpêk',
  level_2: 'Navîn',
  level_3: 'Pêşketî',
  grade_1: 'Pêşdibistan',
  grade_2: 'Dibistana Seretayî',
  grade_3: 'Dibistana Navîn',
  grade_4: 'Lîse',
  filter_media_label: 'Cureyê Materyalê',
  filter_media_all: 'Hemû Cure',
  media_video: 'Vîdyo',
  media_pdf: 'Belge / PDF',
  media_audio: 'Deng / Podcast',
  media_interactive: 'Çalakiya Interaktîf',
  list_all_title: 'Hemû Materyalên Perwerdehiyê',
  list_count_suffix: 'materyal hat dîtin',
  loading_text: 'Materyal tên barkirin...',
  empty_title: 'Hêj di vê beşê de materyal tune ye',
  empty_subtitle: 'Ji bo zêdekirina dersa yekem derbasî Panela Rêveber (Admin) bibin.',
  empty_button: 'Materyala Yekem Zêde Bike',
  card_guide_badge: 'Rêbera Mamosteyan',
  tab_content: 'Naveroka Dersê (Ders İçeriği)',
  tab_guide: 'Rêbera Mamosteyan (Öğretmen Rehberi)',
  btn_open_material: 'Materyalê Veke / Daxe',
  guide_heading: 'Plana Dersê û Pêşniyarên ji bo Mamosteyan',
  guide_download_btn: 'Pela Rêberê Daxe (PDF)',
  guide_empty_text: 'Ji bo vê dersê pela rêberê li jor hatiye barkirin.',
  meta_level_prefix: 'Ast:',
  meta_grade_prefix: 'Pola Perwerdehiyê:',
  footer_text: 'Platforma Perwerdehiyê ya Kurdî — Hemû maf parastî ne.',

  // Ferheng (Sözlük) Yazıları
  ferheng_title: 'Ferhenga KurdiKlass û Wîkîferheng',
  ferheng_subtitle: 'Hemû peyvên Wîkîferhengê û ferhenga taybet a KurdiKlass di yek cihî de!',
  ferheng_search_placeholder: 'Peyvekê binivîse (Mînak: pirtûk, av, roj, zanist)...',
  ferheng_wiki_btn: 'Wîkîferhengê Nû Bike',
  ferheng_empty_text: 'Ji bo lêgerînê peyvekê binivîse an li tîpekê bitikîne.',

  // Hînbûn / Lîstik Yazıları
  learn_title: 'Fêrbûna Kurmancî — Lîstik û Rahênan',
  learn_subtitle: 'Bi gavên kurt û lîstikên nivîskî (bê deng) Kurmancî hîn bibe!',
  learn_xp_label: 'Pûan (XP)',
  learn_units_heading: 'Beşên Fêrbûnê Hilbijêre (Asta 1):',
  learn_empty_units: 'Hêj pirs nehatine zêdekirin. Ji Panela Rêveber pirsan zêde bikin.',
  learn_stage_prefix: 'Qonax',
  learn_question_count_suffix: 'pirs / lîstik',
  learn_type_sentence: 'Peyvan Rêz Bike (Cümle Kurma)',
  learn_type_choice: 'Vebijêrka Rast Hilbijêre (Çoktan Seçmeli)',
  learn_sentence_placeholder: 'Ji bo avakirina hevokê li peyvên jêrîn bitikîne...',
  learn_correct_msg: 'Aferîn! Bersiva te rast e (+10 XP)',
  learn_wrong_prefix: 'Bersiva rast:',
  learn_check_btn: 'Kontrol Bike',
  learn_next_btn: 'Berdewam Bike (Sonraki)',
  learn_win_title: 'Pîroz be! Ev beş qediya!',
  learn_lose_title: 'Dilên te qediyan! Dîsa biceribîne',
  learn_total_xp_prefix: 'Pûanê te yê giştî:',
  learn_replay_btn: 'Dîsa Bilîze',
  learn_back_units_btn: 'Vegere Beşan'
};

const UI_FIELD_LABELS = [
  { key: 'brand_first', label: 'Logo İlk Kelime (Kurdi)' },
  { key: 'brand_second', label: 'Logo İkinci Kelime (Klass)' },
  { key: 'nav_site', label: 'Üst Menü: Site Butonu' },
  { key: 'nav_learn', label: 'Üst Menü: Hînbûn / Lîstik Butonu' },
  { key: 'nav_ferheng', label: 'Üst Menü: Ferheng (Sözlük) Butonu' },
  { key: 'nav_admin', label: 'Üst Menü: Admin Butonu' },
  { key: 'all_categories_label', label: 'Kategori Şeridi: Tümü Butonu' },
  { key: 'hero_badge', label: 'Ana Sayfa Üst Rozet Yazısı' },
  { key: 'hero_title', label: 'Ana Sayfa Büyük Başlık' },
  { key: 'hero_subtitle', label: 'Ana Sayfa Alt Açıklama' },
  { key: 'search_placeholder', label: 'Arama Kutusu İpucu Yazısı' },
  { key: 'ferheng_title', label: 'Ferheng: Büyük Başlık' },
  { key: 'ferheng_subtitle', label: 'Ferheng: Alt Açıklama' },
  { key: 'ferheng_search_placeholder', label: 'Ferheng: Arama Kutusu İpucu' },
  { key: 'ferheng_wiki_btn', label: 'Ferheng: Wîkîferheng Yenile Butonu' },
  { key: 'ferheng_empty_text', label: 'Ferheng: Uyarı Yazısı' },
  { key: 'learn_title', label: 'Hînbûn / Lîstik: Büyük Başlık' },
  { key: 'learn_subtitle', label: 'Hînbûn / Lîstik: Alt Açıklama' },
  { key: 'learn_xp_label', label: 'Hînbûn / Lîstik: Puan (XP) Etiketi' },
  { key: 'learn_units_heading', label: 'Hînbûn / Lîstik: Ünite Seçim Başlığı' },
  { key: 'learn_empty_units', label: 'Hînbûn / Lîstik: Soru Yokken Çıkan Uyarı' },
  { key: 'learn_stage_prefix', label: 'Hînbûn / Lîstik: Aşama Ön Eki (Qonax)' },
  { key: 'learn_question_count_suffix', label: 'Hînbûn / Lîstik: Soru Sayısı Son Eki' },
  { key: 'learn_type_sentence', label: 'Hînbûn / Lîstik: Cümle Kurma Etiketi' },
  { key: 'learn_type_choice', label: 'Hînbûn / Lîstik: Çoktan Seçmeli Etiketi' },
  { key: 'learn_sentence_placeholder', label: 'Hînbûn / Lîstik: Kelime Seçme İpucu' },
  { key: 'learn_correct_msg', label: 'Hînbûn / Lîstik: Doğru Cevap Tebrik Yazısı' },
  { key: 'learn_wrong_prefix', label: 'Hînbûn / Lîstik: Yanlış Cevap Ön Eki' },
  { key: 'learn_check_btn', label: 'Hînbûn / Lîstik: Kontrol Et Butonu' },
  { key: 'learn_next_btn', label: 'Hînbûn / Lîstik: Sonraki Soru Butonu' },
  { key: 'learn_win_title', label: 'Hînbûn / Lîstik: Bölüm Tamamlandı Başlığı' },
  { key: 'learn_lose_title', label: 'Hînbûn / Lîstik: Canlar Bitti Başlığı' },
  { key: 'learn_total_xp_prefix', label: 'Hînbûn / Lîstik: Toplam Puan Yazısı' },
  { key: 'learn_replay_btn', label: 'Hînbûn / Lîstik: Tekrar Oyna Butonu' },
  { key: 'learn_back_units_btn', label: 'Hînbûn / Lîstik: Ünitelere Dön Butonu' },
  { key: 'filter_title', label: 'Sol Panel: Filtre Başlığı' },
  { key: 'filter_level_label', label: 'Filtre: Seviye Başlığı' },
  { key: 'filter_level_all', label: 'Filtre: Tüm Seviyeler Seçeneği' },
  { key: 'level_1', label: 'Seviye 1 (Başlangıç)' },
  { key: 'level_2', label: 'Seviye 2 (Orta)' },
  { key: 'level_3', label: 'Seviye 3 (İleri)' },
  { key: 'grade_1', label: 'Sınıf Düzeyi 1 (Okul Öncesi)' },
  { key: 'grade_2', label: 'Sınıf Düzeyi 2 (İlkokul)' },
  { key: 'grade_3', label: 'Sınıf Düzeyi 3 (Ortaokul)' },
  { key: 'grade_4', label: 'Sınıf Düzeyi 4 (Lise)' },
  { key: 'filter_media_label', label: 'Filtre: Materyal Türü Başlığı' },
  { key: 'filter_media_all', label: 'Filtre: Tüm Türler Seçeneği' },
  { key: 'media_video', label: 'Materyal Türü: Video' },
  { key: 'media_pdf', label: 'Materyal Türü: Belge / PDF' },
  { key: 'media_audio', label: 'Materyal Türü: Ses / Podcast' },
  { key: 'media_interactive', label: 'Materyal Türü: İnteraktif Etkinlik' },
  { key: 'list_all_title', label: 'Ders Listesi Ana Başlığı' },
  { key: 'list_count_suffix', label: 'Ders Sayısı Sonundaki Yazı' },
  { key: 'loading_text', label: 'Yükleniyor Yazısı' },
  { key: 'empty_title', label: 'Boş Liste Ana Başlığı' },
  { key: 'empty_subtitle', label: 'Boş Liste Alt Açıklaması' },
  { key: 'empty_button', label: 'Boş Liste Buton Yazısı' },
  { key: 'card_guide_badge', label: 'Ders Kartı: Öğretmen Rehberi Rozeti' },
  { key: 'tab_content', label: 'Ders Detay: İçerik Sekmesi' },
  { key: 'tab_guide', label: 'Ders Detay: Öğretmen Rehberi Sekmesi' },
  { key: 'btn_open_material', label: 'Ders Detay: Materyal Aç/İndir Butonu' },
  { key: 'guide_heading', label: 'Öğretmen Rehberi Kutusu Başlığı' },
  { key: 'guide_download_btn', label: 'Öğretmen Rehberi PDF İndir Butonu' },
  { key: 'guide_empty_text', label: 'Öğretmen Rehberi Sadece PDF Varsa Çıkan Yazı' },
  { key: 'meta_level_prefix', label: 'Ders Detay: Seviye Etiketi' },
  { key: 'meta_grade_prefix', label: 'Ders Detay: Sınıf Etiketi' },
  { key: 'footer_text', label: 'En Alt Kısım (Footer) Yazısı' }
];

const ADMIN_PASS = 'kurdiklass2026';

export default function App() {
  const [lessons, setLessons] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [ui, setUi] = useState(DEFAULT_UI_TEXTS);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('student');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('kk_admin') === 'true');
  const [settingsMsg, setSettingsMsg] = useState('');

  // Ferheng (Sözlük + Canlı Wîkîferheng) State'leri
  const [ferhengWords, setFerhengWords] = useState([]);
  const [ferhengQuery, setFerhengQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('all');
  const [wikiEntries, setWikiEntries] = useState([]);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [importNotice, setImportNotice] = useState('');

  // Admin Ferheng Formu State'leri
  const [editingWordId, setEditingWordId] = useState(null);
  const [wordForm, setWordForm] = useState({
    word: '',
    part_of_speech: 'navdêr (mê)',
    meaning_tr: '',
    meaning_ku: '',
    example_sentence: ''
  });
  const [wordMsg, setWordMsg] = useState('');

  // Kurmancî Öğrenme / Lîstik State'leri
  const [exercises, setExercises] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [builtWords, setBuiltWords] = useState([]);
  const [answerState, setAnswerState] = useState(null);
  const [xpPoints, setXpPoints] = useState(() => Number(localStorage.getItem('kk_xp') || 0));
  const [hearts, setHearts] = useState(5);
  const [unitCompleted, setUnitCompleted] = useState(false);

  // Admin Alıştırma Ekleme & Düzenleme State'i
  const [editingExId, setEditingExId] = useState(null);
  const [uploadingExImg, setUploadingExImg] = useState(false);
  const [exForm, setExForm] = useState({
    unit_title: 'Asta 1 - Beşa 1: Alfabeya Kurmancî',
    exercise_type: 'choice',
    question_text: '',
    options_raw: '',
    correct_answer: '',
    explanation: '',
    image_url: ''
  });
  const [exMsg, setExMsg] = useState('');

  // Kategori Ekleme / Düzenleme
  const [newCatName, setNewCatName] = useState('');
  const [catMsg, setCatMsg] = useState('');

  // Şifre Giriş Formu
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Filtreler ve Aktif Ders
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonTab, setLessonTab] = useState('content');

  // Admin Ders Formu
  const [editingId, setEditingId] = useState(null);
  const [uploadingField, setUploadingField] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_slug: 'zanist',
    media_type: 'video',
    media_url: '',
    thumbnail_url: '',
    level: 'Destpêk',
    grade_level: 'Dibistana Seretayî',
    teacher_guide: '',
    guide_pdf_url: ''
  });
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const dynamicLevels = [ui.level_1, ui.level_2, ui.level_3];
  const dynamicGrades = [ui.grade_1, ui.grade_2, ui.grade_3, ui.grade_4];
  const dynamicMediaTypes = [
    { id: 'video', label: ui.media_video, icon: Video },
    { id: 'pdf', label: ui.media_pdf, icon: FileText },
    { id: 'audio', label: ui.media_audio, icon: Headphones },
    { id: 'interactive', label: ui.media_interactive, icon: MonitorPlay }
  ];

  const kurdishAlphabet = [
    'A', 'B', 'C', 'Ç', 'D', 'E', 'Ê', 'F', 'G', 'H', 'I', 'Î',
    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'Ş', 'T',
    'U', 'Û', 'V', 'W', 'X', 'Y', 'Z'
  ];

  useEffect(() => {
    fetchLessons();
    fetchSiteSettings();
    fetchCategories();
    fetchExercises();
    fetchFerheng();
  }, []);

  // Wîkîferheng canlı arama/listeleme tetikleyicisi
  useEffect(() => {
    if (viewMode !== 'ferheng') return;

    const timer = setTimeout(() => {
      const searchPrefix =
        ferhengQuery.trim() ||
        (selectedLetter !== 'all' ? selectedLetter.toLocaleLowerCase('ku') : 'a');
      fetchWikiferhengLive(searchPrefix);
    }, 350);

    return () => clearTimeout(timer);
  }, [viewMode, ferhengQuery, selectedLetter]);

  const fetchFerheng = async () => {
    const { data, error } = await supabase
      .from('ferheng')
      .select('*')
      .order('word', { ascending: true });

    if (!error && data) {
      setFerhengWords(data);
    }
  };

  const fetchWikiferhengLive = async (prefixOrTerm) => {
    const query = prefixOrTerm.trim();
    if (!query) return;
    setWikiLoading(true);

    try {
      const url = `https://ku.wiktionary.org/w/api.php?action=query&generator=prefixsearch&gpssearch=${encodeURIComponent(
        query
      )}&gpsnamespace=0&gpslimit=24&prop=extracts&exintro=true&explaintext=true&exsentences=3&format=json&origin=*`;

      const response = await fetch(url);
      const data = await response.json();
      const pagesObj = data?.query?.pages || {};

      const list = Object.values(pagesObj)
        .filter((p) => p && p.title)
        .sort((a, b) => (a.index || 0) - (b.index || 0))
        .map((p) => ({
          pageid: p.pageid,
          title: p.title,
          extract: p.extract || '',
          url: `https://ku.wiktionary.org/wiki/${encodeURIComponent(p.title)}`
        }));

      setWikiEntries(list);
    } catch {
      setWikiEntries([]);
    }
    setWikiLoading(false);
  };

  const handleImportWikiEntry = async (entry) => {
    const payload = {
      word: entry.title,
      part_of_speech: 'Wîkîferheng',
      meaning_tr: entry.extract ? entry.extract.slice(0, 180) : entry.title,
      meaning_ku: entry.extract || '',
      example_sentence: ''
    };

    const { error } = await supabase.from('ferheng').insert([payload]);
    if (!error) {
      setImportNotice(`"${entry.title}" li ferhenga KurdiKlass hat tomarkirin!`);
      fetchFerheng();
      setTimeout(() => setImportNotice(''), 3500);
    }
  };

  const handleSaveWord = async (e) => {
    e.preventDefault();
    if (!wordForm.word.trim() || !wordForm.meaning_tr.trim()) return;

    const payload = {
      word: wordForm.word.trim(),
      part_of_speech: wordForm.part_of_speech.trim(),
      meaning_tr: wordForm.meaning_tr.trim(),
      meaning_ku: wordForm.meaning_ku.trim(),
      example_sentence: wordForm.example_sentence.trim()
    };

    if (editingWordId) {
      const { error } = await supabase
        .from('ferheng')
        .update(payload)
        .eq('id', editingWordId);

      if (error) {
        setWordMsg('Çewtî: ' + error.message);
      } else {
        setWordMsg('Peyv bi serkeftî hat nûkirin!');
        resetWordForm();
        fetchFerheng();
      }
    } else {
      const { error } = await supabase.from('ferheng').insert([payload]);
      if (error) {
        setWordMsg('Çewtî: ' + error.message);
      } else {
        setWordMsg('Peyva nû li Ferhengê hat zêdekirin!');
        resetWordForm();
        fetchFerheng();
      }
    }
    setTimeout(() => setWordMsg(''), 4000);
  };

  const startEditingWord = (item) => {
    setEditingWordId(item.id);
    setWordForm({
      word: item.word || '',
      part_of_speech: item.part_of_speech || 'navdêr (mê)',
      meaning_tr: item.meaning_tr || '',
      meaning_ku: item.meaning_ku || '',
      example_sentence: item.example_sentence || ''
    });
  };

  const resetWordForm = () => {
    setEditingWordId(null);
    setWordForm({
      word: '',
      part_of_speech: 'navdêr (mê)',
      meaning_tr: '',
      meaning_ku: '',
      example_sentence: ''
    });
  };

  const handleDeleteWord = async (id) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vê peyvê jê bibî?')) return;
    const { error } = await supabase.from('ferheng').delete().eq('id', id);
    if (!error) fetchFerheng();
  };

  const filteredFerheng = ferhengWords.filter((item) => {
    const q = ferhengQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.word?.toLowerCase().includes(q) ||
      item.meaning_tr?.toLowerCase().includes(q) ||
      item.meaning_ku?.toLowerCase().includes(q);
    const matchesLetter =
      selectedLetter === 'all' ||
      item.word?.toLocaleUpperCase('ku').startsWith(selectedLetter);
    return matchesSearch && matchesLetter;
  });

  const fetchExercises = async () => {
    const { data, error } = await supabase
      .from('kurmanci_exercises')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setExercises(data);
    }
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

    if (!exForm.question_text.trim() || parsedOptions.length < 2 || !exForm.correct_answer.trim()) {
      setExMsg('Ji kerema xwe pirs, herî kêm 2 vebijêrk (bi bêhnokê veqetandî) û bersiva rast binivîse.');
      return;
    }

    const payload = {
      unit_title: exForm.unit_title.trim(),
      exercise_type: exForm.exercise_type,
      question_text: exForm.question_text.trim(),
      options: parsedOptions,
      correct_answer: exForm.correct_answer.trim(),
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
        setExMsg('Pirs bi serkeftî hat nûkirin!');
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
        setExMsg('Pirsa nû li beşa Hînbûn / Lîstik hat zêdekirin!');
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
      unit_title: 'Asta 1 - Beşa 1: Alfabeya Kurmancî',
      exercise_type: 'choice',
      question_text: '',
      options_raw: '',
      correct_answer: '',
      explanation: '',
      image_url: ''
    });
  };

  const handleDeleteExercise = async (id) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vê pirsê jê bibî?')) return;
    const { error } = await supabase.from('kurmanci_exercises').delete().eq('id', id);
    if (!error) fetchExercises();
  };

  const unitList = [...new Set(exercises.map((ex) => ex.unit_title))];
  const unitExercises = selectedUnit
    ? exercises.filter((ex) => ex.unit_title === selectedUnit)
    : [];
  const currentEx = unitExercises[currentExIndex];

  const startUnit = (unitName) => {
    setSelectedUnit(unitName);
    setCurrentExIndex(0);
    setSelectedOption('');
    setBuiltWords([]);
    setAnswerState(null);
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
    if (!currentEx) return;
    const userAnswer =
      currentEx.exercise_type === 'sentence'
        ? builtWords.map((w) => w.word).join(' ').trim()
        : selectedOption.trim();

    if (!userAnswer) return;

    if (userAnswer.toLowerCase() === currentEx.correct_answer.trim().toLowerCase()) {
      setAnswerState('correct');
      const nextXp = xpPoints + 10;
      setXpPoints(nextXp);
      localStorage.setItem('kk_xp', String(nextXp));
    } else {
      setAnswerState('wrong');
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
    }
  };

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

    const generatedSlug = newCatName
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
      setUi((prev) => ({
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
        all_categories_label: ui.all_categories_label,
        hero_badge: ui.hero_badge,
        hero_title: ui.hero_title,
        hero_subtitle: ui.hero_subtitle,
        footer_text: ui.footer_text,
        ui_texts: ui
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
      level: lesson.level || ui.level_1,
      grade_level: lesson.grade_level || ui.grade_2,
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
      level: ui.level_1,
      grade_level: ui.grade_2,
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
      {/* ÜST BAR (HEADER) */}
      <header className="bg-red-700 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <div
            onClick={() => {
              setViewMode('student');
              setSelectedCategory('all');
              setActiveLesson(null);
            }}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="bg-white text-red-700 font-black px-2.5 py-1 rounded text-xl tracking-tight">
              KK
            </div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {ui.brand_first}<span className="text-red-200 font-light">{ui.brand_second}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto">
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
              onClick={() => setViewMode('ferheng')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                viewMode === 'ferheng'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-amber-500/90 text-slate-950 hover:bg-amber-400'
              }`}
            >
              <BookA className="w-4 h-4" />
              <span>{ui.nav_ferheng}</span>
            </button>

            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
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

        {/* DİNAMİK KATEGORİ ŞERİDİ */}
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

      {/* ANA İÇERİK ALANI */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'ferheng' ? (
          /* ================= FERHENG (KÜRTÇE SÖZLÜK + WÎKÎFERHENG CANLI) ================= */
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 sm:p-8 text-slate-950 shadow-md">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider bg-white/40 w-fit px-3 py-1 rounded-full mb-2">
                <Globe className="w-4 h-4" />
                <span>Wîkîferheng + Ferhenga KurdiKlass</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">{ui.ferheng_title}</h1>
              <p className="text-slate-900/90 text-sm mt-1 mb-5">{ui.ferheng_subtitle}</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={ferhengQuery}
                    onChange={(e) => setFerhengQuery(e.target.value)}
                    placeholder={ui.ferheng_search_placeholder}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-300 shadow-inner"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    fetchWikiferhengLive(
                      ferhengQuery.trim() ||
                        (selectedLetter !== 'all' ? selectedLetter.toLocaleLowerCase('ku') : 'a')
                    )
                  }
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap transition"
                >
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>{wikiLoading ? 'Tê barkirin...' : ui.ferheng_wiki_btn}</span>
                </button>
              </div>
            </div>

            {importNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{importNotice}</span>
              </div>
            )}

            {/* ALFABE FİLTRESİ */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap gap-1.5 justify-center">
              <button
                onClick={() => setSelectedLetter('all')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                  selectedLetter === 'all'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Hemû
              </button>
              {kurdishAlphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-7 h-7 rounded text-xs font-bold transition ${
                    selectedLetter === letter
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>

            {/* 1. BÖLÜM: KURDİKLASS ÖZEL SÖZLÜK KAYITLARI */}
            {filteredFerheng.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <BookA className="w-5 h-5 text-red-600" />
                  <span>Ferhenga KurdiKlass ({filteredFerheng.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFerheng.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-amber-400 transition space-y-2"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-xl font-extrabold text-red-700">{item.word}</h3>
                        {item.part_of_speech && (
                          <span className="text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            {item.part_of_speech}
                          </span>
                        )}
                      </div>
                      <p className="text-base font-bold text-slate-900">
                        🇹🇷 {item.meaning_tr}
                      </p>
                      {item.meaning_ku && (
                        <p className="text-xs text-slate-600">
                          <strong>Wate (Kurdî):</strong> {item.meaning_ku}
                        </p>
                      )}
                      {item.example_sentence && (
                        <div className="bg-slate-50 border-l-4 border-amber-400 px-3 py-2 rounded text-xs text-slate-700 italic mt-2">
                          “{item.example_sentence}”
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. BÖLÜM: WÎKÎFERHENG CANLI SONUÇLARI */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span>Peyvên Wîkîferhengê ({wikiEntries.length})</span>
                </h2>
                {wikiLoading && (
                  <span className="text-xs font-semibold text-blue-600">Ji Wîkîferhengê tê barkirin...</span>
                )}
              </div>

              {wikiEntries.length === 0 && !wikiLoading ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-sm">
                  {ui.ferheng_empty_text}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wikiEntries.map((entry) => {
                    const alreadySaved = ferhengWords.some(
                      (w) => w.word?.toLowerCase() === entry.title.toLowerCase()
                    );
                    return (
                      <div
                        key={entry.pageid}
                        className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm hover:border-blue-300 transition flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-lg font-extrabold text-slate-900">{entry.title}</h3>
                            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                              Wîkîferheng
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-4 whitespace-pre-line">
                            {entry.extract || 'Ji bo hûrgiliyên vê peyvê rûpela Wîkîferhengê veke.'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
                          >
                            <span>Li Wîkîferhengê Veke</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {isAdmin && !alreadySaved && (
                            <button
                              type="button"
                              onClick={() => handleImportWikiEntry(entry)}
                              className="inline-flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold px-2.5 py-1 rounded-lg transition"
                            >
                              <BookmarkPlus className="w-3.5 h-3.5" />
                              <span>Li Ferhenga Min Zêde Bike</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : viewMode === 'learn' ? (
          /* ================= KURMANCÎ ÖĞRENME / LÎSTİK MODÜLÜ ================= */
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white mb-6 shadow-md flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold">{ui.learn_title}</h1>
                <p className="text-emerald-100 text-sm mt-1">
                  {ui.learn_subtitle}
                </p>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-xl text-center">
                <div className="text-xs uppercase font-bold text-emerald-100">{ui.learn_xp_label}</div>
                <div className="text-2xl font-black flex items-center gap-1">
                  <Award className="w-5 h-5 text-amber-300" />
                  <span>{xpPoints}</span>
                </div>
              </div>
            </div>

            {!selectedUnit ? (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800">{ui.learn_units_heading}</h2>
                {unitList.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
                    {ui.learn_empty_units}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {unitList.map((unitName, idx) => {
                      const unitItems = exercises.filter((e) => e.unit_title === unitName);
                      const previewImg = unitItems.find((e) => e.image_url)?.image_url;
                      return (
                        <div
                          key={unitName}
                          onClick={() => startUnit(unitName)}
                          className="bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-2xl overflow-hidden cursor-pointer transition shadow-sm hover:shadow-md flex flex-col"
                        >
                          {previewImg && (
                            <div className="h-32 w-full bg-slate-100 overflow-hidden">
                              <img
                                src={previewImg}
                                alt={unitName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-5 flex items-center justify-between gap-3">
                            <div>
                              <span className="text-xs font-extrabold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                {ui.learn_stage_prefix} {idx + 1}
                              </span>
                              <h3 className="text-base font-bold text-slate-900 mt-2">{unitName}</h3>
                              <p className="text-xs text-slate-500 mt-1">
                                {unitItems.length} {ui.learn_question_count_suffix}
                              </p>
                            </div>
                            <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                              <ArrowRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : unitCompleted || hearts === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-md space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Award className="w-9 h-9" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {hearts === 0 ? ui.learn_lose_title : ui.learn_win_title}
                </h2>
                <p className="text-slate-600 text-sm">
                  {ui.learn_total_xp_prefix} <strong>{xpPoints} XP</strong>
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => startUnit(selectedUnit)}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{ui.learn_replay_btn}</span>
                  </button>
                  <button
                    onClick={() => setSelectedUnit(null)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-5 py-2.5 rounded-xl"
                  >
                    {ui.learn_back_units_btn}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setSelectedUnit(null)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{
                        width: `${((currentExIndex + 1) / unitExercises.length) * 100}%`
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1 text-red-600 font-extrabold text-sm">
                    <Heart className="w-5 h-5 fill-red-600" />
                    <span>{hearts}</span>
                  </div>
                </div>

                <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  {currentEx?.exercise_type === 'sentence'
                    ? ui.learn_type_sentence
                    : ui.learn_type_choice}
                </span>

                {currentEx?.image_url && (
                  <div className="mt-4 mb-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-48 sm:h-56">
                    <img
                      src={currentEx.image_url}
                      alt={currentEx.question_text}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h2 className="text-xl font-bold text-slate-900 mt-3 mb-6">
                  {currentEx?.question_text}
                </h2>

                {currentEx?.exercise_type === 'sentence' ? (
                  <div className="space-y-6">
                    <div className="min-h-[64px] p-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-wrap gap-2 items-center">
                      {builtWords.length === 0 ? (
                        <span className="text-xs text-slate-400">
                          {ui.learn_sentence_placeholder}
                        </span>
                      ) : (
                        builtWords.map((item) => (
                          <button
                            key={item.idx}
                            type="button"
                            onClick={() => toggleSentenceWord(item.word, item.idx)}
                            className="bg-emerald-600 text-white font-bold px-3.5 py-2 rounded-xl text-sm shadow-sm"
                          >
                            {item.word}
                          </button>
                        ))
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {(currentEx.options || []).map((word, idx) => {
                        const isUsed = builtWords.some((item) => item.idx === idx);
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={isUsed || Boolean(answerState)}
                            onClick={() => toggleSentenceWord(word, idx)}
                            className={`px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition ${
                              isUsed
                                ? 'bg-slate-100 text-slate-300 border-slate-200'
                                : 'bg-white text-slate-800 border-slate-300 hover:border-emerald-500 shadow-sm'
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
                        className={`w-full text-left px-4 py-3.5 rounded-xl border-2 font-semibold text-sm transition ${
                          selectedOption === opt
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-8 pt-5 border-t border-slate-100">
                  {answerState === 'correct' && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 mb-4">
                      <div className="font-extrabold flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>{ui.learn_correct_msg}</span>
                      </div>
                      {currentEx?.explanation && (
                        <p className="text-xs mt-1 text-emerald-800">{currentEx.explanation}</p>
                      )}
                    </div>
                  )}

                  {answerState === 'wrong' && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 mb-4">
                      <div className="font-extrabold flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span>{ui.learn_wrong_prefix} {currentEx?.correct_answer}</span>
                      </div>
                      {currentEx?.explanation && (
                        <p className="text-xs mt-1 text-red-800">{currentEx.explanation}</p>
                      )}
                    </div>
                  )}

                  {!answerState ? (
                    <button
                      type="button"
                      onClick={checkExerciseAnswer}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl transition"
                    >
                      {ui.learn_check_btn}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={goToNextExercise}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl transition"
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
            {/* HERO VE ARAMA */}
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

            {/* AKTİF DERS DETAY PANELİ */}
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

            {/* SOL FİLTRE VE SAĞ DERS LİSTESİ */}
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
          /* ================= ADMIN PANELİ ================= */
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
                {/* Admin Üst Bilgi */}
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

                {/* DERS EKLEME / DÜZENLEME FORMU */}
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

                {/* FERHENG (SÖZLÜK) KELİME EKLEME & DÜZENLEME */}
                <div className="bg-white rounded-2xl border border-amber-300 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <BookA className="w-5 h-5 text-amber-600" />
                    <span>
                      {editingWordId
                        ? 'Peyva Ferhengê Sererast Bike'
                        : 'Ferheng — Peyvên Nû Zêde Bike û Biguherîne'}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mb-4">
                    Peyvên Kurmancî, wateyên wan ên bi Tirkî/Kurdî û hevokên mînak li ferhenga malperê zêde bike.
                  </p>

                  {wordMsg && (
                    <div className="p-3 rounded-xl mb-4 bg-amber-50 text-amber-900 border border-amber-200 text-sm font-medium">
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
                        placeholder="Mînak: pênûs"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Cureyê Peyvê (Kelime Türü / Cinsiyet)
                      </label>
                      <input
                        type="text"
                        value={wordForm.part_of_speech}
                        onChange={(e) => setWordForm({ ...wordForm, part_of_speech: e.target.value })}
                        placeholder="navdêr (mê), lêker, rengdêr..."
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
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
                        placeholder="Mînak: kalem"
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
                        placeholder="Amûra nivîsandinê..."
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
                        placeholder="Ez bi pênûsê dinivîsim."
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded-lg text-sm transition"
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
                    {ferhengWords.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-2 bg-slate-50 px-3.5 py-2 rounded-lg text-sm">
                        <div className="truncate">
                          <span className="font-bold text-red-700 mr-2">{item.word}</span>
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

                {/* KURMANCÎ ÖĞRENME / LÎSTİK SORU EKLEME & DÜZENLEME */}
                <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <span>
                      {editingExId
                        ? 'Pirsa Hînbûn / Lîstik Sererast Bike'
                        : 'Pirsên Fêrbûna Kurmancî / Lîstik (Ekle ve Düzenle)'}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mb-4">
                    Ji bo beşa Hînbûn / Lîstik pirsên nû bi wêne zêde bike an pirsên heyî sererast bike.
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
                        placeholder="Mînak: Asta 1 - Beşa 1: Alfabeya Kurmancî"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Cureyê Lîstikê (Soru Türü)
                      </label>
                      <select
                        value={exForm.exercise_type}
                        onChange={(e) => setExForm({ ...exForm, exercise_type: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      >
                        <option value="choice">Çoktan Seçmeli (Vebijêrka Rast)</option>
                        <option value="sentence">Kelime Sıralama / Cümle Kurma (Peyvan Rêz Bike)</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Pirs (Soru Metni)
                      </label>
                      <input
                        type="text"
                        required
                        value={exForm.question_text}
                        onChange={(e) => setExForm({ ...exForm, question_text: e.target.value })}
                        placeholder="Mînak: Hevokê rast rêz bike: 'Ben okula gidiyorum.'"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Wêneyê Pirsê (Konu Görseli Yükle / URL - Opsiyonel)
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

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Vebijêrk an Peyv (Virgülle ayırın)
                      </label>
                      <input
                        type="text"
                        required
                        value={exForm.options_raw}
                        onChange={(e) => setExForm({ ...exForm, options_raw: e.target.value })}
                        placeholder="Ez, diçim, dibistanê., tu, malê"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>

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
                        {editingExId ? 'Guhertina Pirsê Tomar Bike' : '+ Pirsa Nû Zêde Bike'}
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

                {/* MEVCUT DERSLER LİSTESİ */}
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

                {/* KATEGORİ BAŞLIKLARINI DÜZENLEME */}
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

                {/* SİTEDEKİ TÜM YAZILARI DÜZENLEME */}
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
                          value={ui[field.key] || ''}
                          onChange={(e) => setUi({ ...ui, [field.key]: e.target.value })}
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

      {/* ALT BİLGİ (FOOTER) */}
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
