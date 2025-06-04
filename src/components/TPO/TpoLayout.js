// layouts/TpoLayout.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell, Users, MessageSquare, LogOut, Briefcase,
  Home, PenTool, UserCheck, FileCheck, Menu, ChevronDown
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
  { id: 'pcApprovals', label: 'PC Approvals', icon: <UserCheck size={20} />, path: '/pc-approvals' },
  { id: 'noticeApprovals', label: 'Notice Approvals', icon: <FileCheck size={20} />, path: '/notice-approvals' },
  { id: 'academicEdits', label: 'Academic Edit Requests', icon: <PenTool size={20} />, path: '/academic-requests' },
  { id: 'studentOverview', label: 'Student Overview', icon: <Users size={20} />, path: '/student-overview' },
  { id: 'announcements', label: 'Send Announcements', icon: <MessageSquare size={20} />, path: '/announcements' },
];

export default function TpoLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = navItems.find(item => location.pathname === item.path)?.id || 'dashboard';

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-800 text-white transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center w-full'}`}>
            <Briefcase className="h-8 w-8 text-indigo-300" />
            {sidebarOpen && <span className="ml-3 text-xl font-bold">TPO Portal</span>}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className={`p-1 rounded-md hover:bg-indigo-700 ${!sidebarOpen && 'hidden'}`}
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="mt-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full p-4 ${
                activeTab === item.id ? 'bg-indigo-900 border-l-4 border-white' : 'hover:bg-indigo-700'
              } ${!sidebarOpen && 'justify-center'}`}
            >
              <div className={`${activeTab === item.id ? 'text-white' : 'text-indigo-300'}`}>
                {item.icon}
              </div>
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </div>

        <div className="absolute bottom-0 w-full p-4">
          <button className={`flex items-center ${!sidebarOpen && 'justify-center w-full'} text-indigo-300 hover:text-white`}>
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              {!sidebarOpen && (
                <button onClick={() => setSidebarOpen(true)} className="p-1 mr-4 rounded-md hover:bg-gray-200">
                  <Menu size={20} />
                </button>
              )}
              <h1 className="text-xl font-semibold text-gray-800">
                {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-gray-200 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
              </button>
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">TP</div>
                  <div className="hidden md:block">
                    <h2 className="text-sm font-medium">TPO Admin</h2>
                    <p className="text-xs text-gray-500">admin@university.edu</p>
                  </div>
                  <ChevronDown size={16} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 overflow-y-auto flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-white p-4 border-t text-center text-sm text-gray-600">
          Training and Placement Office Portal © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
