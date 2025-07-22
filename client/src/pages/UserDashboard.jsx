import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  Edit2,
  Search,
  Grid,
  List,
  LogOut,
} from 'lucide-react';
import api from '../services/api';
import UploadEssayForm from '../components/essay/UploadEssayForm';
import EssayCard from '../components/essay/EssayCard';
import EssayListItem from '../components/essay/EssayListItem';
import Modal from '../components/ui/Modal';
import WriteEssayForm from '../components/essay/WriteEssayForm';
import { useChatModal } from '../hooks/useChatModal';

const filterTabs = ['All Essays', 'Recent', 'Needs Review'];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('Recent');
  const [viewMode, setViewMode] = useState('grid');
  const [essays, setEssays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [submittingEssay, setSubmittingEssay] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { openChat } = useChatModal();

  const navigate = useNavigate();
  const tabRefs = useRef([]);
  const [underlineStyle, setUnderlineStyle] = useState({});

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const fetchEssays = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        logout();
        return;
      }
      const data = await api.getUserEssays(token);
      setEssays(data);
    } catch (err) {
      setError(err.message || "Couldn't load your essays.");
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const handleDeleteEssay = useCallback(
    async (essayId) => {
      const originalEssays = [...essays];
      setEssays((prev) => prev.filter((e) => e.essay_id !== essayId));

      try {
        const token = localStorage.getItem('token');
        await api.deleteEssay(token, essayId);
      } catch (err) {
        setError(err.message || 'Could not delete the essay.');
        setEssays(originalEssays);
      }
    },
    [essays]
  );

  const handleUpdateEssay = useCallback(
    async (essayId, newTitle) => {
      const originalEssays = [...essays];
      setEssays((prev) =>
        prev.map((essay) =>
          essay.essay_id === essayId ? { ...essay, title: newTitle } : essay
        )
      );

      try {
        const token = localStorage.getItem('token');
        await api.updateEssayTitle(token, essayId, newTitle);
      } catch (err) {
        setError(err.message || 'Could not update the essay title.');
        setEssays(originalEssays);
      }
    },
    [essays]
  );

  useEffect(() => {
    fetchEssays();
  }, [fetchEssays]);

  useEffect(() => {
    const activeTabIndex = filterTabs.findIndex((tab) => tab === activeTab);
    const activeTabEl = tabRefs.current[activeTabIndex];
    if (activeTabEl) {
      setUnderlineStyle({
        left: activeTabEl.offsetLeft,
        width: activeTabEl.offsetWidth,
      });
    }
  }, [activeTab]);

  const handleUploadSuccess = () => {
    setUploadModalOpen(false);
    fetchEssays();
  };

  const filteredEssays = useMemo(() => {
    if (!essays) return [];

    let essaysToFilter = essays;

    switch (activeTab) {
      case 'Recent': {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        essaysToFilter = essays.filter(
          (essay) => new Date(essay.uploaded_at) > sevenDaysAgo
        );
        break;
      }
      case 'Needs Review':
        essaysToFilter = essays.filter((essay) => !essay.has_feedback);
        break;
      case 'All Essays':
      default:
        break;
    }

    if (searchQuery.trim() === '') return essaysToFilter;
    return essaysToFilter.filter((essay) =>
      essay.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [essays, activeTab, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/80 px-6 py-4 sticky top-0 z-30 w-full">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search essays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-48 md:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setUploadModalOpen(true)}
            >
              <Upload size={16} />
              <span className="hidden md:inline">Upload</span>
            </button>
            <button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setWriteModalOpen(true)}
            >
              <Edit2 size={16} />
              <span className="hidden md:inline">Write</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex border-b border-gray-200 relative">
            {filterTabs.map((tab, index) => (
              <button
                ref={(el) => (tabRefs.current[index] = el)}
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

        {/* Essay Content */}
        {isLoading ? (
          <div className="flex items-center justify-center text-gray-500">
            Loading essays...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 rounded-xl border-2 border-dashed border-red-200 p-8 text-center">
            <h3 className="text-lg font-medium text-red-800 mb-3">
              Something went wrong
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        ) : essays.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border-2 border-dashed border-gray-300 p-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FileText size={20} className="text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent mb-2">
              No Essays Yet
            </h1>
            <p className="text-gray-500 mb-8 text-center max-w-sm leading-relaxed">
              Get started by uploading your first essay.
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
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent mb-2">
              No Essays Found
            </h1>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              No essays match the "{activeTab}" filter.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEssays.map((essay) => (
              <EssayCard
                key={essay.essay_id}
                essay={essay}
                onDelete={() => handleDeleteEssay(essay.essay_id)}
                onEditTitle={(newTitle) =>
                  handleUpdateEssay(essay.essay_id, newTitle)
                }
                onChat={() => openChat(essay.essay_id)}
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
                onEditTitle={(newTitle) =>
                  handleUpdateEssay(essay.essay_id, newTitle)
                }
                onChat={() => openChat(essay.essay_id)}
                highlight={searchQuery}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <Modal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)}>
          <UploadEssayForm
            onClose={() => setUploadModalOpen(false)}
            onUploadSuccess={handleUploadSuccess}
          />
        </Modal>

        <Modal open={writeModalOpen} onClose={() => setWriteModalOpen(false)}>
          <WriteEssayForm
            onClose={() => setWriteModalOpen(false)}
            onSubmit={async ({ title, content }) => {
              setSubmittingEssay(true);
              try {
                const token = localStorage.getItem('token');
                await api.createEssayFromText(token, title, content);
                setWriteModalOpen(false);
                fetchEssays();
              } catch (err) {
                alert(err.message || 'Could not submit essay.');
              } finally {
                setSubmittingEssay(false);
              }
            }}
            submitting={submittingEssay}
          />
        </Modal>
      </main>
    </div>
  );
};

export default UserDashboard;
