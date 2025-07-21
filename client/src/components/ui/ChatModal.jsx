import { X, MessageSquare, Send } from 'lucide-react';
import gradelyLogo from '../../assets/gradely-images/gradely-logo.png';
import { useChatModal } from '../../context/ChatModalContext';

export default function ChatModal() {
  const {
    open, closeChat, selectedEssayId, setSelectedEssayId,
    chatMessages, setChatMessages, chatInput, setChatInput,
    isChatLoading, setIsChatLoading, reviewedEssays, chatContainerRef, essays, greetingEffect
  } = useChatModal();

  // Run greeting effect when essay is selected
  // (This is safe to call here because it only runs if needed)
  greetingEffect();

  // Handle chat submit (stubbed, you can connect to backend)
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const question = chatInput.trim();
    if (!question || !selectedEssayId || isChatLoading) return;
    const userMessage = { role: 'user', text: question };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);
    try {
      // TODO: Call your backend here
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'assistant', text: 'This is a stubbed AI response.' }]);
        setIsChatLoading(false);
      }, 1200);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', text: `Sorry, I ran into an error: ${err.message}`, isError: true }]);
      setIsChatLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-0 overflow-hidden flex flex-col poppins-font border border-gray-100">
        {/* Header with logo */}
        <div className="flex items-center gap-4 px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <img src={gradelyLogo} alt="Gradely Logo" className="w-10 h-10 rounded-xl shadow-sm" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Text Gradely</h2>
              <p className="text-sm text-gray-600">AI Essay Assistant</p>
            </div>
          </div>
          <button 
            className="ml-auto p-2.5 rounded-full hover:bg-white/80 text-gray-400 hover:text-red-500 transition-all duration-200" 
            onClick={closeChat}
          >
            <X size={22} />
          </button>
        </div>

        {/* Essay selection */}
        {!selectedEssayId ? (
          <div className="flex-1 flex flex-col items-center justify-center px-10 py-16 bg-gradient-to-b from-gray-50/50 to-white">
            <div className="bg-blue-100 p-4 rounded-2xl mb-6">
              <MessageSquare size={48} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Select an Essay to Chat About</h3>
            <p className="text-gray-500 text-center mb-8 max-w-md leading-relaxed">
              Choose a reviewed essay to ask Gradely questions about your feedback and get personalized insights.
            </p>
            <div className="w-full max-w-sm space-y-4">
              <select
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-base focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 font-medium"
                value={selectedEssayId}
                onChange={e => setSelectedEssayId(e.target.value)}
              >
                <option value="" className="text-gray-500">Select a reviewed essay...</option>
                {reviewedEssays.map(e => (
                  <option key={e.essay_id} value={e.essay_id}>{e.title}</option>
                ))}
              </select>
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105"
                onClick={() => selectedEssayId && setSelectedEssayId(selectedEssayId)}
                disabled={!selectedEssayId}
              >
                Start Chatting <span className="ml-2">💬</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[500px]">
            {/* Selected essay indicator */}
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-900">
                    Chatting about: {essays.find(e => e.essay_id === selectedEssayId)?.title || ''}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEssayId('')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Change Essay
                </button>
              </div>
            </div>
            {/* Chat area */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-gradient-to-b from-white to-gray-50/30 space-y-4">
              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-gray-100 p-3 rounded-xl mb-4">
                    <MessageSquare size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">Ask me anything about your essay feedback!</p>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-2xl px-5 py-3 max-w-sm break-words shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                      : msg.isError
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-white text-gray-800 border border-gray-100'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-5 py-3 max-w-sm bg-white text-gray-800 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                      <span className="ml-2 text-xs text-gray-500">Gradely is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Input area */}
            <div className="border-t border-gray-100 bg-white px-6 py-4">
              <form className="flex items-center gap-3" onSubmit={handleChatSubmit}>
                <div className="flex-1 relative">
                  <input
                    className="w-full border-2 border-gray-200 rounded-2xl px-5 py-3 pr-12 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 text-base bg-gray-50/50 disabled:bg-gray-200 disabled:text-gray-500 placeholder:text-gray-400"
                    placeholder="Ask about your essay feedback..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    disabled={isChatLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                    {chatInput.length}/500
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3.5 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105" 
                  disabled={isChatLoading || !chatInput.trim()}
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 