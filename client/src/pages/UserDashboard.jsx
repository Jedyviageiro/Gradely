import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, MessageCircle, LogOut, Menu, Search, Grid, List, Wand2, Edit2, MessageSquare, X, Send, BookOpen } from 'lucide-react';
import api from '../services/api';
import UploadEssayForm from '../components/essay/UploadEssayForm';
import EssayCard from '../components/essay/EssayCard';
import EssayListItem from '../components/essay/EssayListItem';
import Modal from '../components/ui/Modal';
import WriteEssayForm from '../components/essay/WriteEssayForm';
import gradelyLogo from '../assets/gradely-images/gradely-logo.png';
import { useChatModal } from '../context/ChatModalContext';


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
  const [activeTab, setActiveTab] = useState('Recent');
  const [viewMode, setViewMode] = useState('grid');
  const [essays, setEssays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [submittingEssay, setSubmittingEssay] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedEssayId, setSelectedEssayId] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const reviewedEssays = useMemo(() => essays.filter(e => e.has_feedback), [essays]);
  useChatModal();
  
  // Refs for animations
  const tabRefs = useRef([]);
  // Ref for chat container
  const chatContainerRef = useRef(null);

  // State for animation styles
  const [underlineStyle, setUnderlineStyle] = useState({});

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
    // Optimistic UI: Update essay title in state immediately
    const originalEssays = [...essays];
    setEssays(prevEssays =>
      prevEssays.map(essay =>
        essay.essay_id === essayId ? { ...essay, title: newTitle } : essay
      )
    );

    try {
      const token = localStorage.getItem('token');
      await api.updateEssayTitle(token, essayId, newTitle);
    } catch (err) {
      console.error('Failed to update essay:', err);
      setError(err.message || 'Could not update the essay title.');
      // If the API call fails, revert the UI to its original state
      setEssays(originalEssays);
    }
  }, [essays]);

  const handleChatSubmit = useCallback(async (e) => {
    e.preventDefault();
    const question = chatInput.trim();
    if (!question || !selectedEssayId || isChatLoading) return;

    const userMessage = { role: 'user', text: question };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const token = localStorage.getItem('token');
      const data = await api.chatWithEssay(token, selectedEssayId, question);
      const aiMessage = { role: 'assistant', text: data.response };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = { role: 'assistant', text: `Sorry, I ran into an error: ${err.message}`, isError: true };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatInput, selectedEssayId, isChatLoading]);

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

  // Effect for chat auto-scrolling
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // When an essay is selected, start with a greeting
  useEffect(() => {
    if (selectedEssayId && chatMessages.length === 0) {
      const selectedEssay = essays.find(e => e.essay_id === selectedEssayId);
      setChatMessages([
        { role: 'assistant', text: `Hi! I'm Gradely. Feel free to ask me anything about the feedback for your essay, "${selectedEssay?.title || ''}".` },
      ]);
    }
  }, [selectedEssayId, essays]);

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/80 px-6 py-4 sticky top-0 z-30 w-full">
        <div className="flex items-center justify-between">
          <div className="flex-1">
              {/* Empty space for alignment */}
            </div>
          
          {/* Search and Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                // You can enhance this by showing the error in the form
                console.error("Failed to submit written essay:", err);
                alert(err.message || "Could not submit essay.");
              } finally {
                setSubmittingEssay(false);
              }
            }}
            submitting={submittingEssay}
          />
        </Modal>

        {/* Chat Modal--------------------------------------------------------------- */}
        <Modal open={chatModalOpen} onClose={() => setChatModalOpen(false)}>
  <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-0 overflow-hidden flex flex-col poppins-font border border-gray-100">
    {/* Header with logo */}
    <div className="flex items-center gap-4 px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center gap-3">
        <img src={gradelyLogo} alt="Gradely Logo" className="w-10 h-10 rounded-xl shadow-sm" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Text Gradely</h2>
          <p className="text-sm text-gray-600">AI Essay Assistant</p>
        </div>
      </div>
      <button 
        className="ml-auto p-2.5 rounded-full hover:bg-white/80 text-gray-400 hover:text-red-500 transition-all duration-200" 
        onClick={() => setChatModalOpen(false)}
      >
        <X size={22} />
      </button>
    </div>

    {/* Essay selection */}
    {!selectedEssayId ? (
      <div className="flex-1 flex flex-col items-center justify-center px-10 py-16 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="bg-blue-100 p-4 rounded-2xl mb-6">
          <MessageSquare size={48} className="text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Select an Essay to Chat About</h3>
        <p className="text-gray-500 text-center mb-8 max-w-md leading-relaxed">
          Choose a reviewed essay to ask Gradely questions about your feedback and get personalized insights.
        </p>
        
        <div className="w-full max-w-sm space-y-4">
          <select
            className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-base focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 font-medium"
            value={selectedEssayId}
            onChange={e => setSelectedEssayId(e.target.value)}
          >
            <option value="" className="text-gray-500">Select a reviewed essay...</option>
            {reviewedEssays.map(e => (
              <option key={e.essay_id} value={e.essay_id}>{e.title}</option>
            ))}
          </select>
          
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105"
            onClick={() => selectedEssayId && setSelectedEssayId(selectedEssayId)}
            disabled={!selectedEssayId}
          >
            Start Chatting 
            <span className="ml-2">💬</span>
          </button>
        </div>
      </div>
    ) : (
      <div className="flex flex-col h-[500px]">
        {/* Selected essay indicator */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-900">
                Chatting about: {essays.find(e => e.essay_id === selectedEssayId)?.title || ''}
              </span>
            </div>
            <button
              onClick={() => setSelectedEssayId('')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
            >
              Change Essay
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-gradient-to-b from-white to-gray-50/30 space-y-4">
          {chatMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gray-100 p-3 rounded-xl mb-4">
                <MessageSquare size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">Ask me anything about your essay feedback!</p>
            </div>
          )}
          
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-2xl px-5 py-3 max-w-sm break-words shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                  : msg.isError
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-white text-gray-800 border border-gray-100'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isChatLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-5 py-3 max-w-sm bg-white text-gray-800 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                  <span className="ml-2 text-xs text-gray-500">Gradely is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-100 bg-white px-6 py-4">
          <form className="flex items-center gap-3" onSubmit={handleChatSubmit}>
            <div className="flex-1 relative">
              <input
                className="w-full border-2 border-gray-200 rounded-2xl px-5 py-3 pr-12 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 text-base bg-gray-50/50 disabled:bg-gray-200 disabled:text-gray-500 placeholder:text-gray-400"
                placeholder="Ask about your essay feedback..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                disabled={isChatLoading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                {chatInput.length}/500
              </div>
            </div>
            <button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3.5 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105" 
              disabled={isChatLoading || !chatInput.trim()}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    )}
  </div>
</Modal>




        </main>
      </div>
  );
};

export default UserDashboard;