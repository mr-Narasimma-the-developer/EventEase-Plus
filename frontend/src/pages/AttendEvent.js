import React, { useState, useEffect, useContext } from 'react';
<<<<<<< HEAD
import { useParams, useNavigate, Link } from 'react-router-dom';
=======
import { useParams, useNavigate } from 'react-router-dom';
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const AttendEvent = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(null);
<<<<<<< HEAD
  const [alreadyAttended, setAlreadyAttended] = useState(false);
=======
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await API.get(`/events/${id}`);
      setEvent(data);
<<<<<<< HEAD

      // Check if already attended
      if (user) {
        const { data: attendees } = await API.get(`/events/${id}/attendees`);
        const userAttendance = attendees.find(a => 
          a.participantId._id === user._id && a.attendanceStatus === 'attended'
        );
        if (userAttendance) {
          setAlreadyAttended(true);
        }
      }
=======
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const markAttendance = async () => {
    if (!user) {
<<<<<<< HEAD
      alert('Please login to mark attendance');
=======
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post(`/events/${id}/scan-attendance`);
      setMessage('✓ Attendance marked successfully!');
<<<<<<< HEAD
      setAlreadyAttended(true);
=======
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
      setLoading(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error marking attendance');
      setLoading(false);
    }
  };

<<<<<<< HEAD
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

=======
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
<<<<<<< HEAD
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
            <p className="text-gray-600">
              📅 {new Date(event.eventDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}<br/>
              📍 {event.venue}, {event.location}
            </p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-center mb-6 ${
              message.includes('success') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <p className="font-semibold">{message}</p>
            </div>
          )}

          {alreadyAttended ? (
            <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 text-center mb-6">
              <div className="text-4xl mb-3">✓</div>
              <p className="text-lg font-bold text-green-800">Attendance Already Marked</p>
              <p className="text-sm text-green-700 mt-2">You're all set for this event!</p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-sm text-blue-800">
                  Click the button below to mark your attendance for this event.
                </p>
              </div>

              <button
                onClick={markAttendance}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-lg hover:from-green-600 hover:to-teal-600 font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Marking Attendance...' : '✓ Mark My Attendance'}
              </button>
            </>
          )}

          <div className="mt-6 space-y-2">
            <Link
              to={`/events/${id}`}
              className="block text-center bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
            >
              View Event Details
            </Link>
            <Link
              to="/dashboard"
              className="block text-center bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Go to Dashboard
            </Link>
          </div>
=======
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
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
        </div>
      </div>
    </div>
  );
};

export default AttendEvent;