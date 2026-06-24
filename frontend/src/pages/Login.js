import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setMessage('Please enter email and password');
      setLoading(false);
      return;
    }

    try {
      console.log('🔵 Starting login...', formData.email);

      const { data } = await API.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      console.log('🟢 Login response:', {
        hasToken: !!data.token,
        hasUser: !!data.user,
        userRole: data.user?.role,
        userId: data.user?._id
      });

      // CRITICAL: Validate response
      if (!data.token) {
        console.error('🔴 No token in response');
        throw new Error('No authentication token received');
      }

      if (!data.user) {
        console.error('🔴 No user in response');
        throw new Error('No user data received');
      }

      if (!data.user.role) {
        console.error('🔴 User missing role:', data.user);
        throw new Error('User role not found');
      }

      // CRITICAL: Store auth data BEFORE context update
      console.log('🔵 Storing auth data...');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Set token in API headers immediately
      API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      // Update auth context
      console.log('🔵 Updating auth context...');
      const loginSuccess = login(data.token, data.user);

      if (!loginSuccess) {
        console.error('🔴 Context update failed');
        throw new Error('Failed to update authentication context');
      }

      console.log('🟢 Login successful! User:', {
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      });

      setMessage('Login successful! Redirecting...');

      // Redirect after short delay
      setTimeout(() => {
        console.log('🔵 Redirecting to dashboard...');
        navigate('/dashboard');
      }, 500);

    } catch (error) {
      console.error('🔴 Login error:', error);
      console.error('🔴 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setMessage(errorMessage);
      
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to your account</p>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Test Credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">Test Accounts:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p><strong>Admin:</strong> admin@eventease.com / Admin@123</p>
            <p><strong>Vendor:</strong> vendor@test.com / Test@123</p>
            <p><strong>Organizer:</strong> organizer@test.com / Test@123</p>
            <p><strong>Participant:</strong> participant@test.com / Test@123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;