import React, { useState, useEffect, useContext } from 'react';
<<<<<<< HEAD
import { useParams, Link } from 'react-router-dom';
=======
import { useParams, useNavigate } from 'react-router-dom';
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import SocialShare from '../components/SocialShare';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
<<<<<<< HEAD
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState(null);
=======
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await API.get(`/events/${id}`);
      setEvent(data);
<<<<<<< HEAD

      // Check user's attendance status
      if (user) {
        const { data: attendees } = await API.get(`/events/${id}/attendees`);
        const userAttendance = attendees.find(a => a.participantId._id === user._id);
        if (userAttendance) {
          setUserStatus(userAttendance.attendanceStatus);
        }
      }

=======
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      setLoading(false);
    }
  };

<<<<<<< HEAD
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
=======
  const handleShowInterest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await API.post(`/events/${id}/interest`);
      setMessage('Interest registered! You will receive updates.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error registering interest');
    }
  };

  const handleConfirmAttendance = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await API.post(`/events/${id}/confirm`);
      setMessage('Attendance confirmed! See you at the event.');
      fetchEvent();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error confirming attendance');
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
    }
  };

  if (loading) {
<<<<<<< HEAD
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
=======
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!event) {
    return <div className="text-center py-20">Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {event.posterImage && (
            <img 
              src={event.posterImage} 
              alt={event.title}
              className="w-full h-96 object-cover"
            />
          )}
          
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded">
                  {event.category}
                </span>
              </div>
              <div className="text-right">
                <div className="text-gray-600">Organized by</div>
                <div className="font-semibold">{event.organizerId?.name}</div>
              </div>
            </div>

            {message && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600 mb-1">Date & Time</div>
                <div className="font-semibold">
                  {new Date(event.eventDate).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600 mb-1">Venue</div>
                <div className="font-semibold">{event.venue}</div>
                <div className="text-sm text-gray-600">{event.location}</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600 mb-1">Attendees</div>
                <div className="font-semibold">
                  {event.currentAttendees} / {event.maxAttendees || 'Unlimited'}
                </div>
                <div className="text-sm text-gray-600">
                  {event.maxAttendees && (
                    `${Math.round((event.currentAttendees / event.maxAttendees) * 100)}% filled`
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">About This Event</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>

            {user && (
              <div className="flex space-x-4">
                <button
                  onClick={handleShowInterest}
                  className="bg-indigo-100 text-indigo-700 px-6 py-3 rounded-lg hover:bg-indigo-200 font-semibold"
                >
                  ⭐ Show Interest
                </button>
                <button
                  onClick={handleConfirmAttendance}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
                >
                  ✓ Confirm Attendance
                </button>
              </div>
            )}
            <SocialShare event={event} />

            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-yellow-800">
                  Please <a href="/login" className="underline font-semibold">login</a> to register for this event.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Contact Organizer</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-semibold w-24">Name:</span>
              <span>{event.organizerId?.name}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-24">Email:</span>
              <a href={`mailto:${event.organizerId?.email}`} className="text-indigo-600 hover:underline">
                {event.organizerId?.email}
              </a>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-24">Phone:</span>
              <a href={`tel:${event.organizerId?.phone}`} className="text-indigo-600 hover:underline">
                {event.organizerId?.phone}
              </a>
            </div>
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;