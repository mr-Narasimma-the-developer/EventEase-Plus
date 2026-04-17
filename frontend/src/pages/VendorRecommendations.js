import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const VendorRecommendations = () => {
  const [formData, setFormData] = useState({
    eventType: 'music',
    budget: '',
    location: '',
    peopleCount: ''
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getRecommendations = async () => {
    if (!formData.budget || !formData.peopleCount) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Get vendors by trust score
      const { data: vendors } = await API.get('/vendors/search');

      // Calculate per-person budget
      const perPersonBudget = parseInt(formData.budget) / parseInt(formData.peopleCount);

      // Get services
      const { data: services } = await API.get('/services');

      // AI-like scoring algorithm
      const scoredVendors = vendors.map(vendor => {
        // Find vendor's services
        const vendorServices = services.filter(s => s.providerId._id === vendor.userId._id);

        // Calculate match score
        let score = 0;

        // Trust score weight (40%)
        score += (vendor.trustScore / 100) * 40;

        // Budget match weight (30%)
        const avgPrice = vendorServices.length > 0 
          ? vendorServices.reduce((sum, s) => sum + s.price, 0) / vendorServices.length 
          : 0;
        
        if (avgPrice > 0 && avgPrice <= perPersonBudget) {
          score += 30;
        } else if (avgPrice > 0) {
          const budgetDiff = Math.abs(avgPrice - perPersonBudget) / perPersonBudget;
          score += Math.max(0, 30 - (budgetDiff * 30));
        }

        // Location match weight (20%)
        if (formData.location && vendor.userId?.location?.toLowerCase().includes(formData.location.toLowerCase())) {
          score += 20;
        }

        // Experience weight (10%)
        score += Math.min((vendor.completedEvents / 50) * 10, 10);

        return {
          ...vendor,
          matchScore: Math.round(score),
          services: vendorServices,
          avgPrice
        };
      });

      // Sort by match score
      const topRecommendations = scoredVendors
        .filter(v => v.matchScore > 50)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10);

      setRecommendations({
        total: topRecommendations.length,
        vendors: topRecommendations,
        budget: formData.budget,
        perPerson: perPersonBudget
      });

      setLoading(false);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">🎯 AI Vendor Recommendations</h1>

          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Tell us about your event</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Event Type *</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="music">Music Concert</option>
                  <option value="workshop">Workshop</option>
                  <option value="conference">Conference</option>
                  <option value="sports">Sports Event</option>
                  <option value="social">Social Gathering</option>
                  <option value="festival">Festival</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Total Budget (₹) *</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g., 100000"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Number of People *</label>
                <input
                  type="number"
                  name="peopleCount"
                  value={formData.peopleCount}
                  onChange={handleChange}
                  placeholder="e.g., 100"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Mumbai"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={getRecommendations}
              disabled={loading}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold text-lg disabled:bg-gray-400"
            >
              {loading ? 'Finding Best Vendors...' : '🤖 Get AI Recommendations'}
            </button>
          </div>

          {/* Recommendations Results */}
          {recommendations && (
            <>
              <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg p-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">
                    Found {recommendations.total} Matching Vendors
                  </div>
                  <div className="text-lg">
                    Budget: ₹{parseInt(recommendations.budget).toLocaleString()} 
                    (₹{Math.round(recommendations.perPerson)} per person)
                  </div>
                </div>
              </div>

              {recommendations.vendors.length === 0 ? (
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                  <p className="text-xl text-gray-600">No vendors match your criteria. Try adjusting your budget or location.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recommendations.vendors.map((vendor, index) => (
                    <div key={vendor._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                              #{index + 1}
                            </div>
                            <div>
                              <Link 
                                to={`/vendor-profile/${vendor.userId._id}`}
                                className="text-2xl font-bold hover:text-indigo-600"
                              >
                                {vendor.userId?.name}
                              </Link>
                              {vendor.isVerified && (
                                <span className="ml-2 text-green-600">✓ Verified</span>
                              )}
                              <div className="text-gray-600">{vendor.userId?.location}</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-3xl font-bold text-green-600">{vendor.matchScore}%</div>
                            <div className="text-sm text-gray-600">AI Match Score</div>
                          </div>
                        </div>

                        {/* Match Score Bar */}
                        <div className="mb-6">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full"
                              style={{ width: `${vendor.matchScore}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Vendor Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-indigo-600">{vendor.trustScore}</div>
                            <div className="text-sm text-gray-600">Trust Score</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600">{vendor.completedEvents}</div>
                            <div className="text-sm text-gray-600">Events Done</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">
                              ₹{vendor.avgPrice > 0 ? Math.round(vendor.avgPrice) : 'N/A'}
                            </div>
                            <div className="text-sm text-gray-600">Avg Price/Person</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-yellow-600">{vendor.services.length}</div>
                            <div className="text-sm text-gray-600">Services</div>
                          </div>
                        </div>

                        {/* Why Recommended */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                          <div className="font-semibold text-blue-800 mb-2">Why AI Recommends This Vendor:</div>
                          <ul className="text-sm text-blue-700 space-y-1">
                            {vendor.trustScore >= 70 && <li>✓ High trust score ({vendor.trustScore}/100)</li>}
                            {vendor.isVerified && <li>✓ Admin verified vendor</li>}
                            {vendor.avgPrice > 0 && vendor.avgPrice <= recommendations.perPerson && (
                              <li>✓ Within your budget (₹{Math.round(vendor.avgPrice)}/person)</li>
                            )}
                            {formData.location && vendor.userId?.location?.toLowerCase().includes(formData.location.toLowerCase()) && (
                              <li>✓ Located in {formData.location}</li>
                            )}
                            {vendor.completedEvents > 10 && <li>✓ Experienced ({vendor.completedEvents} events completed)</li>}
                          </ul>
                        </div>

                        {/* Services Preview */}
                        {vendor.services.length > 0 && (
                          <div className="mb-4">
                            <div className="font-semibold mb-2">Available Services:</div>
                            <div className="flex flex-wrap gap-2">
                              {vendor.services.slice(0, 3).map((service) => (
                                <span key={service._id} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                                  {service.serviceName} - ₹{service.price}
                                </span>
                              ))}
                              {vendor.services.length > 3 && (
                                <span className="text-gray-600 text-sm">+{vendor.services.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}

                        <Link
                          to={`/vendor-profile/${vendor.userId._id}`}
                          className="block text-center bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
                        >
                          View Full Profile & Contact
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorRecommendations;
