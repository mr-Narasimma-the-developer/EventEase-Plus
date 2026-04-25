import React, { useState } from 'react';

const BudgetEstimator = () => {
  const [formData, setFormData] = useState({
    eventType: 'music',
    peopleCount: '',
    duration: '1',
    venue: 'indoor'
  });
  const [estimate, setEstimate] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateBudget = () => {
    const peopleCount = parseInt(formData.peopleCount);
    const duration = parseInt(formData.duration);

    if (!peopleCount || peopleCount < 1) {
      alert('Please enter valid number of people');
      return;
    }

    // Base cost per person by event type
    const baseCostPerPerson = {
      music: 500,
      workshop: 300,
      conference: 400,
      sports: 350,
      social: 450,
      festival: 600
    };

    const baseCost = baseCostPerPerson[formData.eventType] * peopleCount;

    // Venue multiplier
    const venueMultiplier = formData.venue === 'outdoor' ? 1.2 : 1.0;

    // Duration multiplier
    const durationMultiplier = duration > 1 ? 1 + (duration - 1) * 0.3 : 1;

    const totalBase = baseCost * venueMultiplier * durationMultiplier;

    // Calculate breakdown
    const breakdown = {
      venue: Math.round(totalBase * 0.30),
      catering: Math.round(totalBase * 0.35),
      entertainment: Math.round(totalBase * 0.20),
      decoration: Math.round(totalBase * 0.10),
      other: Math.round(totalBase * 0.05)
    };

    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

    setEstimate({
      total,
      breakdown,
      peopleCount,
      perPerson: Math.round(total / peopleCount),
      recommendedVendors: [
        { type: 'Catering', budget: breakdown.catering, priority: 'High' },
        { type: 'Venue', budget: breakdown.venue, priority: 'High' },
        { type: 'Entertainment', budget: breakdown.entertainment, priority: 'Medium' },
        { type: 'Decoration', budget: breakdown.decoration, priority: 'Low' }
      ]
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">💰 Smart Budget Estimator</h1>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Event Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Event Type</label>
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
                <label className="block text-gray-700 mb-2 font-semibold">Expected Attendees</label>
                <input
                  type="number"
                  name="peopleCount"
                  value={formData.peopleCount}
                  onChange={handleChange}
                  placeholder="e.g., 100"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Duration (days)</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1">1 Day</option>
                  <option value="2">2 Days</option>
                  <option value="3">3 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Venue Type</label>
                <select
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculateBudget}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold text-lg"
            >
              Calculate Budget
            </button>
          </div>

          {estimate && (
            <>
              {/* Total Estimate */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg p-8 mb-8">
                <div className="text-center">
                  <div className="text-lg mb-2">Estimated Total Budget</div>
                  <div className="text-5xl font-bold mb-2">₹{estimate.total.toLocaleString()}</div>
                  <div className="text-lg">₹{estimate.perPerson} per person</div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-bold mb-6">Budget Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(estimate.breakdown).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold capitalize">{category}</span>
                          <span className="font-bold text-indigo-600">₹{amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-indigo-600 h-3 rounded-full"
                            style={{ width: `${(amount / estimate.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Vendors */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6">Required Vendors & Priority</h3>
                <div className="space-y-4">
                  {estimate.recommendedVendors.map((vendor, index) => (
                    <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg">{vendor.type}</div>
                        <div className="text-gray-600">Budget: ₹{vendor.budget.toLocaleString()}</div>
                      </div>
                      <span className={`px-4 py-2 rounded-full font-semibold ${
                        vendor.priority === 'High' ? 'bg-red-100 text-red-800' :
                        vendor.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {vendor.priority} Priority
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetEstimator;