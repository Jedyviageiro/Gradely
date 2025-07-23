import { useState } from 'react';
import { FileText, MoreVertical, Clock, Edit2, Trash2, Check, X, MessageSquare, Tag } from 'lucide-react';

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

const EssayCard = ({ essay, onDelete, onEditTitle, onChat, highlight = '' }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(essay.title);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Close menu on click outside
  // (for brevity, not implemented here, but can be added with useEffect and event listeners)

  const handleEdit = async () => {
    if (!newTitle.trim() || newTitle === essay.title) {
      setEditing(false);
      setMenuOpen(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      // The onEditTitle prop is a handler passed from the parent (UserDashboard)
      // which will perform the API call and refetch the essay list.
      if (onEditTitle) await onEditTitle(newTitle.trim());
      setEditing(false);
      setMenuOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to update title');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    console.log('Delete button clicked for essay:', essay.essay_id);
    if (!window.confirm('Are you sure you want to delete this essay? This action cannot be undone.')) {
      console.log('Delete cancelled by user.');
      return;
    }
    setMenuOpen(false);
    console.log('Calling onDelete for essay:', essay.essay_id);
    if (onDelete) onDelete(essay.essay_id);
  };

  // Use a placeholder if content is not available or empty
  const contentSnippet = essay.content
    ? essay.content.substring(0, 100) + (essay.content.length > 100 ? '...' : '')
    : 'No content preview available.';

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col relative">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-full">
              <FileText size={20} className="text-blue-500" />
            </div>
            {editing ? (
              <input
                className="text-md font-semibold text-gray-800 leading-tight border-b border-blue-400 focus:outline-none px-1 py-0.5 bg-blue-50 rounded"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                disabled={loading}
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') handleEdit();
                  if (e.key === 'Escape') { setEditing(false); setNewTitle(essay.title); }
                }}
              />
            ) : (
              <h3 className="text-md font-semibold text-gray-800 leading-tight">
                <HighlightedText text={essay.title} highlight={highlight} />
              </h3>
            )}
          </div>
          <div className="relative">
            <button className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500" onClick={() => setMenuOpen(v => !v)}>
              <MoreVertical size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {essay.has_feedback && (
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      if (onChat) onChat();
                      setMenuOpen(false);
                    }}
                  >
                    <MessageSquare size={16} /> Chat about Feedback
                  </button>
                )}
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => { setEditing(true); setMenuOpen(false); }}
                  disabled={loading}
                >
                  <Edit2 size={16} /> Edit Title
                </button>
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
        {error && <div className="text-xs text-red-500 mb-2">{error}</div>}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {contentSnippet}
        </p>
        {editing && (
          <div className="flex gap-2 mt-2">
            <button
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-xs"
              onClick={handleEdit}
              disabled={loading}
            >
              <Check size={14} /> Save
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 text-xs"
              onClick={() => { setEditing(false); setNewTitle(essay.title); }}
              disabled={loading}
            >
              <X size={14} /> Cancel
            </button>
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 bg-gray-50/70 px-5 py-3 flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Clock size={14} />
          <span>Uploaded: {formatDate(essay.uploaded_at)}</span>
        </div>
        {essay.tonality && (
          <div className="flex items-center gap-1.5 bg-gray-200 px-2 py-0.5 rounded-full">
            <Tag size={12} />
            <span>{essay.tonality}</span>
          </div>
        )}
        {/* Dynamic status badge */}
        <span className={`px-2 py-0.5 rounded-full font-medium ${essay.has_feedback ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {essay.has_feedback ? 'Reviewed' : 'Pending'}
        </span>
      </div>
    </div>
  );
};

export default EssayCard;