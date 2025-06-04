import React from 'react';

const Header = ({ themeMode, toggleTheme }) => {
  const handleLogout = async () => {
     localStorage.removeItem("loggedInUser");
  localStorage.removeItem("tpo");
  localStorage.removeItem("admin");
  localStorage.removeItem("student");
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // ✅ Important for route protection

  window.location.href = "/";
    try {
      const token = localStorage.getItem("token");

      // Optional: Call backend logout endpoint
      await fetch("http://localhost:5000/api/auth/tpo/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      // Clear user-related data from localStorage
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("tpo");
      localStorage.removeItem("admin");
      localStorage.removeItem("student");
      localStorage.removeItem("token");

      // Redirect to login/home page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <header className={themeMode === 'dark' ? 'bg-gray-800' : 'bg-blue-300 shadow'}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-white dark:text-black">
            Student Placement System
          </h1>
        </div>

        {/* Right-side Buttons: Theme Toggle + Logout */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-md ${
              themeMode === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-black'
            }`}
            aria-label={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`}
          >
            {themeMode === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
