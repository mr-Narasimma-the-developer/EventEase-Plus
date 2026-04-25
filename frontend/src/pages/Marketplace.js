import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';


const Marketplace = () => {
  const navigate = useNavigate();
  const [compareList, setCompareList] = useState([]);
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minTrustScore: ''
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

    const { data } = await API.get(`/services?${params.toString()}`);
    
    // Fetch vendor profiles with trust scores
    const servicesWithVendorData = await Promise.all(
      data.map(async (service) => {
        try {
          // Get vendor profile
          const vendorRes = await API.get(`/vendors/${service.providerId._id}`);
          return {
            ...service,
            vendorTrustScore: vendorRes.data.trustScore || 0,
            vendorVerified: vendorRes.data.profile?.isVerified || false,
            vendorCompletedEvents: vendorRes.data.profile?.completedEvents || 0
          };
        } catch (error) {
          console.error('Error fetching vendor data:', error);
          return {
            ...service,
            vendorTrustScore: 0,
            vendorVerified: false,
            vendorCompletedEvents: 0
          };
        }
      })
    );

    setServices(servicesWithVendorData);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching services:', error);
    setLoading(false);
  }
};

  const toggleCompare = (service) => {
  const vendorId = service.providerId._id;
  
  if (compareList.find(v => v._id === vendorId)) {
    setCompareList(compareList.filter(v => v._id !== vendorId));
  } else {
    if (compareList.length >= 3) {
      alert('You can compare up to 3 vendors at a time');
      return;
    }
    
    // Add vendor to compare list
    setCompareList([...compareList, {
      _id: vendorId,
      userId: service.providerId,
      trustScore: service.vendorTrustScore,
      isVerified: service.vendorVerified
    }]);
  }
};

const goToComparison = () => {
  navigate('/vendor-comparison', { state: { vendors: compareList } });
};

  const handleSearch = () => {
    fetchServices();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading marketplace...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Vendors & Services Marketplace</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 text-sm font-semibold">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
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
              <label className="block text-gray-700 mb-2 text-sm font-semibold">Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                placeholder="Enter city"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 text-sm font-semibold">Min Trust Score</label>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.minTrustScore}
                onChange={(e) => setFilters({ ...filters, minTrustScore: e.target.value })}
                placeholder="e.g., 70"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-600 text-xl">No services found</p>
            </div>
          ) : (
            services.map((service) => (
              <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                {/* Service Image Placeholder or First Portfolio Image */}
                <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <div className="text-6xl">
                    {service.category === 'catering' && '🍽️'}
                    {service.category === 'photography' && '📸'}
                    {service.category === 'decoration' && '🎨'}
                    {service.category === 'venue' && '🏛️'}
                    {service.category === 'entertainment' && '🎭'}
                    {!['catering', 'photography', 'decoration', 'venue', 'entertainment'].includes(service.category) && '⭐'}
                  </div>
                </div>

                <div className="p-6">
                  {/* Vendor Info with Verification Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <Link 
                      to={`/vendor-profile/${service.providerId._id}`}
                      className="flex items-center space-x-2 hover:text-indigo-600"
                    >
                      <div className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                        {service.providerId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold flex items-center">
                          {service.providerId?.name}
                          {service.vendorVerified && (
                            <span className="ml-2 text-green-600">✓</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Trust Score Badge */}
                  {service.vendorTrustScore !== undefined && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Trust Score</span>
                        <span className="text-lg font-bold text-green-600">
                          {service.vendorTrustScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${service.vendorTrustScore}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-2">{service.serviceName}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-indigo-600">₹{service.price}</span>
                      <span className="text-sm text-gray-600"> / person</span>
                    </div>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                      {service.category}
                    </span>
                  </div>

                  {/* Compare Checkbox */}
<div className="mb-3">
  <label className="flex items-center space-x-2 cursor-pointer">
    <input
      type="checkbox"
      checked={compareList.some(v => v._id === service.providerId._id)}
      onChange={() => toggleCompare(service)}
      className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
    />
    <span className="text-sm font-semibold text-gray-700">Add to Compare</span>
  </label>
</div>

<Link
  to={`/services/${service._id}`}
  className="block text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold"
>
  View Details
</Link>
{/* 
                  <div className="text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span>📍 {service.location}</span>
                      <span>⭐ {service.rating || 0}/5</span>
                    </div>
                  </div>

                  <Link
                    to={`/services/${service._id}`}
                    className="block text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold"
                  >
                    View Details
                  </Link> */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    {/* Floating Compare Button */}
{compareList.length > 0 && (
  <div className="fixed bottom-6 right-6 z-50">
    <button
      onClick={goToComparison}
      className="bg-purple-600 text-white px-6 py-4 rounded-full shadow-2xl hover:bg-purple-700 font-bold flex items-center space-x-2"
    >
      <span>⚖️</span>
      <span>Compare ({compareList.length})</span>
    </button>
  </div>
)}

    </div>
  );
};

export default Marketplace;