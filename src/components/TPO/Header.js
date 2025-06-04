import React, { useEffect, useState } from 'react';
import { Menu, Sun, Moon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Toggle dark class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tpoId');
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-4 py-3 shadow-sm sticky top-0 z-40">
      {/* Left: Sidebar toggle (for mobile) */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-gray-700 dark:text-gray-300"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">TPO Dashboard</h1>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-700 dark:text-gray-300"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
        >
          <LogOut className="inline w-4 h-4 mr-1" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
