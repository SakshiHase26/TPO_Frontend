import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaTachometerAlt,
  FaUserCheck,
  FaUsersCog,
  FaUserGraduate,
  FaDesktop,
  FaCogs,
  FaUserCircle,
  FaSchool,
  FaStream
} from 'react-icons/fa';

const Sidebar = ({ themeMode, sidebarOpen, toggleSidebar }) => {
  const location = useLocation();

  // Don't show sidebar on login or register routes
  if (['/', '/register-tpo'].includes(location.pathname)) {
    return null;
  }

  const bgColor = themeMode === 'dark' ? 'bg-gray-800' : 'bg-blue-200';
  const hoverBg = themeMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200';

  const menuItems = [
    { label: 'Dashboard', icon: <FaTachometerAlt />, value: 'dashboard', path: '/dashboard' },
    { label: 'Verify TPOs', icon: <FaUserCheck />, value: 'verify', path: '/admin/verify-tpo' },
    { label: 'Manage TPOs', icon: <FaUsersCog />, value: 'manage', path: '/admin/manage' },
    { label: 'View Students', icon: <FaUserGraduate />, value: 'view', path: '/admin/student' },
    { label: 'Approved Tpos', icon: <FaUserCircle />, value: 'approvedTpos', path: '/admin/approved-tpo' },
    // { label: 'System Monitoring', icon: <FaDesktop />, value: 'monitor', path: '/monitor' },
    { label: 'Campus', icon: <FaSchool />, value: 'campus', path: '/admin/campus' },
    { label: 'Stream', icon: <FaStream />, value: 'stream', path: '/admin/stream' },
    { label: 'Control Panel', icon: <FaCogs />, value: 'control', path: '/admin/control-panel' }
  ];

  return (
    <div
      className={`${
        sidebarOpen ? 'w-full md:w-64' : 'w-16'
      } transition-all duration-300 ${bgColor} p-4 flex flex-col min-h-screen`}
    >
      <div className="flex items-center justify-between mb-6">
        {sidebarOpen && <span className="font-bold text-lg">Admin Dashboard</span>}
        <button
          onClick={toggleSidebar}
          className={`p-1 rounded ${hoverBg}`}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <FaArrowAltCircleLeft /> : <FaArrowAltCircleRight />}
        </button>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.value}>
              <Link
                to={item.path}
                className={`flex items-center w-full p-2 rounded ${sidebarOpen ? hoverBg : ''}`}
              >
                {item.icon}
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
