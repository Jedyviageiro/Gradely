import { useState } from 'react';
import { FileText, MoreVertical, Clock, Edit2, Trash2 } from 'lucide-react';

// A helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Helper component to highlight search matches
const HighlightedText = ({ text, highlight }) => {
  if (!highlight || !highlight.trim()) {
    return <span>{text}</span>;
  }
  // Create a case-insensitive regex
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 rounded">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

const EssayListItem = ({ essay, onDelete, onEditTitle, highlight = '' }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this essay?')) return;
    if (onDelete) onDelete();
    setMenuOpen(false);
  };

  const handleEdit = () => {
    const newTitle = window.prompt('Enter new title:', essay.title);
    if (newTitle && newTitle.trim() && onEditTitle) {
      onEditTitle(newTitle.trim());
    }
    setMenuOpen(false);
  };

  // (removed unused handleWrapperClick)

  return (
    <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <div className="bg-blue-50 p-3 rounded-lg mr-4">
        <FileText size={20} className="text-blue-500" />
      </div>
      <div className="flex-1">
        <h3 className="text-md font-semibold text-gray-800">
          <HighlightedText text={essay.title} highlight={highlight} />
        </h3>
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>Uploaded: {formatDate(essay.uploaded_at)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 relative menu-container">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${essay.has_feedback ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {essay.has_feedback ? 'Reviewed' : 'Pending'}
        </span>
        <button
          className="p-2 rounded-full hover:bg-gray-200 text-gray-500"
          onClick={() => setMenuOpen(v => !v)}
        >
          <MoreVertical size={18} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <button
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleEdit}
            >
              <Edit2 size={16} /> Edit Title
            </button>
            <button
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EssayListItem;