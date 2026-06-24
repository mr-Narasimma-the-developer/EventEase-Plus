import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // CRITICAL: Get menu items based on role
  const getMenuItems = () => {
    if (!user) return [];

    console.log('Building menu for role:', user.role);

    const menuItems = [];

    // Admin menu
    if (user.role === 'admin') {
      menuItems.push(
        { icon: '⚙️', label: 'Admin Panel', path: '/admin' },
        { icon: '🔔', label: 'Notifications', path: '/notifications' },
        { icon: '🗺️', label: 'Event Heatmap', path: '/event-heatmap' },
        { icon: '👤', label: 'Profile', path: '/profile' }
      );
    }

    // Organizer menu
    else if (user.role === 'organizer') {
      menuItems.push(
        { icon: '📅', label: 'My Events', path: '/my-events' },
        { icon: '💰', label: 'Budget Estimator', path: '/budget-estimator' },
        { icon: '🤖', label: 'AI Vendor Finder', path: '/vendor-recommendations' },
        { icon: '🗺️', label: 'Event Heatmap', path: '/event-heatmap' },
        { icon: '🔔', label: 'Notifications', path: '/notifications' },
        { icon: '👤', label: 'Profile', path: '/profile' }
      );
    }

    // Vendor menu
    else if (user.role === 'vendor') {
      menuItems.push(
        { icon: '📋', label: 'My Services', path: '/my-services' },
        { icon: '🎨', label: 'Portfolio', path: '/portfolio' },
        { icon: '✅', label: 'Get Verified', path: '/get-verified' },
        { icon: '🔔', label: 'Notifications', path: '/notifications' },
        { icon: '👤', label: 'Profile', path: '/profile' },
        { icon: '📋', label: 'My Bookings', path: '/vendor-bookings' },
      );
    }

    // Participant menu
    else if (user.role === 'participant') {
      menuItems.push(
        { icon: '🗺️', label: 'Event Heatmap', path: '/event-heatmap' },
        { icon: '🔔', label: 'Notifications', path: '/notifications' },
        { icon: '👤', label: 'Profile', path: '/profile' }
      );
    }

    console.log('Menu items generated:', menuItems.length);
    return menuItems;
  };

  const menuItems = getMenuItems();

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold hover:opacity-90 transition">
            EventEase+
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="hover:text-indigo-200 transition font-medium">
              Home
            </Link>

            <Link to="/marketplace" className="hover:text-indigo-200 transition font-medium">
              Vendors & Services
            </Link>

            {/* Create Event Button (Organizer only) */}
            {user && user.role === 'organizer' && (
              <Link
                to="/create-event"
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                + Create Event
              </Link>
            )}

            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Menu Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 hover:text-indigo-200 transition"
                >
                  <span className="font-medium">Menu</span>
                  <span className="text-xl">▼</span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-indigo-600 font-semibold mt-1">
                        Role: {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                      </p>
                    </div>

                    {/* Menu Items */}
                    {menuItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={closeDropdown}
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50 transition"
                      >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition border-t border-gray-200 mt-2"
                    >
                      <span className="mr-3 text-lg">🚪</span>
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hover:text-indigo-200 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;