import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import SocialShare from '../components/SocialShare';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    if (user) {
      fetchAttendanceStatus();
    }
  }, [id, user]);

  const fetchEventDetails = async () => {
    try {
      const { data } = await API.get(`/events/${id}`);
      setEvent(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      setLoading(false);
    }
  };

  const fetchAttendanceStatus = async () => {
    try {
      const { data } = await API.get(`/events/${id}/attendance-status`);
      if (data.hasAttendance) {
        setUserStatus(data.status);
      }
    } catch (error) {
      console.error('Error fetching attendance status:', error);
    }
  };

  const handleShowInterest = async () => {
    if (!user) {
      setMessage('Please login to show interest');
      return;
    }

    setActionLoading(true);
    setMessage('');

    try {
      console.log('Showing interest for event:', id);
      
      const { data } = await API.post(`/events/${id}/interest`);
      
      console.log('Interest response:', data);
      
      // Update UI immediately
      setUserStatus('interested');
      setEvent(prev => ({
        ...prev,
        interestedCount: (prev.interestedCount || 0) + 1,
        currentAttendees: (prev.currentAttendees || 0) + 1
      }));
      
      setMessage('Interest registered successfully! ✓');
      
      // Refresh data from server
      setTimeout(() => {
        fetchEventDetails();
        fetchAttendanceStatus();
      }, 500);
      
    } catch (error) {
      console.error('Show interest error:', error);
      setMessage(error.response?.data?.message || 'Failed to register interest');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmAttendance = async () => {
    if (!user) {
      setMessage('Please login to confirm attendance');
      return;
    }

    setActionLoading(true);
    setMessage('');

    try {
      console.log('Confirming attendance for event:', id);
      
      const { data } = await API.post(`/events/${id}/confirm-attendance`);
      
      console.log('Confirm response:', data);
      
      // Update UI immediately
      setUserStatus('confirmed');
      setEvent(prev => ({
        ...prev,
        confirmedCount: (prev.confirmedCount || 0) + 1,
        interestedCount: userStatus === 'interested' ? Math.max(0, (prev.interestedCount || 0) - 1) : prev.interestedCount,
        currentAttendees: userStatus ? prev.currentAttendees : (prev.currentAttendees || 0) + 1
      }));
      
      setMessage('Attendance confirmed successfully! ✓');
      
      // Refresh data from server
      setTimeout(() => {
        fetchEventDetails();
        fetchAttendanceStatus();
      }, 500);
      
    } catch (error) {
      console.error('Confirm attendance error:', error);
      setMessage(error.response?.data?.message || 'Failed to confirm attendance');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Event Poster */}
        {event.poster && (
          <img
            src={event.poster}
            alt={event.title}
            className="w-full h-96 object-cover"
          />
        )}

        {/* Event Content */}
        <div className="p-8">
          {/* Title and Category */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-3">{event.title}</h1>
            <div className="flex items-center space-x-3">
              <span className="px-4 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                {event.category}
              </span>
              <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                {event.privacy}
              </span>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-4 mb-6 rounded-lg ${
              message.includes('success') || message.includes('✓')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">📅 Date & Time</h3>
              <p className="text-gray-700">
                {new Date(event.eventDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-gray-600">
                {new Date(event.eventDate).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">📍 Location</h3>
              <p className="text-gray-700 font-medium">{event.venue}</p>
              <p className="text-gray-600">{event.location}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">👥 Organizer</h3>
              <p className="text-gray-700">{event.organizerId?.name}</p>
              <p className="text-gray-600 text-sm">{event.organizerId?.email}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">📊 Attendance</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  ⭐ Interested: <span className="font-semibold">{event.interestedCount || 0}</span>
                </p>
                <p className="text-sm text-gray-600">
                  ✓ Confirmed: <span className="font-semibold">{event.confirmedCount || 0}</span>
                </p>
                <p className="text-sm text-gray-600">
                  👥 Total Attendees: <span className="font-semibold">{event.currentAttendees || 0}</span>
                </p>
                {event.maxAttendees && (
                  <p className="text-sm text-gray-600">
                    🎯 Capacity: <span className="font-semibold">{event.maxAttendees}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-3">About This Event</h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Action Buttons */}
          {user && user.role === 'participant' && (
            <div className="flex flex-wrap gap-4 mb-6">
              {!userStatus && (
                <>
                  <button
                    onClick={handleShowInterest}
                    disabled={actionLoading}
                    className="px-8 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-400 font-semibold transition-all"
                  >
                    {actionLoading ? 'Processing...' : '⭐ Show Interest'}
                  </button>

                  <button
                    onClick={handleConfirmAttendance}
                    disabled={actionLoading}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold transition-all"
                  >
                    {actionLoading ? 'Processing...' : '✓ Confirm Attendance'}
                  </button>
                </>
              )}

              {userStatus === 'interested' && (
                <>
                  <button
                    disabled
                    className="px-8 py-3 bg-yellow-200 text-yellow-800 rounded-lg font-semibold cursor-not-allowed"
                  >
                    ⭐ Interest Shown
                  </button>

                  <button
                    onClick={handleConfirmAttendance}
                    disabled={actionLoading}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold transition-all"
                  >
                    {actionLoading ? 'Processing...' : '✓ Confirm Attendance'}
                  </button>
                </>
              )}

              {userStatus === 'confirmed' && (
                <button
                  disabled
                  className="px-8 py-3 bg-green-200 text-green-800 rounded-lg font-semibold cursor-not-allowed"
                >
                  ✓ Attendance Confirmed
                </button>
              )}

              {userStatus === 'attended' && (
                <button
                  disabled
                  className="px-8 py-3 bg-blue-200 text-blue-800 rounded-lg font-semibold cursor-not-allowed"
                >
                  ✓ Attended
                </button>
              )}

              <button
                onClick={() => setShowShare(true)}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-all"
              >
                📤 Share Event
              </button>
            </div>
          )}

          {!user && (
            <div className="text-center p-6 bg-gray-100 rounded-lg">
              <p className="text-gray-700 mb-4">Please login to register for this event</p>
              <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Social Share Modal */}
      {showShare && (
        <SocialShare
          event={event}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
};

export default EventDetail;