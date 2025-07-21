import { Sparkles, X, BarChart3 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const TypingText = ({ text }) => {
  const [displayed, setDisplayed] = useState('');
  const i = useRef(0);

  useEffect(() => {
    setDisplayed('');
    i.current = 0;
    if (!text) return;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i.current]);
      i.current++;
      if (i.current >= text.length) clearInterval(interval);
    }, 14);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
};

const StructuredFeedback = ({ segments }) => {
  // Fallback for plain string feedback for backward compatibility
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
        // NEW: Handle the 'quote' type for conversational feedback
        if (segment.type === 'quote') {
          return (
            <span key={index} className="bg-gray-100 italic text-gray-600 px-1 rounded-sm mx-px">
              "{segment.content}"
            </span>
          );
        }
        // Default to plain text
        return <span key={index}>{segment.content}</span>;
      })}
    </p>
  );
};

const BlurredTextShimmer = () => (
  <div className="w-full flex flex-col gap-2 mt-8 mb-6">
    {[...Array(5)].map((_, idx) => (
      <div
        key={idx}
        className="relative overflow-hidden rounded-lg bg-gray-100 h-4"
        style={{ filter: 'blur(1px)', width: `${100 - idx * 8}%` }}
      >
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-gray-300/60 to-transparent" style={{ backgroundSize: '200% 100%' }} />
      </div>
    ))}
    <style>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .animate-shimmer {
        animation: shimmer 1.8s ease-in-out infinite;
      }
    `}</style>
  </div>
);

const GenerateFeedbackCard = ({ loading, feedback, onClose }) => {
  const [showScores, setShowScores] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Extract data from feedback prop, with fallbacks for safety
  const message = typeof feedback === 'string' ? feedback : feedback?.message;
  const scores = feedback?.scores;
  const analysis = feedback?.analysis;
  
  // Use scores from props, or default to 0
  const grammarScore = scores?.grammar || 0;
  const originalityScore = scores?.originality || 0;
  
  const getScoreColor = (score) => {
    if (score <= 5) {
      const ratio = score / 5;
      return `hsl(${ratio * 30}, 85%, 55%)`;
    } else {
      const ratio = (score - 5) / 5;
      return `hsl(${30 + ratio * 90}, 85%, 45%)`;
    }
  };

  useEffect(() => {
    if (!showScores && feedback && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [showScores, feedback, hasAnimated]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full mx-auto">
        {/* Main card with clean design */}
        <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header with close button */}
          {feedback && !loading && (
            <div className="absolute top-5 right-5 z-20">
              <button
                className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-200"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-8 max-h-[85vh] overflow-y-auto">
            {loading ? (
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="text-white animate-pulse" size={14} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Analyzing your essay...</h3>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Please wait while we generate detailed feedback
                </p>
                <BlurredTextShimmer />
              </div>
            ) : showScores ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center pb-4 border-b border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900">Detailed Analysis</h3>
                  <p className="text-sm text-gray-500 mt-1">Your essay performance breakdown</p>
                </div>

                {/* Scores Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Grammar</div>
                    <div className="text-3xl font-bold mb-1" style={{ color: getScoreColor(grammarScore) }}>
                      {grammarScore}
                    </div>
                    <div className="text-xs text-gray-400">out of 10</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Originality</div>
                    <div className="text-3xl font-bold mb-1" style={{ color: getScoreColor(originalityScore) }}>
                      {originalityScore}
                    </div>
                    <div className="text-xs text-gray-400">out of 10</div>
                  </div>
                </div>

                {/* Analysis Details */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="max-h-80 overflow-y-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Grammar Analysis */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 text-sm">Grammar Feedback</h4>
                        <div className="space-y-2">
                          {analysis?.grammar?.map((point, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-600 leading-relaxed">{point}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 leading-relaxed">
                            <span className="font-medium">Scoring method:</span> We analyze punctuation, subject-verb agreement, 
                            tense consistency, sentence structure, and word choice for overall writing clarity.
                          </p>
                        </div>
                      </div>

                      {/* Originality Analysis */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 text-sm">Originality Feedback</h4>
                        <div className="space-y-2">
                          {analysis?.originality?.map((point, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-600 leading-relaxed">{point}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 leading-relaxed">
                            <span className="font-medium">Scoring method:</span> We measure uniqueness of ideas and phrasing 
                            by comparing against common arguments and identifying fresh perspectives.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Button */}
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setShowScores(false)}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-150 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    ← Back to Feedback
                  </button>
                </div>
              </div>
            ) : feedback ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center pb-4 border-b border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900">Essay Feedback</h3>
                  <p className="text-sm text-gray-500 mt-1">Here's your detailed analysis</p>
                </div>

                {/* Feedback Content */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="max-h-80 overflow-y-auto">
                    <StructuredFeedback segments={message} />
                  </div>
                </div>

                {/* View Scores Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowScores(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <BarChart3 size={16} />
                    View Detailed Scores
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="text-red-500" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Generate Feedback</h3>
                <p className="text-sm text-gray-500">Please try again or contact support if the issue persists.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateFeedbackCard;