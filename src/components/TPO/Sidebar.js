// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  UserCheck,
  FileText,
  ClipboardList,
  Users,
  Megaphone,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'PC Approvals', path: '/pc-approvals', icon: <UserCheck className="w-5 h-5" /> },
    { name: 'Notice Approvals', path: '/notice-approvals', icon: <FileText className="w-5 h-5" /> },
    { name: 'Academic Requests', path: '/academic-requests', icon: <ClipboardList className="w-5 h-5" /> },
    { name: 'Student Overview', path: '/student-overview', icon: <Users className="w-5 h-5" /> },
    { name: 'Announcements', path: '/announcements', icon: <Megaphone className="w-5 h-5" /> },
  ];

  return (
    <div
      className={`bg-white dark:bg-gray-900 border-r dark:border-gray-800 p-4 fixed inset-y-0 left-0 z-50 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out w-64 md:translate-x-0 md:static md:inset-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">TPO Panel</h2>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-gray-600 dark:text-gray-300"
        >
          <X />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
