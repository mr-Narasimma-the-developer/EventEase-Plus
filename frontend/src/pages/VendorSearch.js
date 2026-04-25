import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const VendorSearch = () => {
  const [vendors, setVendors] = useState([]);
  const [filters, setFilters] = useState({
    minTrustScore: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.minTrustScore) params.append('minTrustScore', filters.minTrustScore);
      if (filters.location) params.append('location', filters.location);

      const { data } = await API.get(`/vendors/search?${params.toString()}`);
      setVendors(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVendors();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading vendors...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Find Trusted Vendors</h1>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Minimum Trust Score</label>
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

            <div>
              <label className="block text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                placeholder="Enter city"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold"
              >
                Search Vendors
              </button>
            </div>
          </form>
        </div>

        {/* Vendor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-600 text-xl">No vendors found</p>
            </div>
          ) : (
            vendors.map((vendor) => (
              <div key={vendor._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                {vendor.portfolioImages && vendor.portfolioImages.length > 0 && (
                  <img 
                    src={vendor.portfolioImages[0]} 
                    alt={vendor.userId?.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{vendor.userId?.name}</h3>
                    {vendor.isVerified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {vendor.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vendor.bio}</p>
                  )}

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Trust Score</span>
                      <span className="text-2xl font-bold text-green-600">{vendor.trustScore}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${vendor.trustScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-gray-600">Events</div>
                      <div className="font-bold">{vendor.completedEvents}</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-gray-600">Location</div>
                      <div className="font-bold">{vendor.userId?.location}</div>
                    </div>
                  </div>

                  {vendor.specializations && vendor.specializations.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {vendor.specializations.slice(0, 3).map((spec, index) => (
                          <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    to={`/vendors/${vendor.userId._id}`}
                    className="block text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorSearch;