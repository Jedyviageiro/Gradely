import { useState, useMemo } from 'react';
import { X, Loader2, Wand2 } from 'lucide-react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import './poppins.css';
import api from '../../services/api';

// Default valid Slate value - must be defined outside component
const INITIAL_VALUE = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

// Helper to convert plain text to Slate's node structure
const textToSlate = (text) => {
  if (!text || typeof text !== 'string') {
    return INITIAL_VALUE;
  }
  
  const lines = text.split('\n');
  if (lines.length === 0) {
    return INITIAL_VALUE;
  }
  
  return lines.map(line => ({
    type: 'paragraph',
    children: [{ text: line || '' }],
  }));
};

const WriteEssayForm = ({ onClose, onSubmit, submitting, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  
  // Create editor outside of any conditional logic
  const editor = useMemo(() => withReact(createEditor()), []);
  
  // Initialize with proper initial content
  const [value, setValue] = useState(() => {
    if (initialData?.content) {
      try {
        return textToSlate(initialData.content);
      } catch (error) {
        console.error('Error setting initial content:', error);
        return INITIAL_VALUE;
      }
    }
    return INITIAL_VALUE;
  });

  const [error, setError] = useState('');
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [correctionError, setCorrectionError] = useState('');
  const [editorKey, setEditorKey] = useState(0); // Key to force re-render
  
  // Convert slate content to plain text
  const plainTextContent = useMemo(() => {
    if (!value || !Array.isArray(value)) return '';
    return value.map(n => {
      if (!n || !n.children || !Array.isArray(n.children)) return '';
      return n.children.map(c => c?.text || '').join('');
    }).join('\n');
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !plainTextContent.trim()) {
      setError('Please provide both a title and essay content.');
      return;
    }
    setError('');
    if (onSubmit) onSubmit({ title: title.trim(), content: plainTextContent.trim() });
  };

  const handleGrammarCheck = async () => {
    console.log('Grammar check clicked, content:', plainTextContent); // Debug log
    
    if (!plainTextContent.trim()) {
      setCorrectionError('There is no content to correct.');
      setTimeout(() => setCorrectionError(''), 3000);
      return;
    }
    
    setIsCorrecting(true);
    setCorrectionError('');
    
    try {
      const token = localStorage.getItem('token');
      console.log('Making API call with token:', token ? 'exists' : 'missing'); // Debug log
      
      const result = await api.correctGrammar(token, plainTextContent);
      console.log('API result:', result); // Debug log
      
      if (result && result.correctedText) {
        const newNodes = textToSlate(result.correctedText);
        console.log('Setting corrected text:', result.correctedText); // Debug log
        setValue(newNodes);
        setEditorKey(prev => prev + 1); // Force editor re-render
      } else {
        setCorrectionError('No corrected text received from the server.');
      }
    } catch (err) {
      console.error('Grammar correction error:', err); // Debug log
      setCorrectionError(err.message || 'Failed to correct grammar. Please try again.');
    } finally {
      setIsCorrecting(false);
    }
  };

  const renderLeaf = ({ attributes, children }) => {
    return <span {...attributes}>{children}</span>;
  };

  return (
    <div className="poppins-font w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl px-12 py-6 relative border border-gray-100">
      <button
        className="absolute top-6 right-6 p-2.5 rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
        onClick={onClose}
        aria-label="Close"
        type="button"
      >
        <X size={22} />
      </button>
      
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Write a New Essay</h2>
        <p className="text-gray-500 text-sm">Create and submit your essay. Use the grammar corrector to improve your writing.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Essay Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 text-gray-900 font-medium text-lg placeholder:text-gray-400"
            placeholder="Enter your essay title here..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            autoFocus
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-gray-700">
              Essay Content <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGrammarCheck}
                disabled={isCorrecting || submitting}
                className="flex items-center gap-2 bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-full text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCorrecting ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} />}
                {isCorrecting ? 'Correcting...' : 'Correct Grammar'}
              </button>
            </div>
          </div>
          
          <div className="w-full h-[240px] border-2 border-gray-200 rounded-xl px-6 py-5 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 text-gray-900 font-normal text-base resize-none overflow-y-auto custom-scrollbar">
            <Slate 
              key={editorKey}
              editor={editor} 
              initialValue={value}
              onChange={setValue}
            >
              <Editable
                renderLeaf={renderLeaf}
                placeholder="Start writing your essay here..."
                className="w-full outline-none tracking-wide"
                style={{
                  wordSpacing: '0.15em',
                  lineHeight: '1.8'
                }}
              />
            </Slate>
          </div>
          
          {correctionError && <p className="text-red-500 text-xs mt-2">{correctionError}</p>}
        </div>
        
        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        
        <div className="flex gap-4 justify-center pt-4 border-t border-gray-100">
          <button
            type="button"
            className="px-8 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold transition-all duration-200 text-base"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-10 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:hover:bg-blue-600 text-base"
            disabled={submitting || isCorrecting}
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : null}
            {submitting ? 'Submitting Essay...' : 'Submit Essay'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WriteEssayForm;