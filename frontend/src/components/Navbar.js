import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking anywhere on page
  React.useEffect(() => {
    const handleClick = () => setIsDropdownOpen(false);
    if (isDropdownOpen) {
      document.addEventListener('click', handleClick);
    }
    return () => document.removeEventListener('click', handleClick);
  }, [isDropdownOpen]);

  return (
    <nav className="bg-indigo-600 text-white shadow-lg relative z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold" onClick={closeDropdown}>
            EventEase+
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-indigo-200" onClick={closeDropdown}>
                  Home
                </Link>
                
                <Link to="/marketplace" className="hover:text-indigo-200" onClick={closeDropdown}>
                  Vendors & Services
                </Link>
                
                {user.role === 'organizer' && (
                  <Link 
                    to="/create-event" 
                    className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 font-semibold"
                    onClick={closeDropdown}
                  >
                    + Create Event
                  </Link>
                )}

                {/* Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="hover:text-indigo-200 flex items-center space-x-1 px-3 py-2 rounded focus:outline-none focus:bg-indigo-700"
                  >
                    <span>Menu</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Dropdown Panel */}
                  {isDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Vendor Options */}
                      {user.role === 'vendor' && (
                        <>
                          <Link
                            to="/my-services"
                            className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
                            onClick={closeDropdown}
                          >
                            <span className="mr-2">📋</span>
                            My Services
                          </Link>
                          <Link
                            to="/vendor/portfolio"
                            className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
                            onClick={closeDropdown}
                          >
                            <span className="mr-2">🎨</span>
                            Portfolio
                          </Link>
                          <div className="border-t my-1"></div>
                        </>
                      )}

                      {/* Organizer Options */}
                      {user.role === 'organizer' && (
<<<<<<< HEAD
  <>
    <Link
      to="/my-events"
      className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
      onClick={closeDropdown}
    >
      <span className="mr-2">📅</span>
      My Events
    </Link>
    <Link
      to="/budget-estimator"
      className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
      onClick={closeDropdown}
    >
      <span className="mr-2">💰</span>
      Budget Estimator
    </Link>
    <Link
      to="/vendor-recommendations"
      className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
      onClick={closeDropdown}
    >
      <span className="mr-2">🎯</span>
      AI Vendor Finder
    </Link>
    <div className="border-t my-1"></div>
  </>
)}
=======
                        <>
                          <Link
                            to="/my-events"
                            className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
                            onClick={closeDropdown}
                          >
                            <span className="mr-2">📅</span>
                            My Events
                          </Link>
                          <Link
                            to="/budget-estimator"
                            className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
                            onClick={closeDropdown}
                          >
                            <span className="mr-2">💰</span>
                            Budget Estimator
                          </Link>
                          <Link
                            to="/vendor-recommendations"
                            className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
                            onClick={closeDropdown}
                          >
                            <span className="mr-2">🎯</span>
                            Find Vendors (AI)
                          </Link>
                          <div className="border-t my-1"></div>
                        </>
                      )}

>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
                      {/* Admin Options */}
                      {user.role === 'admin' && (
                        <>
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
                            onClick={closeDropdown}
                          >
                            <span className="mr-2">⚙️</span>
                            Admin Panel
                          </Link>
                          <div className="border-t my-1"></div>
                        </>
                      )}

                      {/* Common Options */}
                      <Link
                        to="/notifications"
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
                        onClick={closeDropdown}
                      >
                        <span className="mr-2">🔔</span>
                        Notifications
                      </Link>
<<<<<<< HEAD
                      <hr className="my-2" />


<Link
  to="/event-heatmap"
  className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
  onClick={closeDropdown}
>
  <span className="mr-2">🗺️</span>
  Event Heatmap
</Link>

<Link
  to="/notifications"
  className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
  onClick={closeDropdown}
>
  <span className="mr-2">🔔</span>
  Notifications
</Link>
=======
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
                        onClick={closeDropdown}
                      >
                        <span className="mr-2">👤</span>
                        Profile
                      </Link>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-200" onClick={closeDropdown}>
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 font-semibold"
                  onClick={closeDropdown}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={toggleDropdown}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isDropdownOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {user ? (
              <>
                <Link to="/dashboard" className="block py-2 hover:text-indigo-200" onClick={closeDropdown}>
                  🏠 Home
                </Link>
                <Link to="/marketplace" className="block py-2 hover:text-indigo-200" onClick={closeDropdown}>
                  🏪 Vendors & Services
                </Link>
                
                {user.role === 'organizer' && (
                  <>
                    <Link to="/create-event" className="block py-2 hover:text-indigo-200" onClick={closeDropdown}>
                      ➕ Create Event
                    </Link>
                    <Link to="/my-events" className="block py-2 hover:text-indigo-200" onClick={closeDropdown}>
                      📅 My Events
                    </Link>
                  </>
                )}
                
                {user.role === 'vendor' && (
                  <>
                    <Link to="/my-services" className="block py-2 hover:text-indigo-200" onClick={closeDropdown}>
                      📋 My Services
                    </Link>
                    <Link to="/vendor/portfolio" className="block py-2 hover:text-indigo-200" onClick={closeDropdown}>
                      🎨 Portfolio
                    </Link>
                  </>
                )}
<<<<<<< HEAD

                {user.role === 'vendor' && (
  <>
    <Link
      to="/my-services"
      className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
      onClick={closeDropdown}
    >
      <span className="mr-2">📋</span>
      My Services
    </Link>
    <Link
      to="/vendor/portfolio"
      className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
      onClick={closeDropdown}
    >
      <span className="mr-2">🎨</span>
      Portfolio
    </Link>
    <Link
      to="/vendor/verification"
      className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
      onClick={closeDropdown}
    >
      <span className="mr-2">✓</span>
      Get Verified
    </Link>
    <div className="border-t my-1"></div>
  </>
)}
                
                {/* <Link to="/notifications" className="block py-2 hover:text-indigo-200" onClick={closeDropdown}>
                  🔔 Notifications
                </Link> */}
                <Link to="/profile" className="block py-2 hover:text-indigo-200" onClick={closeDropdown}>
                  👤 Profile
                </Link>
                
                <Link
  to="/event-heatmap"
  // className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
  onClick={closeDropdown}
>
  <span className="mr-2">🗺️</span>
  Event Heatmap
</Link>

{/* <hr className="my-2" />

<Link
  to="/notifications"
  className="flex items-center px-4 py-2 text-gray-800 hover:bg-indigo-50"
  onClick={closeDropdown}
>
  <span className="mr-2">🔔</span>
  Notifications
</Link> */}

=======
                
                <Link to="/notifications" className="block py-2 hover:text-indigo-200" onClick={closeDropdown}>
                  🔔 Notifications
                </Link>
                <Link to="/profile" className="block py-2 hover:text-indigo-200" onClick={closeDropdown}>
                  👤 Profile
                </Link>
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 hover:text-indigo-200"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-indigo-200" onClick={closeDropdown}>
                  Login
                </Link>
                <Link to="/register" className="block py-2 hover:text-indigo-200" onClick={closeDropdown}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;