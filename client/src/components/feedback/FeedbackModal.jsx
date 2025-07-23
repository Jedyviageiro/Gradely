import { useEffect, useState } from 'react';
import { X, BookOpen, Tag, Calendar, BarChart2 } from 'lucide-react';

const formatDate = (dateString) => new Date(dateString).toLocaleString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
});

const FeedbackRenderer = ({ segments }) => {
  // Fallback for plain string feedback
  if (!Array.isArray(segments)) {
    return <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{segments}</p>;
  }

  return (
    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
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
          return (
            <span key={index} className="bg-gray-100 italic text-gray-600 px-1 rounded-sm mx-px">"{segment.content}"</span>
          );
        }
        return <span key={index}>{segment.content}</span>;
      })}
    </p>
  );
};

const ScoreDisplay = ({ label, score }) => {
  const getScoreColor = (s) => `hsl(${s * 12}, 85%, 45%)`;
  return (
    <div className="text-center bg-gray-50 p-4 rounded-xl border border-gray-200">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{label}</div>
      <div className="text-4xl font-bold" style={{ color: getScoreColor(score) }}>{score}</div>
      <div className="text-xs text-gray-400">/ 10</div>
    </div>
  );
};

const FeedbackModal = ({ isOpen, onClose, feedback }) => {
  const [parsedFeedback, setParsedFeedback] = useState([]);

  useEffect(() => {
    if (feedback?.feedback_text) {
      try {
        // Parse the JSON string to be rendered
        const parsed = JSON.parse(feedback.feedback_text);
        setParsedFeedback(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error("Failed to parse feedback text:", e);
        // If parsing fails, treat it as a plain string for the renderer
        setParsedFeedback(feedback.feedback_text);
      }
    }
  }, [feedback]);

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen || !feedback) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-out transform scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex-shrink-0 p-6 border-b border-gray-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <BookOpen className="text-blue-600" size={20} />
              <h2 className="text-xl font-bold text-gray-800">{feedback.essay_title}</h2>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5"><Tag size={12} /><span>{feedback.essay_tonality}</span></div>
              <div className="flex items-center gap-1.5"><Calendar size={12} /><span>{formatDate(feedback.created_at)}</span></div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        {/* Body */}
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Scores */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <BarChart2 size={18} className="text-gray-500" />
                  Overall Scores
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  <ScoreDisplay label="Grammar" score={feedback.typo_score} />
                  <ScoreDisplay label="Originality" score={feedback.originality_score} />
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Feedback */}
            <div className="lg:col-span-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Detailed Feedback</h3>
              </div>
              {parsedFeedback && parsedFeedback.length > 0 ? (
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <FeedbackRenderer segments={parsedFeedback} />
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">No detailed feedback points available.</div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 p-4 bg-gray-50 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Close
          </button>
        </footer>
      </div>
      <style>{`
        @keyframes fadeInScale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FeedbackModal;