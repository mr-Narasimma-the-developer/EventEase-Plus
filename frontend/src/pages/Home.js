import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to EventEase+</h1>
          <p className="text-xl mb-8">Multi-Role Intelligent Event Ecosystem</p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Discover events, connect with vendors, and create memorable experiences.
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="inline-block bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Role</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Participant</h3>
            <p className="text-gray-600 mb-4">
              Discover events, show interest, confirm attendance, and leave reviews
            </p>
            <Link to="/register" className="text-indigo-600 hover:underline font-semibold">
              Join as Participant →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-2">Organizer</h3>
            <p className="text-gray-600 mb-4">
              Create events, book vendors, manage attendees with AI assistance
            </p>
            <Link to="/register" className="text-indigo-600 hover:underline font-semibold">
              Join as Organizer →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Vendor</h3>
            <p className="text-gray-600 mb-4">
              Showcase portfolio, get reviewed, build trust score
            </p>
            <Link to="/register" className="text-indigo-600 hover:underline font-semibold">
              Join as Vendor →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-bold mb-2">Admin</h3>
            <p className="text-gray-600 mb-4">
              Verify vendors, moderate events, system analytics
            </p>
            <Link to="/register" className="text-indigo-600 hover:underline font-semibold">
              Join as Admin →
            </Link>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">🤖 AI Assistant</h3>
              <p className="text-gray-600">
                Get event planning guidance and vendor suggestions from our AI chatbot
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">⭐ Trust Score</h3>
              <p className="text-gray-600">
                Vendor ranking based on reviews, completed events, and verification
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">📊 Smart Predictions</h3>
              <p className="text-gray-600">
                AI-powered attendance predictions for better event planning
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">📸 Review System</h3>
              <p className="text-gray-600">
                Submit reviews with images for events and vendors
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">🔔 Notifications</h3>
              <p className="text-gray-600">
                Stay updated with event reminders and booking updates
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">📁 Vendor Portfolio</h3>
              <p className="text-gray-600">
                Vendors can showcase their work gallery and specializations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join thousands of users in our event ecosystem
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 text-lg"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;