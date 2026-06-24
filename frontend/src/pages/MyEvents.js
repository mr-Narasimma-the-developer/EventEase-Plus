import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

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
            // Fetch attendees
            const attendeesRes = await API.get(`/events/${event._id}/attendees`);
            const attendees = attendeesRes.data || [];

            // Fetch prediction - CORRECT route
            let prediction = null;
            try {
              const predictionRes = await API.get(`/predictions/${event._id}/predict`);
              prediction = predictionRes.data;
            } catch (predErr) {
              console.log(`No prediction available for event ${event._id}`);
            }

            return {
              ...event,
              attendees,
              prediction
            };
          } catch (error) {
            console.error(`Error fetching analytics for event ${event._id}:`, error);
            return { ...event, attendees: [], prediction: null };
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

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (!window.confirm(`Delete "${eventTitle}"? This cannot be undone.`)) return;

    try {
      await API.delete(`/events/${eventId}`);
      setEvents(prev => prev.filter(e => e._id !== eventId));
      alert('Event deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting event');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-5xl mb-4">📅</div>
          <p className="text-xl text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Events</h1>
          <Link
            to="/create-event"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
          >
            + Create New Event
          </Link>
        </div>

        {/* Empty State */}
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
            {events.map((event) => {

              // Calculate stats cleanly
              const attendees = event.attendees || [];
              const confirmedCount = attendees.filter(a => a.attendanceStatus === 'confirmed').length;
              const interestedCount = attendees.filter(a => a.attendanceStatus === 'interested').length;
              const attendedCount = attendees.filter(a => a.attendanceStatus === 'attended').length;
              const totalRegistered = attendees.length;
              const maxAttendees = event.maxAttendees || 1000;
              const capacityPercent = Math.round((totalRegistered / maxAttendees) * 100);
              const conversionRate = totalRegistered > 0
                ? Math.round((confirmedCount / totalRegistered) * 100)
                : 0;

              return (
                <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden">

                  {/* Event Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                        <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
                          <span>📅 {new Date(event.eventDate).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}</span>
                          <span>📍 {event.venue}, {event.location}</span>
                          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full capitalize">
                            {event.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 px-6 py-3 bg-gray-50 border-b">
                    <Link
                      to={`/events/${event._id}`}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold text-sm"
                    >
                      👁️ View Event
                    </Link>
                    <Link
                      to={`/edit-event/${event._id}`}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 font-semibold text-sm"
                    >
                      ✏️ Edit
                    </Link>
                    <Link
                      to={`/events/${event._id}/qr`}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold text-sm"
                    >
                      📱 QR Code
                    </Link>
                    <button
                      onClick={() => handleDeleteEvent(event._id, event.title)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  {/* Analytics Section */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">📊 Event Analytics</h3>

                    {/* Key Metrics - 4 Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <div className="text-blue-600 text-xs font-semibold mb-1 uppercase">Confirmed</div>
                        <div className="text-3xl font-bold text-blue-700">{confirmedCount}</div>
                        <div className="text-xs text-blue-500 mt-1">attendees</div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                        <div className="text-yellow-600 text-xs font-semibold mb-1 uppercase">Interested</div>
                        <div className="text-3xl font-bold text-yellow-700">{interestedCount}</div>
                        <div className="text-xs text-yellow-500 mt-1">registered</div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                        <div className="text-green-600 text-xs font-semibold mb-1 uppercase">AI Predicted</div>
                        <div className="text-3xl font-bold text-green-700">
                          {event.prediction?.predictedAttendees ?? 'N/A'}
                        </div>
                        <div className="text-xs text-green-500 mt-1">expected</div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                        <div className="text-purple-600 text-xs font-semibold mb-1 uppercase">Engagement</div>
                        <div className="text-3xl font-bold text-purple-700">
                          {event.prediction?.predictedRate ?? conversionRate}%
                        </div>
                        <div className="text-xs text-purple-500 mt-1">rate</div>
                      </div>
                    </div>

                    {/* Attendance Breakdown */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-gray-700 mb-3">📋 Current Attendance Stats</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                          <div className="text-2xl font-bold text-yellow-600">{interestedCount}</div>
                          <div className="text-xs text-gray-500 mt-1">Interested</div>
                        </div>
                        <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                          <div className="text-2xl font-bold text-blue-600">{confirmedCount}</div>
                          <div className="text-xs text-gray-500 mt-1">Confirmed</div>
                        </div>
                        <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                          <div className="text-2xl font-bold text-green-600">{attendedCount}</div>
                          <div className="text-xs text-gray-500 mt-1">Attended</div>
                        </div>
                        <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                          <div className="text-2xl font-bold text-purple-600">{conversionRate}%</div>
                          <div className="text-xs text-gray-500 mt-1">Conversion</div>
                        </div>
                      </div>
                    </div>

                    {/* AI Prediction Block */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-5 mb-6">
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">🤖</div>
                        <div className="flex-1">
                          <div className="font-bold text-indigo-800 mb-2">AI Attendance Prediction</div>
                          {event.prediction ? (
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                                  <div className="text-xl font-bold text-indigo-600">
                                    {event.prediction.predictedAttendees}
                                  </div>
                                  <div className="text-xs text-gray-500">Predicted Attendees</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                                  <div className="text-xl font-bold text-green-600">
                                    {event.prediction.confidence}%
                                  </div>
                                  <div className="text-xs text-gray-500">Confidence</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                                  <div className="text-xl font-bold text-purple-600">
                                    {event.prediction.predictedRate}%
                                  </div>
                                  <div className="text-xs text-gray-500">Attendance Rate</div>
                                </div>
                              </div>
                              {event.prediction.recommendation && (
                                <div className="mt-3 bg-white rounded-lg p-3 border-l-4 border-indigo-400">
                                  <p className="text-sm text-indigo-700 font-medium">
                                    💡 {event.prediction.recommendation}
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-white rounded-lg p-4 text-center">
                              <p className="text-gray-500 text-sm mb-1">
                                Need at least 2 past events for accurate prediction
                              </p>
                              <p className="text-gray-400 text-xs">
                                Based on current interest, expect similar attendance
                              </p>
                              <div className="mt-3">
                                <span className="text-2xl font-bold text-indigo-600">
                                  {interestedCount + confirmedCount}
                                </span>
                                <p className="text-xs text-gray-500">Current Interest</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Capacity Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-gray-700">Capacity</span>
                        <span className="font-semibold text-gray-700">
                          {totalRegistered} / {maxAttendees} ({capacityPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full transition-all ${
                            capacityPercent >= 90
                              ? 'bg-red-500'
                              : capacityPercent >= 70
                              ? 'bg-yellow-500'
                              : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                          }`}
                          style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span className={
                          capacityPercent >= 90 ? 'text-red-500 font-semibold' :
                          capacityPercent >= 70 ? 'text-yellow-500 font-semibold' :
                          'text-green-500'
                        }>
                          {capacityPercent >= 90 ? '🔴 Almost Full' :
                           capacityPercent >= 70 ? '🟡 Filling Up' :
                           '🟢 Available'}
                        </span>
                        <span>{maxAttendees}</span>
                      </div>
                    </div>

                    {/* Recent Attendees */}
                    {attendees.length > 0 ? (
                      <div>
                        <div className="font-semibold mb-3 text-gray-700">
                          👥 Recent Registrations ({attendees.length} total)
                        </div>
                        <div className="space-y-2">
                          {attendees.slice(0, 5).map((attendee) => (
                            <div
                              key={attendee._id}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="bg-indigo-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm">
                                  {attendee.participantId?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div>
                                  <div className="font-semibold text-sm">
                                    {attendee.participantId?.name || 'Unknown'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {attendee.participantId?.email || ''}
                                  </div>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                attendee.attendanceStatus === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : attendee.attendanceStatus === 'attended'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {attendee.attendanceStatus}
                              </span>
                            </div>
                          ))}
                          {attendees.length > 5 && (
                            <p className="text-center text-sm text-gray-500 py-2">
                              +{attendees.length - 5} more attendees
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-lg">
                        <p className="text-gray-400 text-sm">No registrations yet</p>
                        <p className="text-gray-400 text-xs mt-1">Share your event to get attendees!</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;