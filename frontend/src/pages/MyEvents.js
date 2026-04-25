import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import AttendancePrediction from '../components/AttendancePrediction';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const { data } = await API.get('/events/my-events');
      
      // Fetch analytics for each event
      const eventsWithAnalytics = await Promise.all(
        data.map(async (event) => {
          try {
            const [attendeesRes, predictionRes] = await Promise.all([
              API.get(`/events/${event._id}/attendees`),
              API.get(`/ai/predict/${event._id}`)
            ]);

            return {
              ...event,
              attendees: attendeesRes.data,
              prediction: predictionRes.data
            };
          } catch (error) {
            return event;
          }
        })
      );

      setEvents(eventsWithAnalytics);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading your events...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Events</h1>
          <Link
            to="/create-event"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
          >
            + Create New Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold mb-2">No Events Created Yet</h3>
            <p className="text-gray-600 mb-6">Start by creating your first event!</p>
            <Link
              to="/create-event"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
            >
              Create Event
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Event Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
                      <div className="flex items-center space-x-4 text-sm">
                        <span>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
                        <span>📍 {event.venue}, {event.location}</span>
                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded">{event.category}</span>
                      </div>
                    </div>
                    <Link
                      to={`/events/${event._id}`}
                      className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 font-semibold"
                    >
                      View Event
                    </Link>
                  </div>
                </div>
                <div className="flex space-x-2">
  <Link
    to={`/events/${event._id}`}
    className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 font-semibold border-2 border-indigo-600"
  >
    View Event
  </Link>
  <Link
    to={`/edit-event/${event._id}`}
    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 font-semibold"
  >
    ✏️ Edit
  </Link>
  <Link
    to={`/events/${event._id}/qr`}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold flex items-center"
  >
    📱 QR Code
  </Link>
</div>

                {/* Analytics Dashboard */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">📊 Event Analytics</h3>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <div className="text-blue-600 text-sm font-semibold mb-1">Confirmed</div>
                      <div className="text-3xl font-bold text-blue-700">
                        {event.attendees?.filter(a => a.attendanceStatus === 'confirmed').length || 0}
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                      <div className="text-yellow-600 text-sm font-semibold mb-1">Interested</div>
                      <div className="text-3xl font-bold text-yellow-700">
                        {event.attendees?.filter(a => a.attendanceStatus === 'interested').length || 0}
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      <div className="text-green-600 text-sm font-semibold mb-1">AI Predicted</div>
                      <div className="text-3xl font-bold text-green-700">
                        {event.prediction?.predictedAttendees || 'N/A'}
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <div className="text-purple-600 text-sm font-semibold mb-1">Engagement</div>
                      <div className="text-3xl font-bold text-purple-700">
                        {event.prediction?.predictedRate || 0}%
                      </div>
                    </div>
                  </div>

                  {/* Event Analytics Dashboard */}
<div className="p-6">
  <h3 className="text-xl font-bold mb-4">📊 Event Analytics</h3>
  
  {/* Existing key metrics cards */}
  {/* ... */}

  {/* ADD ATTENDANCE PREDICTION */}
  <div className="mt-8">
    <AttendancePrediction eventId={event._id} />
  </div>
</div>

                  {/* AI Prediction Details */}
                  {event.prediction && (
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">🤖</div>
                        <div className="flex-1">
                          <div className="font-bold text-green-800 mb-2">AI Prediction Insights</div>
                          <div className="text-sm text-green-700 space-y-1">
                            <div>• Prediction Confidence: {event.prediction.confidence}%</div>
                            <div>• Expected Attendance Rate: {event.prediction.predictedRate}%</div>
                            <div>• Category Factor: {event.prediction.factors?.category}</div>
                            <div>• Recommendation: {event.prediction.recommendation}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Capacity Progress */}
                  {event.maxAttendees && (
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">Capacity</span>
                        <span className="font-semibold">
                          {event.currentAttendees} / {event.maxAttendees} 
                          ({Math.round((event.currentAttendees / event.maxAttendees) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 h-4 rounded-full"
                          style={{ width: `${Math.min((event.currentAttendees / event.maxAttendees) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Attendee List Preview */}
                  {event.attendees && event.attendees.length > 0 && (
                    <div>
                      <div className="font-semibold mb-3">Recent Registrations:</div>
                      <div className="space-y-2">
                        {event.attendees.slice(0, 3).map((attendee) => (
                          <div key={attendee._id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                            <div className="flex items-center space-x-3">
                              <div className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                {attendee.participantId?.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold">{attendee.participantId?.name}</div>
                                <div className="text-sm text-gray-600">{attendee.participantId?.email}</div>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              attendee.attendanceStatus === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {attendee.attendanceStatus}
                            </span>
                          </div>
                        ))}
                        {event.attendees.length > 3 && (
                          <div className="text-center text-gray-600">
                            +{event.attendees.length - 3} more attendees
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;