import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageCircle, LogOut, Menu, Search, Grid, List, Wand2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import GenerateFeedbackCard from '../components/essay/GenerateFeedbackCard';
import Modal from '../components/ui/Modal';

const navItems = [
  { label: 'My Essays', icon: <FileText size={20} />, path: '/dashboard' },
  { label: 'Generate Feedback', icon: <Wand2 size={20} />, path: '/generate-feedback' },
  { label: 'All Feedback', icon: <MessageCircle size={20} />, path: '/feedbacks' },
];

const filterTabs = [
  'Needs Review',
];

const GenerateFeedback = () => {
  const [sidebarActive, setSidebarActive] = useState('Generate Feedback');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [essays, setEssays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewingEssay, setReviewingEssay] = useState(null);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const navigate = useNavigate();

  // Refs and state for animations
  const navItemRefs = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  const fetchEssaysWithoutFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const allEssays = await api.getUserEssays(token);
      // Filter on the client side using the `has_feedback` flag from the API
      const essaysWithoutFeedback = allEssays.filter(essay => !essay.has_feedback);
      setEssays(essaysWithoutFeedback);
    } catch (err) {
      setError(err.message || 'Failed to load essays.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEssaysWithoutFeedback();
  }, [fetchEssaysWithoutFeedback]);

  // Effect for sidebar indicator animation
  useEffect(() => {
    const activeNavIndex = navItems.findIndex(item => item.label === sidebarActive);
    const activeNavEl = navItemRefs.current[activeNavIndex];
    if (activeNavEl) {
      setIndicatorStyle({
        top: activeNavEl.offsetTop,
        height: activeNavEl.offsetHeight,
      });
    }
  }, [sidebarActive, sidebarOpen]);

  const handleReview = async (essay) => {
    setReviewingEssay(essay);
    setAiProcessing(true);
    setAiFeedback(null);
    try {
      const token = localStorage.getItem('token');
      const feedback = await api.generateFeedback(token, essay.essay_id);
      // After feedback is generated, refresh the list
      await fetchEssaysWithoutFeedback();
      setAiProcessing(false);
      setAiFeedback({
        message: feedback.feedback_text,
        scores: {
          originality: feedback.originality_score,
          grammar: feedback.typo_score,
        },
        analysis: feedback.analysis,
      });
    } catch (err) {
      console.error("Failed to generate feedback:", err);
      setAiProcessing(false);
      setAiFeedback(null); // Setting to null will show the error message in the card
    }
  };

  const handleCloseModal = () => {
    setReviewingEssay(null);
    setAiProcessing(false);
    setAiFeedback(null);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white/80 backdrop-blur-xl border-r border-white/20 flex flex-col transition-all duration-300 ease-in-out`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          <button
            className="p-2 rounded-lg hover:bg-black/5 transition-all duration-150 hover:scale-105 active:scale-95"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Menu size={20} className="text-gray-600" />
          </button>
        </div>
        {/* Navigation */}
        <nav className="flex-1 p-2 relative">
          <div
            className="absolute left-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full transition-all duration-300 ease-in-out"
            style={indicatorStyle}
          />
          <div className="space-y-1">
            {navItems.map((item, index) => (
              <button
                ref={el => (navItemRefs.current[index] = el)}
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ease-out group relative overflow-hidden ${
                  sidebarActive === item.label
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 shadow-sm border border-blue-200/50'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]'
                }`}
                onClick={() => {
                  setSidebarActive(item.label);
                  if (item.path) navigate(item.path);
                }}
                title={!sidebarOpen ? item.label : ''}
              >
                <span className={`transition-all duration-150 ${sidebarActive === item.label ? 'text-blue-600 scale-110' : 'text-gray-500 group-hover:text-gray-700'}`}>{item.icon}</span>
                {sidebarOpen && <span className="transition-all duration-150">{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>
        {/* Logout */}
        <div className="p-2 border-t border-white/20">
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 rounded-lg transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] group"
            onClick={logout}
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <LogOut size={20} className="text-gray-500 group-hover:text-red-500 transition-colors duration-150" />
            {sidebarOpen && <span className="transition-all duration-150">Logout</span>}
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search essays..."
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-6">
          {/* Filter Tabs and View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex border-b border-gray-200">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    tab === 'Needs Review' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                  disabled
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} className="text-gray-600" />
              </button>
              <button
                className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
          {/* Essay List */}
          {loading ? (
            <div className="flex items-center justify-center text-gray-500 py-16">
              <svg className="animate-spin mr-2" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Loading essays...
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-red-50/80 rounded-xl border-2 border-dashed border-red-200/50 p-8 text-center">
              <h3 className="text-lg font-medium text-red-800 mb-3">Something went wrong</h3>
              <p className="text-red-600">{error}</p>
            </div>
          ) : essays.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-white/50 rounded-xl border border-white/20 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent mb-2">All Caught Up!</h1>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                You have reviewed all available essays. Great job!
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {essays.map(essay => (
                <div key={essay.essay_id} className="bg-white rounded-xl shadow p-4 flex flex-col items-start justify-between transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                  <div className="font-medium text-gray-900 mb-2">{essay.title}</div>
                  <div className="text-xs text-gray-400 mb-4">Essay ID: {essay.essay_id}</div>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
                    onClick={() => handleReview(essay)}
                    disabled={aiProcessing && reviewingEssay?.essay_id === essay.essay_id}
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {essays.map(essay => (
                <div key={essay.essay_id} className="flex items-center justify-between bg-white rounded-xl shadow p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                  <div>
                    <div className="font-medium text-gray-900">{essay.title}</div>
                    <div className="text-xs text-gray-400">Essay ID: {essay.essay_id}</div>
                  </div>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
                    onClick={() => handleReview(essay)}
                    disabled={aiProcessing && reviewingEssay?.essay_id === essay.essay_id}
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* Modal for AI feedback animation and message */}
          <Modal open={!!reviewingEssay} onClose={handleCloseModal}>
            <GenerateFeedbackCard loading={aiProcessing} feedback={aiFeedback} onClose={handleCloseModal} />
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default GenerateFeedback; 