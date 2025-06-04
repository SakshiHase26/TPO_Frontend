import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any existing user data first
    localStorage.removeItem('user');
    localStorage.removeItem('tpoUser');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/admin/adminlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.status === 403) {
        toast.error('🚫 You are not an admin.');
        return;
      }

      const data = await res.json();
      console.log('Server response:', data);
      
      if (res.ok) {
        toast.success('✅ Login successful! Redirecting…');
        
        const adminUserData = { 
          username: formData.username, 
          role: 'admin',
          token: data.token,
          status: 'approved' // Ensure admin is always approved
        };
        
        console.log('Storing admin user data:', adminUserData);
        
        // Store token separately (for API calls)
        localStorage.setItem('token', data.token);
        
        // Store admin user data in 'adminUser' key
        localStorage.setItem('adminUser', JSON.stringify(adminUserData));
        
        // Verify storage
        console.log('Stored in localStorage:');
        console.log('- token:', localStorage.getItem('token'));
        console.log('- adminUser:', localStorage.getItem('adminUser'));
        console.log('- user:', localStorage.getItem('user'));
        console.log('- tpoUser:', localStorage.getItem('tpoUser'));
        
        // Force immediate navigation without timeout
        navigate('/admin/dashboard', { replace: true });
        
      } else {
        toast.error(`❌ ${data.message || 'Login failed.'}`);
      }
    } catch (err) {
      toast.error('🚫 Server error. Please try again later.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-600"
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-[1.02]"
          >
            Login
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register here
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Login as TPO?{' '}
            <Link to="/tpo/login" className="text-blue-600 hover:underline font-medium">
              TPO Login
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminLogin;