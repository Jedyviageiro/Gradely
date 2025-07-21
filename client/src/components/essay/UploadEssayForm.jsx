import { useRef, useState } from 'react';
import { UploadCloud, FileText, X, Loader2 } from 'lucide-react';
import api from '../../services/api';

const UploadEssayForm = ({ onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && (f.type === 'application/pdf' || f.type === 'text/plain')) {
      setFile(f);
      setError('');
    } else {
      setFile(null);
      setError('Please select a .pdf or .txt file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const f = e.dataTransfer.files[0];
      if (f && (f.type === 'application/pdf' || f.type === 'text/plain')) {
        setFile(f);
        setError('');
      } else {
        setFile(null);
        setError('Please select a .pdf or .txt file.');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setError('Please provide both a title and a file.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication error. Please log in again.');
        setSubmitting(false);
        return;
      }

      await api.uploadEssay(token, title, file);

      // On success, call the callback from the parent to refresh the list and close the modal
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during upload.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 relative">
      {onClose && (
        <button
          className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
          onClick={onClose}
          type="button"
        >
          <X size={20} />
        </button>
      )}
      <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
        <UploadCloud className="text-blue-500" size={22} />
        Add a New Essay
      </h2>
      <p className="text-gray-500 mb-6 text-sm">Fill in the details and upload your essay file.</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Essay title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Essay File <span className="text-red-500">*</span></label>
          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400'}`}
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={handleFileChange}
              required
            />
            <UploadCloud size={32} className="text-blue-400 mb-2" />
            <span className="text-blue-600 font-medium text-sm mb-1">Click to Upload or drag and drop</span>
            <span className="text-xs text-gray-400">PDF or TXT, max 25MB</span>
          </div>
          {file && (
            <div className="flex items-center gap-2 mt-3 bg-gray-100 rounded px-3 py-2">
              <FileText size={18} className="text-gray-400" />
              <span className="text-gray-700 text-sm truncate max-w-[180px]">{file.name}</span>
              <span className="text-gray-400 text-xs">{(file.size / 1024).toFixed(1)} KB</span>
              <button type="button" className="ml-auto text-gray-400 hover:text-red-500" onClick={() => setFile(null)}>
                <X size={16} />
              </button>
            </div>
          )}
          {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
        </div>
        {/* Progress bar placeholder */}
        {submitting && (
          <div className="flex items-center gap-2 text-blue-600 text-sm">
            <Loader2 className="animate-spin" size={18} /> Uploading...
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60 flex items-center justify-center gap-2"
          disabled={!title || !file || submitting}
        >
          {submitting ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
          {submitting ? 'Uploading...' : 'Upload Essay'}
        </button>
      </form>
    </div>
  );
};

export default UploadEssayForm; 