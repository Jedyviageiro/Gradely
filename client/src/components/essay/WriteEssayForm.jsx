import { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Loader2, Wand2 } from 'lucide-react';
import { createEditor, Transforms, Editor, Range } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import './poppins.css';
import api from '../../services/api';

// Custom hook to debounce a value
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const escapeRegExp = (string) => {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const WriteEssayForm = ({ onClose, onSubmit, submitting }) => {
  const [title, setTitle] = useState('');
  // Slate editor state
  const editor = useMemo(() => withReact(createEditor()), []);
  const [content, setContent] = useState([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Convert slate content to plain text for debouncing and submission
  const plainTextContent = useMemo(() => content.map(n => n.children.map(c => c.text).join('')).join('\n'), [content]);
  const debouncedContent = useDebounce(plainTextContent, 1200); // 1.2-second delay

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !plainTextContent.trim()) {
      setError('Please provide both a title and essay content.');
      return;
    }
    setError('');
    if (onSubmit) onSubmit({ title: title.trim(), content: plainTextContent.trim() });
  };

  // Fetch suggestions when debounced content changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedContent || debouncedContent.length < 20) {
        setSuggestions([]);
        return;
      }
      setIsAnalyzing(true);
      try {
        const token = localStorage.getItem('token');
        const data = await api.getSuggestions(token, debouncedContent);
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error("Suggestion fetch failed:", err);
        setSuggestions([]); // Clear suggestions on error
      } finally {
        setIsAnalyzing(false);
      }
    };
    fetchSuggestions();
  }, [debouncedContent]);

  // Slate's decorate function to apply styles based on suggestions
  const decorate = useCallback(([node, path]) => {
    const ranges = [];
    if (node.text && suggestions.length > 0) {
      suggestions.forEach(suggestion => {
        const { original, suggestion: replacement } = suggestion;
        let start = node.text.indexOf(original);
        while (start !== -1) {
          ranges.push({
            anchor: { path, offset: start },
            focus: { path, offset: start + original.length },
            suggestion: replacement,
            original: true,
          });
          start = node.text.indexOf(original, start + 1);
        }
      });
    }
    return ranges;
  }, [suggestions]);

  const onKeyDown = useCallback(event => {
    if (event.key === 'Tab' && editor.selection && Range.isCollapsed(editor.selection)) {
      const [node, path] = Editor.node(editor, editor.selection.anchor.path);

      if (node.text) {
        for (const suggestion of suggestions) {
          const { original, suggestion: replacement } = suggestion;
          const regex = new RegExp(escapeRegExp(original), 'g');
          let match;

          while ((match = regex.exec(node.text)) !== null) {
            const start = match.index;
            const end = start + original.length;

            // Check if the cursor is at the end of the word, or one space after.
            if (editor.selection.anchor.offset >= end && editor.selection.anchor.offset <= end + 1) {
              event.preventDefault(); // Prevent default tab behavior

              // If there's a space after, include it in the replacement range
              const finalEnd = node.text[end] === ' ' ? end + 1 : end;

              const targetRange = {
                anchor: { path, offset: start },
                focus: { path, offset: finalEnd },
              };

              Transforms.insertText(editor, replacement, { at: targetRange });
              
              // Move cursor to the end of the newly inserted text
              Transforms.select(editor, { path, offset: start + replacement.length });
              return; // Exit after applying the first matched suggestion
            }
          }
        }
      }
    }
  }, [editor, suggestions]);


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
        <p className="text-gray-500 text-sm">Create and submit your essay with real-time Gradely suggestions! (It might take some time...)</p>
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
            {isAnalyzing && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                <Wand2 className="animate-pulse" size={14} />
                <span className="font-medium">AI is analyzing...</span>
              </div>
            )}
          </div>
          
          <div className="w-full h-[240px] border-2 border-gray-200 rounded-xl px-6 py-5 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 text-gray-900 font-normal text-base resize-none overflow-y-auto custom-scrollbar">
            <Slate editor={editor} initialValue={content} onChange={newValue => setContent(newValue)}>
              <Editable
                decorate={decorate}
                renderLeaf={props => <Leaf {...props} />}
                placeholder="Start writing your essay here... AI will provide suggestions as you type."
                onKeyDown={onKeyDown} // Attach the handler here
                className="w-full outline-none tracking-wide"
                style={{
                  wordSpacing: '0.15em',
                  lineHeight: '1.8'
                }}
              />
            </Slate>
          </div>
          
          {suggestions.length > 0 && (
            <div className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
              💡 {suggestions.length} suggestion{suggestions.length > 1 ? 's' : ''} found. Press <strong>Tab</strong> to accept a suggestion when your cursor is next to it.
            </div>
          )}
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
            disabled={submitting}
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : null}
            {submitting ? 'Submitting Essay...' : 'Submit Essay'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Custom Leaf component to render suggestions with better positioning
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.original) {
    return (
      <span 
        {...attributes} 
        className="relative group"
      >
        <span className="bg-red-100/80 text-red-800 line-through decoration-red-500 decoration-2 px-1 py-0.5 rounded">
          {children}
        </span>
        <span 
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 text-xs bg-green-600 text-white font-medium px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap"
        >
          💡 {leaf.suggestion}
        </span>
      </span>
    );
  }

  return <span {...attributes}>{children}</span>;
};

export default WriteEssayForm;