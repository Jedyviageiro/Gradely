import { useState, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, BookOpen, Wand2, Edit2, MessageSquare, LogOut, Menu } from 'lucide-react';
import { useChatModal } from '../../hooks/useChatModal.jsx';

const navItems = [
  { label: 'My Essays', icon: <FileText size={20} />, path: '/dashboard' },
  { label: 'Generate Feedback', icon: <Wand2 size={20} />, path: '/generate-feedback' },
  { label: 'All Feedback', icon: <BookOpen size={20} />, path: '/feedbacks' },
  { label: 'Text Gradely', icon: <MessageSquare size={20} />, path: null },
];

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarActive, setSidebarActive] = useState(() => {
    const match = navItems.find(item => item.path && location.pathname.startsWith(item.path));
    return match ? match.label : 'My Essays';
  });
  const navItemRefs = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const { openChat } = useChatModal();

  // Animate indicator
  useMemo(() => {
    const activeNavIndex = navItems.findIndex(item => sidebarActive === item.label);
    const activeNavEl = navItemRefs.current[activeNavIndex];
    if (activeNavEl) {
      setIndicatorStyle({
        top: activeNavEl.offsetTop,
        height: activeNavEl.offsetHeight,
      });
    }
  }, [sidebarActive, sidebarOpen]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white/80 backdrop-blur-xl border-r border-white/20 flex flex-col transition-all duration-300 ease-in-out`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          <button
            className="p-2 rounded-lg hover:bg-black/5 transition-all duration-150 hover:scale-105 active:scale-95"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Menu size={20} className="text-gray-600" />
          </button>
        </div>
        {/* Navigation */}
        <nav className="flex-1 p-2 relative">
          <div
            className="absolute left-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full transition-all duration-300 ease-in-out"
            style={indicatorStyle}
          />
          <div className="space-y-1">
            {navItems.map((item, index) => (
              <button
                ref={el => (navItemRefs.current[index] = el)}
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ease-out group relative overflow-hidden ${
                  sidebarActive === item.label
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 shadow-sm border border-blue-200/50'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]'
                }`}
                onClick={() => {
                  setSidebarActive(item.label);
                  if (item.label === 'Text Gradely') {
                    openChat();
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
                title={!sidebarOpen ? item.label : ''}
              >
                <span className={`transition-all duration-150 ${sidebarActive === item.label ? 'text-blue-600 scale-110' : 'text-gray-500 group-hover:text-gray-700'}`}>{item.icon}</span>
                {sidebarOpen && (
                  <span className="transition-all duration-150">{item.label}</span>
                )}
              </button>
            ))}
          </div>
        </nav>
        {/* Logout */}
        <div className="p-2 border-t border-gray-200">
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 rounded-lg transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] group"
            onClick={logout}
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <LogOut size={20} className="text-gray-500 group-hover:text-red-500 transition-colors duration-150" />
            {sidebarOpen && <span className="transition-all duration-150">Logout</span>}
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
} 