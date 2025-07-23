import { BookOpen, Calendar } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const HighlightedText = ({ text, highlight }) => {
  if (!highlight || !highlight.trim() || !text) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 rounded">{part}</span>
        ) : (
          part
        )
      )}
    </span>
  );
};

const ScoreBadge = ({ label, score, colorClass }) => (
  <div className={`flex items-center gap-1.5 ${colorClass} px-2.5 py-1 rounded-full text-xs font-semibold`}>
    <span>{label}:</span>
    <span className="font-bold">{score}/10</span>
  </div>
);

const FeedbackCard = ({ feedback, onClick, highlight = '' }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm p-5 flex flex-col items-start border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 cursor-pointer group"
    >
      <div className="flex items-center gap-2 mb-2">
        <BookOpen size={16} className="text-blue-500" />
        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          <HighlightedText text={feedback.essay_title} highlight={highlight} />
        </h3>
      </div>
      <div className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
        <Calendar size={12} />
        <span>{formatDate(feedback.created_at)}</span>
      </div>

      <p className="text-sm text-gray-600 mb-5 flex-grow line-clamp-3">
        Click to view the full AI-generated feedback report, including scores and detailed suggestions.
      </p>

      <div className="flex flex-wrap gap-2 mt-auto w-full border-t border-gray-100 pt-4">
        <ScoreBadge label="Grammar" score={feedback.typo_score} colorClass="bg-blue-50 text-blue-700" />
        <ScoreBadge label="Originality" score={feedback.originality_score} colorClass="bg-green-50 text-green-700" />
      </div>
    </div>
  );
};

export default FeedbackCard;