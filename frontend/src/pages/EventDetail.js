import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import SocialShare from '../components/SocialShare';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await API.get(`/events/${id}`);
      setEvent(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      setLoading(false);
    }
  };

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
    }
  };

  if (loading) {
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;