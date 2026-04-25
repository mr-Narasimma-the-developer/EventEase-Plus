import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    date: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.date) params.append('date', filters.date);

      const { data } = await API.get(`/events/public?${params.toString()}`);
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchEvents();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({ category: '', location: '', date: '' });
    fetchEvents();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Greeting Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            {user?.role === 'participant' && "Discover amazing events happening around you"}
            {user?.role === 'organizer' && "Ready to create your next event?"}
            {user?.role === 'vendor' && "Showcase your services to event organizers"}
            {user?.role === 'admin' && "Monitor and manage the platform"}
          </p>

          {user?.role === 'organizer' && (
            <div className="mt-4">
              <Link
                to="/create-event"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 inline-block font-semibold"
              >
                + Create New Event
              </Link>
            </div>
          )}
        </div>

        {/* Events Feed Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-semibold">Category</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Categories</option>
                    <option value="music">Music</option>
                    <option value="workshop">Workshop</option>
                    <option value="conference">Conference</option>
                    <option value="sports">Sports</option>
                    <option value="social">Social</option>
                    <option value="festival">Festival</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-semibold">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Enter city"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-semibold">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  onClick={applyFilters}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm font-semibold"
                >
                  Apply Filters
                </button>

                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm font-semibold"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Event Feed */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full bg-white border-2 border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 font-semibold flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filters
              </button>
            </div>

            {/* Mobile Filter Panel */}
            {showFilters && (
              <div className="lg:hidden bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Filters</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm font-semibold">Category</label>
                    <select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All Categories</option>
                      <option value="music">Music</option>
                      <option value="workshop">Workshop</option>
                      <option value="conference">Conference</option>
                      <option value="sports">Sports</option>
                      <option value="social">Social</option>
                      <option value="festival">Festival</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 text-sm font-semibold">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={filters.location}
                      onChange={handleFilterChange}
                      placeholder="Enter city"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 text-sm font-semibold">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={filters.date}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={applyFilters}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm font-semibold"
                    >
                      Apply
                    </button>
                    <button
                      onClick={clearFilters}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm font-semibold"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Event Cards (Feed Style) */}
            <div className="space-y-6">
              {events.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-2xl font-bold mb-2">No Events Yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to discover amazing events!</p>
                  {user?.role === 'organizer' && (
                    <Link
                      to="/create-event"
                      className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
                    >
                      Create First Event
                    </Link>
                  )}
                </div>
              ) : (
                events.map((event) => (
                  <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    {/* Event Header */}
                    <div className="p-4 border-b">
                      <div className="flex items-center space-x-3">
                        <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                          {event.organizerId?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold">{event.organizerId?.name}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(event.createdAt).toLocaleDateString()} • {event.category}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Content */}
                    <div>
                      {event.posterImage && (
                        <img 
                          src={event.posterImage} 
                          alt={event.title}
                          className="w-full h-80 object-cover"
                        />
                      )}
                      
                      <div className="p-6">
                        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                        <p className="text-gray-700 mb-4">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg mb-4">
                          <div>
                            <div className="text-gray-600 text-sm">📅 Date</div>
                            <div className="font-semibold">
                              {new Date(event.eventDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600 text-sm">📍 Location</div>
                            <div className="font-semibold">{event.venue}</div>
                            <div className="text-sm text-gray-600">{event.location}</div>
                          </div>
                          <div>
                            <div className="text-gray-600 text-sm">👥 Attendees</div>
                            <div className="font-semibold">
                              {event.currentAttendees} / {event.maxAttendees || '∞'}
                            </div>
                          </div>
                        </div>

                        <Link
                          to={`/events/${event._id}`}
                          className="block text-center bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
                        >
                          View Details & Register
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;