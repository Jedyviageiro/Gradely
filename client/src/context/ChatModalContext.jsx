import { useState, useMemo, useCallback } from 'react';
import api from '../services/api';
import { ChatModalContext } from './ChatContext';

export default function ChatModalProvider({ children, essays, fetchEssays }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEssay, setSelectedEssay] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get reviewed essays from essays prop
  const reviewedEssays = useMemo(() => (essays || []).filter(e => e.has_feedback), [essays]);
  const essaysList = useMemo(() => essays || [], [essays]);

  const selectEssay = useCallback((essayId) => {
    if (essayId) {
      // The essayId from the select dropdown is a string.
      // We ensure the comparison is safe by coercing the essay's ID to a string as well.
      const essay = essaysList.find(e => String(e.essay_id) === essayId);
      if (essay) {
        setSelectedEssay(essay);
        // Set the initial greeting message with the essay title
        setMessages([
          { role: 'assistant', text: `Hi! I'm Gradely. Feel free to ask me anything about the feedback for your essay, "${essay.title}".` }
        ]);
        setError(null); // Clear previous errors on new selection
      } else {
        // Handle case where essayId is invalid
        setSelectedEssay(null);
        setError("Could not find the selected essay.");
      }
    } else {
      setSelectedEssay(null);
    }
  }, [essaysList]);

  const openChat = useCallback(async (essayId = null) => {
    // Always refresh the essay list when opening the chat modal
    // to ensure the latest feedback status is reflected.
    if (fetchEssays) await fetchEssays();

    setIsOpen(true);
    setMessages([]);
    setError(null);
    selectEssay(essayId);
  }, [selectEssay, fetchEssays]);

  // Close modal
  const closeChat = useCallback(() => {
    setIsOpen(false);
    setSelectedEssay(null);
    setMessages([]);
    setIsLoading(false);
    setError(null);
  }, []);

  // Handle sending messages to API
  const handleSendMessage = useCallback(async (question) => {
    if (!question || !selectedEssay || isLoading) return;

    const userMessage = { role: 'user', text: question };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication token not found. Please log in again.");

      const data = await api.chatWithEssay(token, selectedEssay.essay_id, question);
      if (data && data.response) {
        const aiMessage = { role: 'assistant', text: data.response };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error("No response from backend.");
      }
    } catch (err) {
      const errorMessage = { role: 'assistant', text: `Sorry, I ran into an error: ${err.message}`, isError: true };
      setMessages(prev => [...prev, errorMessage]);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedEssay, isLoading]);

  // Expose context value
  const value = useMemo(() => ({
    isOpen,
    openChat,
    closeChat,
    selectedEssay,
    setSelectedEssay, // Keep for direct manipulation from modal if needed
    selectEssay,
    messages,
    isLoading,
    error,
    reviewedEssays,
    handleSendMessage,
  }), [
    isOpen, openChat, closeChat, selectedEssay, selectEssay, messages,
    isLoading, error, reviewedEssays, handleSendMessage
  ]);

  return (
    <ChatModalContext.Provider value={value}>
      {children}
    </ChatModalContext.Provider>
  );
}