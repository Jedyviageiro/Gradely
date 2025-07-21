import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageCircle, LogOut, Menu, Search, Wand2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const navItems = [
  { label: 'My Essays', icon: <FileText size={20} />, path: '/dashboard' },
  { label: 'Generate Feedback', icon: <Wand2 size={20} />, path: '/generate-feedback' },
  { label: 'All Feedback', icon: <MessageCircle size={20} />, path: '/feedbacks' },
];

// Helper component to render structured feedback text
const FeedbackTextRenderer = ({ text }) => {
  try {
    const segments = JSON.parse(text);
    if (Array.isArray(segments)) {
      return (
        <p className="text-gray-700 text-sm whitespace-pre-line break-words">
          {segments.map((segment, index) => {
            if (segment.type === 'replace') {
              return (
                <span key={index}>
                  <span className="bg-red-100 text-red-800 line-through decoration-red-400 px-1 rounded-sm mx-px">{segment.original}</span>
                  <span className="bg-green-100 text-green-800 font-medium px-1 rounded-sm mx-px">{segment.suggestion}</span>
                </span>
              );
            }
            if (segment.type === 'quote') {
              return <span key={index} className="bg-gray-100 italic text-gray-600 px-1 rounded-sm mx-px">"{segment.content}"</span>;
            }
            return <span key={index}>{segment.content}</span>;
          })}
        </p>
      );
    }
  } catch { /* Not a JSON string, fall back to plain text */ }
  return <div className="text-gray-700 text-sm whitespace-pre-line break-words">{text}</div>;
};

const AllFeedback = () => {
  const [sidebarActive, setSidebarActive] = useState('All Feedback');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const navItemRefs = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  const fetchFeedbacks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Fetch both feedbacks and essays in parallel to get essay titles
      const [feedbackData, essayData] = await Promise.all([
        api.getUserFeedback(token),
        api.getUserEssays(token),
      ]);

      // Create a lookup map for essay titles for efficient mapping
      const essayTitleMap = new Map(essayData.map(essay => [essay.essay_id, essay.title]));

      // Combine the data, adding the title to each feedback object
      const feedbacksWithTitles = feedbackData.map(fb => ({
        ...fb,
        essay_title: essayTitleMap.get(fb.essay_id) || `Essay #${fb.essay_id}`, // Fallback
      }));

      setFeedbacks(feedbacksWithTitles);
    } catch (err) {
      setError(err.message || "Couldn't load your feedback. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

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
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ease-out group relative overflow-hidden ${
                  sidebarActive === item.label
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 shadow-sm border border-blue-200/50'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]'
                }`}
                onClick={() => {
                  if (item.path) navigate(item.path);
                  setSidebarActive(item.label);
                }}
                title={!sidebarOpen ? item.label : ''}
              >
                <span className={`transition-all duration-150 ${sidebarActive === item.label ? 'text-blue-600 scale-110' : 'text-gray-500 group-hover:text-gray-700'}`}>{item.icon}</span>
                {sidebarOpen && (
                  <span className="transition-all duration-150">{item.label}</span>
                )}
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
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search feedback..."
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  disabled
                />
              </div>
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center text-gray-500 py-16">
              <svg className="animate-spin mr-2" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Loading feedback...
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-red-50/80 rounded-xl border-2 border-dashed border-red-200/50 p-8 text-center">
              <h3 className="text-lg font-medium text-red-800 mb-3">Something went wrong</h3>
              <p className="text-red-600">{error}</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-white/50 rounded-xl border border-white/20 p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <MessageCircle size={32} className="text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent mb-2">No Feedback Yet</h1>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                Once you generate feedback for your essays, it will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {feedbacks.map((fb) => (
                <div key={fb.feedback_id || fb.id} className="bg-white rounded-xl shadow-sm p-5 flex flex-col items-start border border-gray-200 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                  <div className="font-medium text-gray-900 mb-2">Feedback for essay "{fb.essay_title}"</div>
                  <div className="text-xs text-gray-400 mb-2">{new Date(fb.created_at).toLocaleString()}</div>
                  <div className="w-full max-h-28 overflow-hidden relative mb-4">
                    <FeedbackTextRenderer text={fb.feedback_text} />
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                  </div>
                  <div className="flex gap-4 mt-auto">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">Grammar: {fb.typo_score}/10</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Originality: {fb.originality_score}/10</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllFeedback; 