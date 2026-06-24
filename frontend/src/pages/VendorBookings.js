import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const STATUS_STYLES = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800'
};

const STATUS_ICONS = {
  pending:   '⏳',
  confirmed: '✅',
  completed: '🏆',
  cancelled: '❌'
};

const VendorBookings = () => {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/vendor-bookings');
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!window.confirm(`Mark this booking as "${newStatus}"?`)) return;
    setActionLoading(bookingId + newStatus);
    try {
      await API.put(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(prev =>
        prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b)
      );
      alert(`Booking ${newStatus} successfully! The organizer has been notified.`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update booking');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    revenue:   bookings
                 .filter(b => b.status === 'completed')
                 .reduce((s, b) => s + (b.totalPrice || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-500">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">

        <h1 className="text-4xl font-bold mb-8">📋 My Bookings</h1>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total',     value: stats.total,     color: 'indigo' },
            { label: 'Pending',   value: stats.pending,   color: 'yellow' },
            { label: 'Confirmed', value: stats.confirmed, color: 'green'  },
            { label: 'Completed', value: stats.completed, color: 'blue'   },
            { label: 'Earned ₹', value: stats.revenue.toLocaleString(), color: 'purple' }
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className={`text-2xl font-bold text-${stat.color}-600`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f === 'all' ? `All (${bookings.length})` : `${f} (${bookings.filter(b => b.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-600">
              {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            </h3>
            <p className="text-gray-400 mt-2">
              {filter === 'pending'
                ? 'New booking requests will appear here'
                : 'Bookings in this status will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(booking => (
              <div key={booking._id}
                className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 ${
                  booking.status === 'pending'   ? 'border-yellow-400' :
                  booking.status === 'confirmed' ? 'border-green-400'  :
                  booking.status === 'completed' ? 'border-blue-400'   :
                  'border-red-400'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {booking.serviceId?.serviceName || 'Service'}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {booking.serviceId?.category}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                    STATUS_STYLES[booking.status]
                  }`}>
                    {STATUS_ICONS[booking.status]} {booking.status}
                  </span>
                </div>

                {/* Organizer Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">👤 Organizer Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span><strong>Name:</strong> {booking.clientId?.name || 'N/A'}</span>
                    <span><strong>Email:</strong> {booking.clientId?.email || 'N/A'}</span>
                    <span><strong>Phone:</strong> {booking.clientId?.phone || 'N/A'}</span>
                    <span>
                      <strong>Event Date:</strong>{' '}
                      {booking.bookingDate
                        ? new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <div className="text-indigo-600 font-semibold text-xs uppercase mb-1">Total Amount</div>
                    <div className="text-xl font-bold text-indigo-700">
                      ₹{booking.totalPrice?.toLocaleString() || '0'}
                    </div>
                  </div>
                  {booking.numberOfPeople && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-gray-500 text-xs uppercase mb-1">People</div>
                      <div className="font-bold">{booking.numberOfPeople}</div>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-500 text-xs uppercase mb-1">Requested On</div>
                    <div className="font-medium">
                      {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm">
                    <span className="font-semibold text-yellow-700">📝 Notes: </span>
                    <span className="text-gray-700">{booking.notes}</span>
                  </div>
                )}

                {/* Action Buttons */}
                {booking.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                      disabled={actionLoading === booking._id + 'confirmed'}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-semibold disabled:opacity-50 transition-all"
                    >
                      {actionLoading === booking._id + 'confirmed' ? 'Accepting...' : '✅ Accept Booking'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                      disabled={actionLoading === booking._id + 'cancelled'}
                      className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 font-semibold disabled:opacity-50 transition-all"
                    >
                      {actionLoading === booking._id + 'cancelled' ? 'Rejecting...' : '❌ Reject'}
                    </button>
                  </div>
                )}

                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'completed')}
                    disabled={actionLoading === booking._id + 'completed'}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold disabled:opacity-50 transition-all"
                  >
                    {actionLoading === booking._id + 'completed' ? 'Updating...' : '🏆 Mark as Completed'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorBookings;