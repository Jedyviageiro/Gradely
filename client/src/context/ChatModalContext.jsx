import { createContext, useContext, useState, useMemo, useRef, useCallback } from 'react';

const ChatModalContext = createContext();

export function ChatModalProvider({ children, essays }) {
  const [open, setOpen] = useState(false);
  const [selectedEssayId, setSelectedEssayId] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Get reviewed essays from essays prop
  const reviewedEssays = useMemo(() => (essays || []).filter(e => e.has_feedback), [essays]);

  // Open modal and optionally set essay
  const openChat = useCallback((essayId = '') => {
    setOpen(true);
    setSelectedEssayId(essayId);
    setChatMessages([]);
    setChatInput('');
  }, []);

  // Close modal
  const closeChat = useCallback(() => {
    setOpen(false);
    setSelectedEssayId('');
    setChatMessages([]);
    setChatInput('');
  }, []);

  // Greeting when essay is selected
  const essaysList = essays || [];
  const greetingEffect = useCallback(() => {
    if (selectedEssayId && chatMessages.length === 0) {
      const selectedEssay = essaysList.find(e => e.essay_id === selectedEssayId);
      setChatMessages([
        { role: 'assistant', text: `Hi! I'm Gradely. Feel free to ask me anything about the feedback for your essay, "${selectedEssay?.title || ''}".` },
      ]);
    }
  }, [selectedEssayId, essaysList, chatMessages.length]);

  // Expose context value
  const value = useMemo(() => ({
    open, setOpen, openChat, closeChat,
    selectedEssayId, setSelectedEssayId,
    chatMessages, setChatMessages,
    chatInput, setChatInput,
    isChatLoading, setIsChatLoading,
    reviewedEssays, chatContainerRef,
    greetingEffect,
    essays: essaysList,
  }), [open, openChat, closeChat, selectedEssayId, chatMessages, chatInput, isChatLoading, reviewedEssays, essaysList, greetingEffect]);

  return (
    <ChatModalContext.Provider value={value}>
      {children}
    </ChatModalContext.Provider>
  );
}

export function useChatModal() {
  return useContext(ChatModalContext);
} 