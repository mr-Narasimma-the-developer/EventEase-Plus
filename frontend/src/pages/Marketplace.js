import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const Marketplace = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: ''
  });
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [services, filters]);

  const fetchServices = async () => {
    try {
      console.log('Fetching services...');
      
      const { data } = await API.get('/services');
      
      console.log('Services fetched:', data);
      
      // CRITICAL FIX: Handle null/undefined data
      if (!data) {
        setServices([]);
        setFilteredServices([]);
        setLoading(false);
        return;
      }

      // CRITICAL FIX: Ensure data is array
      const servicesArray = Array.isArray(data) ? data : [];
      
      setServices(servicesArray);
      setFilteredServices(servicesArray);
      setLoading(false);
      
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again.');
      setServices([]);
      setFilteredServices([]);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...services];

    if (filters.category && filters.category !== '') {
      filtered = filtered.filter(service => 
        service.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.location && filters.location !== '') {
      filtered = filtered.filter(service =>
        service.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({ category: '', location: '' });
  };

  const toggleCompare = (serviceId) => {
    setSelectedForCompare(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        if (prev.length >= 3) {
          alert('You can compare maximum 3 services');
          return prev;
        }
        return [...prev, serviceId];
      }
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-800 p-6 rounded-lg">
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchServices}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Service Marketplace</h1>
        <p className="text-gray-600">Find the perfect vendors for your event</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="catering">Catering</option>
              <option value="photography">Photography</option>
              <option value="decoration">Decoration</option>
              <option value="venue">Venue</option>
              <option value="entertainment">Entertainment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Enter city or location"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
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

      {/* Compare Button */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link
            to="/vendor-comparison"
            state={{ selectedServices: selectedForCompare }}
            className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <span>Compare ({selectedForCompare.length})</span>
          </Link>
        </div>
      )}

      {/* Services Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Available Services ({filteredServices.length})
          </h2>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No services found</p>
            <p className="text-gray-400">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <div
                key={service._id}
                className="border rounded-lg overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="p-6">
                  {/* Service Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">{service.serviceName}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
                        {service.category}
                      </span>
                      {service.availability && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          Available
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {service.description?.substring(0, 100)}...
                    </p>
                  </div>

                  {/* Vendor Info */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Vendor:</span>{' '}
                      {service.providerId?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Location:</span> {service.location}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-indigo-600">
                      ₹{service.price?.toLocaleString() || '0'}
                    </p>
                    <p className="text-xs text-gray-500">Total package price</p>
                  </div>

                  {/* Trust Score */}
                  {service.trustScore > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Trust Score</span>
                        <span className="text-sm font-bold text-indigo-600">
                          {service.trustScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${service.trustScore}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Rating */}
                  {service.rating > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-semibold">{service.rating.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm">
                          ({service.totalBookings || 0} bookings)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/services/${service._id}`}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 text-center font-semibold"
                    >
                      View Details
                    </Link>
                    
                    <button
                      onClick={() => toggleCompare(service._id)}
                      className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                        selectedForCompare.includes(service._id)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {selectedForCompare.includes(service._id) ? '✓ Selected' : 'Compare'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;