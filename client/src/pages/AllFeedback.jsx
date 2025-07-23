import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Search } from 'lucide-react';
import api from '../services/api';
import FeedbackCard from '../components/feedback/FeedbackCard';
import FeedbackModal from '../components/feedback/FeedbackModal';
import FeedbackCardSkeleton from '../components/feedback/FeedbackCardSkeleton';
import gradelyLogo from '../assets/gradely-images/gradely-logo.png';

const AllFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFeedbacks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Fetch both feedbacks and essays in parallel to get essay titles
      const feedbackData = await api.getUserFeedback(token);
      setFeedbacks(feedbackData);
    } catch (err) {
      setError(err.message || "Couldn't load your feedback. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleCardClick = (feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  const filteredFeedbacks = useMemo(() => {
    if (!searchQuery.trim()) {
      return feedbacks;
    }
    return feedbacks.filter(fb =>
      fb.essay_title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [feedbacks, searchQuery]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3">
              <img src={gradelyLogo} alt="Gradely Logo" className="w-8 h-8 object-contain" />
              <span className="text-2xl font-normal text-gray-700 hidden sm:block">
                Gradely
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search feedback..."
                  className="pl-10 pr-4 py-2 w-80 border border-gray-200 bg-gray-100/50 rounded-full focus:ring-2 focus:ring-blue-200 focus:border-transparent outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-6">
          {isLoading ? ( // Display skeleton loader while loading
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <FeedbackCardSkeleton key={i} />)}
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
          ) : filteredFeedbacks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFeedbacks.map((feedback) => (
                <FeedbackCard
                  key={feedback.feedback_id}
                  feedback={feedback}
                  onClick={() => handleCardClick(feedback)}
                  highlight={searchQuery}
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-white/50 rounded-xl border border-white/20 p-8 text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent mb-2">No Results Found</h1>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                No feedback matched your search for "{searchQuery}". Try another search.
              </p>
            </div>
          )}
        </main>

        {/* The Modal for displaying full feedback */}
        <FeedbackModal isOpen={isModalOpen} onClose={handleCloseModal} feedback={selectedFeedback} />
      </div>
    </div>
  );
};

export default AllFeedback; 