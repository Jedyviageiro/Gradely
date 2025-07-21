import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, MessageCircle, LogOut, Menu, Search, Grid, List, Wand2 } from 'lucide-react';
import api from '../services/api';
import UploadEssayForm from '../components/essay/UploadEssayForm';
import EssayCard from '../components/essay/EssayCard';
import EssayListItem from '../components/essay/EssayListItem';
import Modal from '../components/ui/Modal';

const navItems = [
  { label: 'My Essays', icon: <FileText size={20} />, path: '/dashboard' },
  { label: 'Generate Feedback', icon: <Wand2 size={20} />, path: '/generate-feedback' },
  { label: 'All Feedback', icon: <MessageCircle size={20} />, path: '/feedbacks' },
];

const GenerateFeedbackView = ({ essays, onGenerateClick }) => {
  const essaysToReview = essays.filter(essay => !essay.feedback); // Assuming `feedback` field indicates review status

  if (essaysToReview.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <MessageCircle size={32} className="text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">All Caught Up!</h3>
        <p className="text-gray-500 max-w-sm leading-relaxed">
          You have reviewed all the essays. Great job!
        </p>
      </div>
    );
  }

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Essays Awaiting Feedback</h2>
        {essaysToReview.map(essay => (
          <div key={essay.essay_id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between transition-all hover:shadow-md hover:border-blue-300">
            <span className="font-medium text-gray-700">{essay.title}</span>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              onClick={() => onGenerateClick(essay)}
            >
              Generate Feedback
            </button>
          </div>
        ))}
      </div>
    );
  };

const filterTabs = [
  'All Essays',
  'Recent',
  'Needs Review',
];

const UserDashboard = () => {
  const [sidebarActive, setSidebarActive] = useState('My Essays');
  const [activeTab, setActiveTab] = useState('Recent');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [essays, setEssays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Refs for animations
  const tabRefs = useRef([]);
  const navItemRefs = useRef([]);

  // State for animation styles
  const [underlineStyle, setUnderlineStyle] = useState({});
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const logout = useCallback(() => {
    console.log('Logging out and clearing token...');
    localStorage.removeItem('token'); // Assumes token is stored in localStorage
    navigate('/login'); // Redirect to login page
  }, [navigate]);

  const fetchEssays = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, the user is not authenticated.
        logout();
        return;
      }
      const data = await api.getUserEssays(token);
      setEssays(data);
    } catch (err) {
      setError(err.message || "Couldn't load your essays. Please try again later.");
      // If the token is invalid or expired, the API might return a 401 Unauthorized error.
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const handleDeleteEssay = useCallback(async (essayId) => {
    // Optimistic UI: Remove essay from state immediately
    const originalEssays = [...essays];
    setEssays(prevEssays => prevEssays.filter(e => e.essay_id !== essayId));

    try {
      const token = localStorage.getItem('token');
      await api.deleteEssay(token, essayId);
      // No need to fetchEssays() anymore, the UI is already updated.
    } catch (err) {
      console.error('Failed to delete essay:', err);
      setError(err.message || 'Could not delete the essay.');
      // If the API call fails, revert the UI to its original state
      setEssays(originalEssays);
    }
  }, [essays]);

  const handleUpdateEssay = useCallback(async (essayId, newTitle) => {
    try {
      const token = localStorage.getItem('token');
      await api.updateEssayTitle(token, essayId, newTitle);
      fetchEssays(); // Re-fetch to get the updated list, which is correct
    } catch (err) {
      console.error('Failed to update essay:', err);
      setError(err.message || 'Could not update the essay title.');
    }
  }, [fetchEssays]);

  useEffect(() => {
    fetchEssays();
  }, [fetchEssays]);

  // Effect for tab underline animation
  useEffect(() => {
    const activeTabIndex = filterTabs.findIndex(tab => tab === activeTab);
    const activeTabEl = tabRefs.current[activeTabIndex];
    if (activeTabEl) {
      setUnderlineStyle({
        left: activeTabEl.offsetLeft,
        width: activeTabEl.offsetWidth,
      });
    }
  }, [activeTab]);

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

  const handleUploadSuccess = () => {
    setUploadModalOpen(false);
    fetchEssays(); // Re-fetch essays to show the new one
  };

  const filteredEssays = useMemo(() => {
    if (!essays) return [];

    let essaysToFilter = essays;

    switch (activeTab) {
      case 'Recent': {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        essaysToFilter = essays.filter(essay => new Date(essay.uploaded_at) > sevenDaysAgo);
        break;
      }
      case 'Needs Review':
        // This relies on the backend change to add `has_feedback`
        essaysToFilter = essays.filter(essay => !essay.has_feedback);
        break;
      case 'All Essays':
      default:
        // No tab filtering needed for 'All Essays'
        break;
    }

    // Then, filter by the search query on the already tab-filtered list
    if (searchQuery.trim() === '') return essaysToFilter;
    return essaysToFilter.filter(essay => essay.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [essays, activeTab, searchQuery]);

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
                <span className={`transition-all duration-150 ${sidebarActive === item.label ? 'text-blue-600 scale-110' : 'text-gray-500 group-hover:text-gray-700'}`}>
                  {item.icon}
                </span>
                {sidebarOpen && (
                  <span className="transition-all duration-150">{item.label}</span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-gray-200">
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
            <div className="flex-1">
              {/* Empty space for alignment */}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search essays..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setUploadModalOpen(true)}
              >
                <Upload size={16} />
                Upload Essay
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Filter Tabs and View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex border-b border-gray-200 relative">
              {filterTabs.map((tab, index) => (
                <button
                  ref={el => (tabRefs.current[index] = el)}
                  key={tab}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
              <div
                className="absolute bottom-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 ease-in-out"
                style={underlineStyle}
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} className="text-gray-600" />
              </button>
              <button
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content Area: Now dynamic based on API call */}
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">Loading essays...</div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-red-50 rounded-xl border-2 border-dashed border-red-200 p-8 text-center">
              <h3 className="text-lg font-medium text-red-800 mb-3">Something went wrong</h3>
              <p className="text-red-600">{error}</p>
            </div>
          ) : essays.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border-2 border-dashed border-gray-300 p-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FileText size={20} className="text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent mb-2">No Essays Yet</h1>
              <p className="text-gray-500 mb-8 text-center max-w-sm leading-relaxed">
                Get started by uploading your first essay. You'll be able to track feedback and submissions here.
              </p>
              <button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setUploadModalOpen(true)}
              >
                <Upload size={16} />
                Upload Your First Essay
              </button>
            </div>
          ) : filteredEssays.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent mb-2">No Essays Found</h1>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                There are no essays that match the "{activeTab}" filter.
              </p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredEssays.map((essay) => (
                    <EssayCard
                      key={essay.essay_id}
                      essay={essay}
                      onDelete={() => handleDeleteEssay(essay.essay_id)}
                      onEditTitle={(newTitle) => handleUpdateEssay(essay.essay_id, newTitle)}
                      highlight={searchQuery}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEssays.map((essay) => (
                    <EssayListItem
                      key={essay.essay_id}
                      essay={essay}
                      onDelete={() => handleDeleteEssay(essay.essay_id)}
                      onEditTitle={(newTitle) => handleUpdateEssay(essay.essay_id, newTitle)}
                      highlight={searchQuery}
                    />
                  ))}
                </div>
              )}
            </>
          )}
          {/* Upload Essay Modal */}
          <Modal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} >
            <UploadEssayForm
              onClose={() => setUploadModalOpen(false)}
              onUploadSuccess={handleUploadSuccess}
            />
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;