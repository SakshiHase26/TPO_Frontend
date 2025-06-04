import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TPOLogin = ({ onLogin }) => {
  const [form, setForm] = useState({ collegeEmail: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/tpo/login', form);
      
      const tpoData = {
        token: res.data.token,
        tpoId: res.data.tpoId,
        status: res.data.status,
        role: 'tpo', // Explicitly set role
        email: form.collegeEmail // Store email for reference
      };

      console.log('Login successful, tpoData:', tpoData);

      // Check approval status
      if (tpoData.status !== "approved") {
        setError("Your account is not approved by admin.");
        setIsLoading(false);
        return;
      }

      // Store in localStorage
      localStorage.setItem('tpoUser', JSON.stringify(tpoData));
      console.log('TPO data stored in localStorage');

      // Call parent callback if provided
      if (onLogin) {
        onLogin(tpoData);
      }

      // Navigate to TPO dashboard
      console.log('Navigating to TPO dashboard...');
      navigate('/tpo/dashboard', { replace: true });

    } catch (err) {
      console.error('Login error:', err);
      setIsLoading(false);
      
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data;

        if (status === 403) {
          setError("Your account is not approved by admin.");
        } else if (status === 401) {
          setError("Invalid email or password.");
        } else {
          setError(message || "Login failed.");
        }
      } else if (err.request) {
        setError("Cannot connect to server. Please try again later.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200 animate-fade-in">
        {/* Back to Home Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
            disabled={isLoading}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-6">TPO Login</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded text-sm border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">College Email</label>
            <input
              type="email"
              name="collegeEmail"
              placeholder="Enter your college email"
              value={form.collegeEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 focus:outline-none hover:text-gray-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !form.collegeEmail || !form.password}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            className="text-blue-600 font-medium hover:underline focus:outline-none focus:underline"
            onClick={() => navigate("/register")}
            disabled={isLoading}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default TPOLogin;