import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    maxPrice: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const { data } = await API.get(`/services?${params.toString()}`);
      setServices(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Browse Services</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="catering">Catering</option>
              <option value="photography">Photography</option>
              <option value="decoration">Decoration</option>
              <option value="venue">Venue</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Enter location"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Enter max price"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">No services found</p>
        ) : (
          services.map((service) => (
            <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{service.serviceName}</h3>
                  {service.providerId?.isVerified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{service.category}</p>
                <p className="text-gray-700 mb-4">{service.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-indigo-600">₹{service.price}</span>
                  <span className="text-gray-600">{service.location}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>Rating: {service.rating || 0}/5</span>
                  <span>{service.totalBookings} bookings</span>
                </div>
                <Link
                  to={`/services/${service._id}`}
                  className="block text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Services;
