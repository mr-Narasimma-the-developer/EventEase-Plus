import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../utils/api";

const VendorComparison = () => {
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (location.state?.vendors) {
      setSelectedVendors(location.state.vendors);
    }
  }, [location]);

  const searchVendors = async () => {
  if (!searchTerm) {
    alert('Please enter a search term');
    return;
  }
  
  setSearching(true);
  try {
    // Fetch ALL vendors first
    const { data: allVendors } = await API.get('/vendors/search');
    
    // Get vendor profiles with populated data
    const vendorsWithData = await Promise.all(
      allVendors.map(async (vendor) => {
        try {
          // Fetch full vendor profile
          const profileRes = await API.get(`/vendors/${vendor.userId._id}`);
          return {
            ...vendor,
            profile: profileRes.data.profile,
            trustScore: profileRes.data.trustScore
          };
        } catch (error) {
          return vendor;
        }
      })
);

// Filter by search term
const filtered = vendorsWithData.filter(v =>
  v.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  v.userId?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  v.profile?.specializations?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
);

    setVendors(filtered);
    setSearching(false);

    if (filtered.length === 0) {
      alert('No vendors found matching your search');
    }
  } catch (error) {
    console.error('Error searching vendors:', error);
    alert('Error searching vendors');
    setSearching(false);
  }
};

  const toggleVendor = (vendor) => {
  const vendorId = vendor._id || vendor.userId?._id;
  
  if (selectedVendors.find(v => (v._id || v.userId?._id) === vendorId)) {
    setSelectedVendors(selectedVendors.filter(v => (v._id || v.userId?._id) !== vendorId));
  } else {
    if (selectedVendors.length >= 3) {
      alert('You can compare up to 3 vendors at a time');
      return;
    }
    setSelectedVendors([...selectedVendors, vendor]);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">⚖️ Vendor Comparison Tool</h1>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex space-x-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vendors by name..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyPress={(e) => e.key === 'Enter' && searchVendors()}
            />
            <button
              onClick={searchVendors}
              disabled={searching}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-semibold"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {vendors.length > 0 && (
            <div className="mt-4 max-h-60 overflow-y-auto">
              <p className="text-sm text-gray-600 mb-2">Click to select vendors for comparison (max 3):</p>
              <div className="space-y-2">
                {vendors.map(vendor => (
                  <div
                    key={vendor._id}
                    onClick={() => toggleVendor(vendor)}
                    className={`p-3 border rounded cursor-pointer ${
                      selectedVendors.find(v => v._id === vendor._id)
                        ? 'bg-indigo-50 border-indigo-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold">{vendor.userId?.name}</span>
                        {vendor.isVerified && <span className="ml-2 text-green-600">✓</span>}
                      </div>
                      <span className="text-sm text-gray-600">Trust Score: {vendor.trustScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {selectedVendors.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <h2 className="text-2xl font-bold">Comparing {selectedVendors.length} Vendors</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Criteria
                    </th>
                    {selectedVendors.map(vendor => (
                      <th key={vendor._id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        {vendor.userId?.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Trust Score */}
                  <tr>
                    <td className="px-6 py-4 font-semibold">Trust Score</td>
                    {selectedVendors.map(vendor => (
                      <td key={vendor._id} className="px-6 py-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{vendor.trustScore}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${vendor.trustScore}%` }}
                          ></div>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Verification */}
                  <tr>
                    <td className="px-6 py-4 font-semibold">Verification</td>
                    {selectedVendors.map(vendor => (
                      <td key={vendor._id} className="px-6 py-4 text-center">
                        {vendor.isVerified ? (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                            Not Verified
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Completed Events */}
                  <tr>
                    <td className="px-6 py-4 font-semibold">Events Completed</td>
                    {selectedVendors.map(vendor => (
                      <td key={vendor._id} className="px-6 py-4 text-center">
                        <div className="text-xl font-bold">{vendor.completedEvents}</div>
                      </td>
                    ))}
                  </tr>

                  {/* Location */}
                  <tr>
                    <td className="px-6 py-4 font-semibold">Location</td>
                    {selectedVendors.map(vendor => (
                      <td key={vendor._id} className="px-6 py-4 text-center">
                        {vendor.userId?.location || 'N/A'}
                      </td>
                    ))}
                  </tr>

                  {/* Specializations */}
                  <tr>
                    <td className="px-6 py-4 font-semibold">Specializations</td>
                    {selectedVendors.map(vendor => (
                      <td key={vendor._id} className="px-6 py-4 text-center">
                        {vendor.specializations && vendor.specializations.length > 0 ? (
                          <div className="space-y-1">
                            {vendor.specializations.map((spec, i) => (
                              <span key={i} className="block text-sm">{spec}</span>
                            ))}
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="px-6 py-4 font-semibold">Actions</td>
                    {selectedVendors.map(vendor => (
                      <td key={vendor._id} className="px-6 py-4 text-center">
                        <Link
                          to={`/vendor-profile/${vendor.userId._id}`}
                          className="block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mb-2"
                        >
                          View Profile
                        </Link>
                        <button
                          onClick={() => toggleVendor(vendor)}
                          className="block w-full bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
                        >
                          Remove
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorComparison;