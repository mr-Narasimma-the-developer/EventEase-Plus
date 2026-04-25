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

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await API.get(`/events/${id}`);
      setEvent(data);

      // Check user's attendance status
      if (user) {
        const { data: attendees } = await API.get(`/events/${id}/attendees`);
        const userAttendance = attendees.find(a => a.participantId._id === user._id);
        if (userAttendance) {
          setUserStatus(userAttendance.attendanceStatus);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      setLoading(false);
    }
  };

  const showInterest = async () => {
    try {
      await API.post(`/events/${id}/interest`);
      setUserStatus('interested');
      fetchEvent();
    } catch (error) {
      alert(error.response?.data?.message || 'Error showing interest');
    }
  };

  const confirmAttendance = async () => {
    try {
      await API.post(`/events/${id}/confirm-attendance`);
      setUserStatus('confirmed');
      fetchEvent();
    } catch (error) {
      alert(error.response?.data?.message || 'Error confirming attendance');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl">Event not found</p>
          <Link to="/dashboard" className="text-indigo-600 mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Event Poster */}
          {event.poster && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-xl">
              <img 
                src={event.poster} 
                alt={event.title} 
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Event Details Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
              <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
              <div className="flex items-center space-x-4 text-lg">
                <span className="flex items-center">
                  <span className="mr-2">📅</span>
                  {new Date(event.eventDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center">
                  <span className="mr-2">🕐</span>
                  {new Date(event.eventDate).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              
              {/* Location & Venue */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">📍</span>
                  <div>
                    <div className="font-semibold text-gray-700">Location</div>
                    <div className="text-gray-600">{event.location}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">🏢</span>
                  <div>
                    <div className="font-semibold text-gray-700">Venue</div>
                    <div className="text-gray-600">{event.venue}</div>
                  </div>
                </div>
              </div>

              {/* Category & Privacy */}
              <div className="mb-8 flex items-center space-x-4">
                <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full capitalize font-semibold">
                  {event.category}
                </span>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full capitalize font-semibold">
                  {event.privacy}
                </span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Organizer */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Organized By</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {event.organizerId?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold">{event.organizerId?.name}</div>
                    <div className="text-sm text-gray-600">{event.organizerId?.email}</div>
                  </div>
                </div>
              </div>

              {/* Attendance Stats */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Attendance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">
                      {event.interestedCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">Interested</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {event.confirmedCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">Confirmed</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {event.currentAttendees || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  {event.maxAttendees && (
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">
                        {event.maxAttendees}
                      </div>
                      <div className="text-sm text-gray-600">Capacity</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {user && (
                  <>
                    {userStatus === 'interested' ? (
                      <button
                        disabled
                        className="w-full bg-yellow-100 text-yellow-800 py-3 rounded-lg font-semibold cursor-not-allowed"
                      >
                        ⭐ Interest Shown
                      </button>
                    ) : userStatus === 'confirmed' ? (
                      <button
                        disabled
                        className="w-full bg-green-100 text-green-800 py-3 rounded-lg font-semibold cursor-not-allowed"
                      >
                        ✓ Attendance Confirmed
                      </button>
                    ) : userStatus === 'attended' ? (
                      <button
                        disabled
                        className="w-full bg-blue-100 text-blue-800 py-3 rounded-lg font-semibold cursor-not-allowed"
                      >
                        ✓ Attended
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={showInterest}
                          className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 font-semibold transition"
                        >
                          ⭐ Show Interest
                        </button>
                        <button
                          onClick={confirmAttendance}
                          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold transition"
                        >
                          ✓ Confirm Attendance
                        </button>
                      </>
                    )}
                  </>
                )}

                {!user && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                    <p className="text-blue-800 mb-4">Login to register for this event</p>
                    <Link
                      to="/login"
                      className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      Login
                    </Link>
                  </div>
                )}

                {/* Share Button */}
                <SocialShare event={event} />
              </div>

            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link
              to="/dashboard"
              className="inline-block bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 font-semibold"
            >
              ← Back to Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;