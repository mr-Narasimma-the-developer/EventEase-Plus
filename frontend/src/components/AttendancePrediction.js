import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const AttendancePrediction = ({ eventId }) => {
  const [prediction, setPrediction] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrediction();
  }, [eventId]);

  const fetchPrediction = async () => {
    try {
      const [predRes, statsRes] = await Promise.all([
        API.get(`/predictions/${eventId}/predict`),
        API.get(`/predictions/${eventId}/stats`)
      ]);

      setPrediction(predRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prediction:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading prediction...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Current Stats */}
      {stats && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">📊 Current Attendance Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">{stats.interested}</div>
              <div className="text-sm text-gray-600">Interested</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{stats.attended}</div>
              <div className="text-sm text-gray-600">Attended</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{stats.conversionRate}%</div>
              <div className="text-sm text-gray-600">Conversion</div>
            </div>
          </div>
        </div>
      )}

      {/* AI Prediction */}
      {prediction && (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-3">🤖</span>
            <h3 className="text-2xl font-bold">AI Attendance Prediction</h3>
          </div>

          {prediction.predicted ? (
            <>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-2">{prediction.predicted}</div>
                <div className="text-xl">Expected Attendees</div>
                <div className="mt-2">
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    prediction.confidence === 'high' ? 'bg-green-500' :
                    prediction.confidence === 'medium' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}>
                    {prediction.confidence.toUpperCase()} CONFIDENCE
                  </span>
                </div>
              </div>

              <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <div className="font-semibold mb-2">📈 Algorithm Details:</div>
                <div className="text-sm space-y-1">
                  <div>• Type: {prediction.algorithm.type}</div>
                  <div>• Data Points: {prediction.algorithm.dataPoints} past events</div>
                  <div>• Slope: {prediction.algorithm.slope}</div>
                  <div>• Intercept: {prediction.algorithm.intercept}</div>
                </div>
              </div>

              <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <div className="font-semibold mb-2">🎯 Adjustment Factors:</div>
                <div className="text-sm space-y-1">
                  <div>• Interest Multiplier: {prediction.factors.interestMultiplier}x</div>
                  <div>• Category ({prediction.factors.categoryFactor}): {prediction.factors.categoryMultiplier}x</div>
                  <div>• Current Interest: {prediction.currentInterest} users</div>
                </div>
              </div>

              <div className="bg-yellow-100 text-yellow-900 rounded-lg p-4">
                <div className="font-semibold mb-1">💡 Recommendation:</div>
                <div className="text-sm">{prediction.recommendation}</div>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="mb-2">{prediction.message}</p>
              <p className="text-sm opacity-90">{prediction.suggestion}</p>
              <div className="mt-4">
                <div className="text-3xl font-bold">{prediction.currentInterest}</div>
                <div>Current Interest</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendancePrediction;