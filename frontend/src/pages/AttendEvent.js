import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const AttendEvent = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await API.get(`/events/${id}`);
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const markAttendance = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post(`/events/${id}/scan-attendance`);
      setMessage('✓ Attendance marked successfully!');
      setLoading(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error marking attendance');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
          {event && (
            <>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">✓</div>
                <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
                <p className="text-gray-600">
                  📅 {new Date(event.eventDate).toLocaleDateString()}<br/>
                  📍 {event.venue}, {event.location}
                </p>
              </div>

              {message ? (
                <div className={`p-4 rounded-lg text-center mb-6 ${
                  message.includes('success') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <p className="font-semibold">{message}</p>
                </div>
              ) : (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    Click the button below to mark your attendance for this event.
                  </p>
                </div>
              )}

              <button
                onClick={markAttendance}
                disabled={loading || message.includes('success')}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-lg hover:from-green-600 hover:to-teal-600 font-bold text-lg disabled:bg-gray-400"
              >
                {loading ? 'Marking Attendance...' : message.includes('success') ? 'Attendance Marked ✓' : 'Mark My Attendance'}
              </button>

              {message.includes('success') && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
                >
                  Go to Dashboard
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendEvent;