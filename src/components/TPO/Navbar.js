import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tpoId');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <span className="text-xl font-semibold">TPO Dashboard</span>
      <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
