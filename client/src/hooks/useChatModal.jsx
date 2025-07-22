import { useContext } from 'react';
import { ChatModalContext } from '../context/ChatContext';

export function useChatModal() {
  const context = useContext(ChatModalContext);
  if (context === undefined) {
    throw new Error('useChatModal must be used within a ChatModalProvider');
  }
  return context;
}