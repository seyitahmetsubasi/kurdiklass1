import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import {
  Search, BookOpen, Video, FileText, Headphones, MonitorPlay,
  Plus, Trash2, Edit3, LayoutDashboard, Eye, Filter, X,
  GraduationCap, CheckCircle2, AlertCircle, ExternalLink, Lock,
  Upload, LogOut, ClipboardList, Download
} from 'lucide-react';

const CATEGORIES = [
  { slug: 'zanist', name: 'ZANIST', desc: 'Fîzîk, kîmya, biyolojî û xweza' },
  { slug: 'birkari', name: 'BÎRKARÎ', desc: 'Hejmêr, geometrî û mantiq' },
  { slug: 'ziman-weje', name: 'ZIMAN û WÊJEYA KURDÎ', desc: 'Rêziman, çîrok, helbest û xwendin' },
  { slug: 'zarok', name: 'ZAROK', desc: 'Pêşdibistan, lîstik û fêrbûna bingehîn' },
  { slug: 'huner', name: 'HUNER', desc: 'Muzîk, wêne, şano û çand' },
  { slug: 'teknoloji', name: 'TEKNOLOJÎ', desc: 'Bîrkarî, bernameçêkirin û zanista dîjîtal' }
];

const LEVELS = ['Destpêk', 'Navîn', 'Pêşketî'];
const GRADES = ['Pêşdibistan', 'Dibistana Seretayî', 'Dibistana Navîn', 'Lîse'];
const MEDIA_TYPES = [
  { id: 'video', label: 'Vîdyo', icon: Video },
  { id: 'pdf', label: 'Belge / PDF', icon: FileText },
  { id: 'audio', label: 'Deng / Podcast', icon: Headphones },
  { id: 'interactive', label: 'Çalakiya Interaktîf', icon: MonitorPlay }
];

export default function App() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('student'); // 'student' | 'admin'
  const [session, setSession] = useState(null);

  // Admin Giriş Formu
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Filtreler ve Aktif Ders
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonTab, setLessonTab] = useState('content'); // 'content' | 'guide'

  // Admin Ders Formu
  const [editingId, setEditingId] = useState(null);
  const [uploadingField, setUploadingField] = useState(''); // 'media' | 'thumb' | 'guide' | ''
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

  // Oturum kontrolü ve dersleri çekme
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchLessons();
    return () => subscription.unsubscribe();
  }, []);

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

  // Supabase Auth ile Admin Girişi
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });

    if (error) {
      setAuthError('E-posta an şîfre xelet e! Ji kerema xwe kontrol bike.');
    }
    setAuthLoading(false);
  };

  // Çıkış Yap
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setViewMode('student');
  };

  // Supabase Storage'a Doğrudan Dosya Yükleme (Sadece Admin)
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

  // Ders Ekleme veya Güncelleme
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

  // Ders Silme
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
      category_slug: lesson.category_slug || 'zanist',
      media_type: lesson.media_type || 'video',
      media_url: lesson.media_url || '',
      thumbnail_url: lesson.thumbnail_url || '',
      level: lesson.level || 'Destpêk',
      grade_level: lesson.grade_level || 'Dibistana Seretayî',
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
      category_slug: 'zanist',
      media_type: 'video',
      media_url: '',
      thumbnail_url: '',
      level: 'Destpêk',
      grade_level: 'Dibistana Seretayî',
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
            <span className="text-2xl font-extrabold tracking-tight">
              Kurdi<span className="text-red-200 font-light">Klass</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('student')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition ${
                viewMode === 'student'
                  ? 'bg-white text-red-700 shadow-sm'
                  : 'text-red-100 hover:bg-red-600'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Malper (Sîte)</span>
            </button>

            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition ${
                viewMode === 'admin'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-red-800 text-white hover:bg-red-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Panela Rêveber (Admin)</span>
            </button>
          </div>
        </div>

        {/* KATEGORİ ŞERİDİ */}
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
                HEMÛ BEŞ (TÜMÜ)
              </button>
              {CATEGORIES.map((cat) => (
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
        {viewMode === 'student' ? (
          <>
            {/* HERO VE ARAMA */}
            <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-lg">
              <div className="max-w-2xl">
                <span className="inline-block bg-red-600/80 text-red-100 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                  Çavkaniyên Perwerdehiyê yên Kurdî
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 leading-tight">
                  Fêrbûn, Lêkolîn û Pêşketin bi Zimanê Kurdî
                </h1>
                <p className="text-red-100 text-sm sm:text-base mb-6">
                  Vîdyo, belge, rêbera mamosteyan û materyalên perwerdehiyê ji bo mamoste û xwendekaran.
                </p>

                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Li ders, mijar an materyalan bigere..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-red-400/50 shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* AKTİF DERS DETAY PANELİ (ÖĞRETMEN REHBERİ SEKMELİ) */}
            {activeLesson && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded">
                      {CATEGORIES.find((c) => c.slug === activeLesson.category_slug)?.name || 'DERS'}
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

                {/* DERS İÇERİĞİ / ÖĞRETMEN REHBERİ SEKMELERİ */}
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
                    <span>Naveroka Dersê (Ders İçeriği)</span>
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
                      <span>Rêbera Mamosteyan (Öğretmen Rehberi)</span>
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
                            <span>Materyalê Veke / Daxe ({activeLesson.media_type.toUpperCase()})</span>
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
                        <span>Plana Dersê û Pêşniyarên ji bo Mamosteyan</span>
                      </h3>
                      {activeLesson.guide_pdf_url && (
                        <a
                          href={activeLesson.guide_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                        >
                          <Download className="w-4 h-4" />
                          <span>Pela Rêberê Daxe (PDF)</span>
                        </a>
                      )}
                    </div>
                    <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                      {activeLesson.teacher_guide || 'Ji bo vê dersê pela rêberê li jor hatiye barkirin.'}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600 pt-4 mt-4 border-t border-slate-100">
                  <span className="bg-slate-100 px-3 py-1 rounded-full">
                    Ast: <strong>{activeLesson.level}</strong>
                  </span>
                  <span className="bg-slate-100 px-3 py-1 rounded-full">
                    Pola Perwerdehiyê: <strong>{activeLesson.grade_level}</strong>
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
                    <span>Parzûn (Filtre)</span>
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      Ast (Seviye)
                    </label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600"
                    >
                      <option value="all">Hemû Ast</option>
                      {LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      Cureyê Materyalê
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
                        Hemû Cure
                      </button>
                      {MEDIA_TYPES.map((m) => {
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
                      ? 'Hemû Materyalên Perwerdehiyê'
                      : CATEGORIES.find((c) => c.slug === selectedCategory)?.name}
                  </h2>
                  <span className="text-sm text-slate-500 font-medium">
                    {filteredLessons.length} materyal hat dîtin
                  </span>
                </div>

                {loading ? (
                  <div className="bg-white rounded-xl p-12 text-center border border-slate-200 text-slate-500">
                    Materyal tên barkirin...
                  </div>
                ) : filteredLessons.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-700 mb-1">
                      Hêj di vê beşê de materyal tune ye
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Ji bo zêdekirina dersa yekem derbasî Panela Rêveber (Admin) bibin.
                    </p>
                    <button
                      onClick={() => setViewMode('admin')}
                      className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Materyala Yekem Zêde Bike</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredLessons.map((lesson) => {
                      const catObj = CATEGORIES.find((c) => c.slug === lesson.category_slug);
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
                                Rêbera Mamosteyan
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
          /* ================= ADMIN PANELİ (SUPABASE AUTH KORUMALI) ================= */
          <div>
            {!session ? (
              <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md border border-slate-200 p-8 mt-8">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-center text-slate-900 mb-1">
                  Têketina Rêveber (Admin)
                </h2>
                <p className="text-sm text-center text-slate-500 mb-6">
                  Bi hesabê xwe yê Supabase (E-posta û Şîfre) têkeve panelê.
                </p>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@kurdiklass.org"
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Şîfre
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  {authError && (
                    <p className="text-xs text-red-600 font-medium">{authError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 rounded-lg transition disabled:opacity-50"
                  >
                    {authLoading ? 'Têketin tê kontrolkirin...' : 'Têkeve Panelê'}
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
                      Têketî: <span className="text-white font-medium">{session.user.email}</span>
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

                {/* DERS EKLEME / DÜZENLEME FORMU (DOSYA YÜKLEMELİ) */}
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
                        {CATEGORIES.map((c) => (
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
                        {MEDIA_TYPES.map((m) => (
                          <option key={m.id} value={m.id}>{m.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* ANA MATERYAL LİNKİ VEYA DOĞRUDAN DOSYA YÜKLEME */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Lînka Materyalê an Pel Bar Bike (PDF / Deng / Vîdyo)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
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

                    {/* KAPAK GÖRSELİ LİNKİ VEYA DOĞRUDAN RESİM YÜKLEME */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Wêneyê Bergê (Kapak Görseli Yükle / URL)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
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
                        {LEVELS.map((l) => (
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
                        {GRADES.map((g) => (
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

                    {/* ÖĞRETMEN REHBERİ (RÊBERA MAMOSTEYAN) BÖLÜMÜ */}
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
                              {CATEGORIES.find((c) => c.slug === lesson.category_slug)?.name}
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
              </div>
            )}
          </div>
        )}
      </main>

      {/* ALT BİLGİ (FOOTER) */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="font-bold text-white text-base">
            Kurdi<span className="text-red-500">Klass</span>
          </div>
          <p>Platforma Perwerdehiyê ya Kurdî — Hemû maf parastî ne.</p>
        </div>
      </footer>
    </div>
  );
}
