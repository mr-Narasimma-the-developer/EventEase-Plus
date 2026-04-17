import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const FraudDetection = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 });

  useEffect(() => {
    fetchFraudAlerts();
  }, []);

  const fetchFraudAlerts = async () => {
    try {
      const { data } = await API.get('/admin/fraud-alerts');
      setAlerts(data.alerts || []);
      
      // Calculate stats
      const high = data.alerts.filter(a => a.severity === 'HIGH').length;
      const medium = data.alerts.filter(a => a.severity === 'MEDIUM').length;
      const low = data.alerts.filter(a => a.severity === 'LOW').length;
      
      setStats({
        total: data.totalAlerts,
        high,
        medium,
        low
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fraud alerts:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Analyzing fraud patterns...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">🚨 Fraud Detection Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-gray-700">{stats.total}</div>
            <div className="text-gray-600">Total Alerts</div>
          </div>
          <div className="bg-red-50 rounded-lg shadow-md p-6 text-center border-2 border-red-200">
            <div className="text-3xl font-bold text-red-600">{stats.high}</div>
            <div className="text-red-700 font-semibold">High Risk</div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow-md p-6 text-center border-2 border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600">{stats.medium}</div>
            <div className="text-yellow-700 font-semibold">Medium Risk</div>
          </div>
          <div className="bg-blue-50 rounded-lg shadow-md p-6 text-center border-2 border-blue-200">
            <div className="text-3xl font-bold text-blue-600">{stats.low}</div>
            <div className="text-blue-700 font-semibold">Low Risk</div>
          </div>
        </div>

        {/* Alerts List */}
        {alerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h3 className="text-2xl font-bold mb-2">All Clear!</h3>
            <p className="text-gray-600">No suspicious activity detected</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                  alert.severity === 'HIGH' ? 'border-red-500' :
                  alert.severity === 'MEDIUM' ? 'border-yellow-500' :
                  'border-blue-500'
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold">{alert.vendorName}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          alert.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity} RISK
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{alert.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-red-600">{alert.suspicionScore}</div>
                      <div className="text-sm text-gray-600">Suspicion Score</div>
                    </div>
                  </div>

                  {/* Vendor Stats */}
                  <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="text-center">
                      <div className="text-xl font-bold">{alert.trustScore}</div>
                      <div className="text-sm text-gray-600">Trust Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{alert.completedEvents}</div>
                      <div className="text-sm text-gray-600">Events Claimed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{alert.reviewCount}</div>
                      <div className="text-sm text-gray-600">Reviews</div>
                    </div>
                  </div>

                  {/* Fraud Indicators */}
                  <div className={`p-4 rounded-lg ${
                    alert.severity === 'HIGH' ? 'bg-red-50 border border-red-200' :
                    alert.severity === 'MEDIUM' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">⚠️</span>
                      Suspicious Activity Detected:
                    </div>
                    <ul className="space-y-1">
                      {alert.reasons.map((reason, i) => (
                        <li key={i} className="text-sm">• {reason}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex space-x-2">
                    <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold">
                      Suspend Account
                    </button>
                    <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 font-semibold">
                      Request Verification
                    </button>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 font-semibold">
                      Mark as False Positive
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

export default FraudDetection;