import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    date: ''
  });

  useEffect(() => {
    if (user?.role === 'vendor') {
      fetchVendorDashboard();
    } else if (user?.role === 'organizer') {
      fetchOrganizerDashboard();
    } else {
      fetchEvents();
    }
  }, [user]);

const fetchEvents = async () => {
  try {
    console.log('🔵 Fetching public events for participant...');

    const response = await API.get('/events/public');
    const data = response.data;

    console.log('🟢 Raw API data type:', typeof data);
    console.log('🟢 Is array:', Array.isArray(data));
    console.log('🟢 Data:', data);

    // Backend returns array directly - just use it
    const eventsArray = Array.isArray(data) ? data : [];

    console.log('🟢 Events count:', eventsArray.length);

    setEvents(eventsArray);
    setLoading(false);

  } catch (error) {
    console.error('🔴 Error fetching events:', error);
    setEvents([]);
    setLoading(false);
  }
};

  const fetchVendorDashboard = async () => {
    try {
      const { data } = await API.get('/services/my-services');
      setServices(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      setLoading(false);
    }
  };

  const fetchOrganizerDashboard = async () => {
    try {
      const { data } = await API.get('/events/my-events');
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching organizer data:', error);
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.date) params.append('date', filters.date);

      const { data } = await API.get(`/events/public?${params}`);
      setEvents(data);
    } catch (error) {
      console.error('Filter error:', error);
    }
  };

  const clearFilters = () => {
    setFilters({ category: '', location: '', date: '' });
    fetchEvents();
  };

  // VENDOR DASHBOARD
  if (user?.role === 'vendor') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-gray-600">Showcase your services to event organizers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/my-services" className="bg-purple-500 text-white p-6 rounded-lg hover:bg-purple-600 transition">
            <h3 className="text-xl font-bold">📋 My Services</h3>
            <p className="text-sm mt-2">Manage your service listings</p>
          </Link>

          <Link to="/portfolio" className="bg-blue-500 text-white p-6 rounded-lg hover:bg-blue-600 transition">
            <h3 className="text-xl font-bold">🎨 Portfolio</h3>
            <p className="text-sm mt-2">Showcase your work</p>
          </Link>

          <Link to="/get-verified" className="bg-green-500 text-white p-6 rounded-lg hover:bg-green-600 transition">
            <h3 className="text-xl font-bold">✓ Get Verified</h3>
            <p className="text-sm mt-2">Increase your trust score</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Your Services ({services.length})</h2>
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No services yet. Create your first service!</p>
              <Link to="/my-services" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                Create Service
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(service => (
                <div key={service._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <h3 className="font-bold text-lg">{service.serviceName}</h3>
                  <p className="text-gray-600 text-sm mb-2">{service.category}</p>
                  <p className="text-2xl font-bold text-indigo-600">₹{service.price}</p>
                  <Link to={`/services/${service._id}`} className="text-indigo-600 hover:underline text-sm">
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ORGANIZER DASHBOARD
  if (user?.role === 'organizer') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-gray-600">Manage and create amazing events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link to="/create-event" className="bg-indigo-600 text-white p-6 rounded-lg hover:bg-indigo-700 transition">
            <h3 className="text-xl font-bold">➕ Create Event</h3>
            <p className="text-sm mt-2">Start planning your event</p>
          </Link>

          <Link to="/my-events" className="bg-green-500 text-white p-6 rounded-lg hover:bg-green-600 transition">
            <h3 className="text-xl font-bold">📅 My Events</h3>
            <p className="text-sm mt-2">Manage your events</p>
          </Link>

          <Link to="/marketplace" className="bg-purple-500 text-white p-6 rounded-lg hover:bg-purple-600 transition">
            <h3 className="text-xl font-bold">🛒 Marketplace</h3>
            <p className="text-sm mt-2">Find vendors & services</p>
          </Link>

          <Link to="/budget-estimator" className="bg-orange-500 text-white p-6 rounded-lg hover:bg-orange-600 transition">
            <h3 className="text-xl font-bold">💰 Budget Tool</h3>
            <p className="text-sm mt-2">Estimate event costs</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Your Events ({events.length})</h2>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No events yet. Create your first event!</p>
              <Link to="/create-event" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                Create Event
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map(event => (
                <div key={event._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{new Date(event.eventDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">{event.location}</p>
                  <Link to={`/events/${event._id}`} className="text-indigo-600 hover:underline text-sm">
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // PARTICIPANT DASHBOARD (DEFAULT)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name || 'Guest'}! 👋</h1>
        <p className="text-gray-600">Discover and attend amazing events</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
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
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              placeholder="Enter city"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({...filters, date: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={applyFilters}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        
        {loading ? (
          <p className="text-center py-8">Loading events...</p>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="border rounded-lg overflow-hidden hover:shadow-xl transition"
              >
                {event.poster && (
                  <img src={event.poster} alt={event.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{event.description?.substring(0, 100)}...</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
                    <span>📍 {event.location}</span>
                  </div>
                  <div className="mt-3">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                      {event.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;