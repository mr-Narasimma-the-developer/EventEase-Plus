import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const Recommendations = () => {
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    maxPrice: '',
    peopleCount: ''
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.peopleCount) params.append('peopleCount', filters.peopleCount);

      const { data } = await API.get(`/recommendations?${params.toString()}`);
      setRecommendations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Smart Recommendations</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Find the Best Vendors for Your Event</h2>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Category</option>
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
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              placeholder="Enter location"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Max Budget</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              placeholder="Per person"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">People Count</label>
            <input
              type="number"
              value={filters.peopleCount}
              onChange={(e) => setFilters({ ...filters, peopleCount: e.target.value })}
              placeholder="Expected guests"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Get Recommendations
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-xl">Analyzing best options...</div>
        </div>
      )}

      {recommendations && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Found {recommendations.total} Services</h2>
            <div className="text-gray-600">
              Avg Market Price: ₹{recommendations.avgMarketPrice}
            </div>
          </div>

          <div className="space-y-6">
            {recommendations.recommendations.map((service, index) => (
              <div key={service._id} className="border rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{service.serviceName}</h3>
                      <p className="text-gray-600">{service.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-600">₹{service.price}</div>
                    <div className="text-sm text-gray-600">per person</div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{service.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-green-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Trust Score</div>
                    <div className="text-2xl font-bold text-green-600">{service.trustScore}</div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Rating</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {service.rating || service.providerId?.rating || 0}/5
                    </div>
                  </div>

                  <div className="bg-purple-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Location</div>
                    <div className="text-sm font-semibold text-purple-600">{service.location}</div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Bookings</div>
                    <div className="text-2xl font-bold text-yellow-600">{service.totalBookings}</div>
                  </div>
                </div>

                {service.estimatedCost && (
                  <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Estimated Total Cost:</span>
                      <span className="text-2xl font-bold text-indigo-600">₹{service.estimatedCost}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {service.providerId?.isVerified && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                        ✓ Verified Provider
                      </span>
                    )}
                    {service.locationMatch && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                        📍 Location Match
                      </span>
                    )}
                    {service.budgetMatch && (
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
                        💰 Within Budget
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/services/${service._id}`}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;