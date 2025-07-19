import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import rocketSvg from '../assets/gradely-images/undraw_outer-space_qey5.svg';

const navItems = [
  { label: 'Home', icon: <i className="fa-solid fa-house text-lg"></i>, path: '/dashboard' },
  { label: 'My Essays', icon: <i className="fa-solid fa-file-lines text-lg"></i>, path: '/essays' },
  { label: 'Generate Feedback', icon: <i className="fa-solid fa-wand-magic-sparkles text-lg"></i>, path: '/generate-feedback' },
  { label: 'Feedbacks', icon: <i className="fa-solid fa-comments text-lg"></i>, path: '/feedbacks' },
  { label: 'Profile', icon: <i className="fa-solid fa-user text-lg"></i>, path: '/profile' },
];

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#f6f8fa]">
      {/* Sidebar */}
      <div className={`flex flex-col h-screen bg-white border-r border-[#e3e3ed] shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Sidebar Header */}
        <div className="flex items-center h-16 px-4">
          <button
            className="p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
          {sidebarOpen && (
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xl font-bold tracking-tight text-[#2a237e]">Gradely</span>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col pt-2 gap-2">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center group cursor-pointer px-4 py-3 hover:bg-[#f5f6fa] rounded-xl transition font-medium text-gray-700 ${!sidebarOpen ? 'justify-center px-0' : ''}`}
              onClick={() => item.path && navigate(item.path)}
            >
              <span className="text-xl mr-3 text-[#e75625] flex items-center justify-center">{item.icon}</span>
              {sidebarOpen && <span className="flex-1">{item.label}</span>}
            </div>
          ))}
        </div>
        {/* Bottom Logout */}
        <div className="mt-auto pb-4">
          <div className="mx-4 border-t border-[#e3e3ed] shadow-inner mb-2" />
          <div
            className={`flex items-center px-4 py-3 cursor-pointer hover:bg-[#f5f6fa] rounded-xl transition text-gray-700 ${!sidebarOpen ? 'justify-center px-0' : ''}`}
            onClick={logout}
          >
            <span className="text-xl mr-3 text-[#e75625] flex items-center justify-center"><i className="fa-solid fa-arrow-right-from-bracket"></i></span>
            {sidebarOpen && <span>Logout</span>}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="flex items-center justify-end px-10 py-6 bg-white border-b border-[#e3e3ed] shadow-sm">
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">{user?.first_name}</span>
          </div>
        </header>
        {/* Dashboard Content */}
        <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-[#f6f8fa]">
          {/* Welcome Card */}
          <div className="col-span-2 bg-white rounded-2xl shadow p-8 flex items-center justify-between min-h-[120px] overflow-hidden">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <i className="fa-solid fa-circle-check text-[#e75625] text-2xl"></i>
                <h2 className="text-2xl font-semibold">Welcome, <span className="text-[#2a237e]">{user?.first_name}!</span> <span className="text-xl">👋</span></h2>
              </div>
              <p className="text-gray-600">Upload your essay to get instant AI-powered feedback and suggestions for improvement.</p>
            </div>
            <img src={rocketSvg} alt="Rocket" className="w-40 h-40 object-contain" />
          </div>
          {/* Upload Essay Card */}
          <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center justify-center gap-4 min-h-[120px]">
            <i className="fa-solid fa-upload text-[#e75625] text-2xl mb-2"></i>
            <h3 className="text-lg font-semibold mb-2">Upload Essay</h3>
            <button className="bg-[#e75625] hover:bg-[#d14e1a] text-white px-6 py-2 rounded-full font-medium shadow">Upload PDF/TXT</button>
            <span className="text-xs text-gray-400">Accepted: PDF, TXT</span>
          </div>
          {/* My Essays Card */}
          <div className="col-span-2 bg-white rounded-2xl shadow p-8 flex flex-col gap-4 min-h-[180px]">
            <div className="flex items-center gap-3 mb-2">
              <i className="fa-solid fa-book-open text-[#e75625] text-xl"></i>
              <h3 className="text-lg font-semibold">My Essays</h3>
            </div>
            <div className="text-gray-500 text-sm">No essays uploaded yet.</div>
          </div>
          {/* Feedback Card */}
          <div className="bg-white rounded-2xl shadow p-8 flex flex-col gap-4 min-h-[180px]">
            <div className="flex items-center gap-3 mb-2">
              <i className="fa-solid fa-comments text-[#e75625] text-xl"></i>
              <h3 className="text-lg font-semibold">Feedback</h3>
            </div>
            <div className="text-gray-500 text-sm">AI feedback will appear here after you upload an essay.</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
