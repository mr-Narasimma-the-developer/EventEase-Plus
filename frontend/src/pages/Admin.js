import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const Admin = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, usersRes, eventsRes, verificationsRes] = await Promise.all([
        API.get('/admin/analytics'),
        API.get('/admin/users'),
        API.get('/admin/events'),
        API.get('/admin/verifications/pending')
      ]);

      console.log('Analytics:', analyticsRes.data);
      console.log('Users:', usersRes.data);
      console.log('Events:', eventsRes.data);

      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data.users || []);
      setEvents(eventsRes.data || []);
      setPendingVerifications(verificationsRes.data.vendors || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      alert('Error loading admin panel. Make sure you are logged in as admin.');
      setLoading(false);
    }
  };

const exportToCSV = () => {
  if (!analytics) {
    alert('No analytics data available');
    return;
  }

  const csvData = [
    ['EventEase+ Analytics Report'],
    ['Generated:', new Date().toLocaleString()],
    [''],
    ['Metric', 'Value'],
    ['Total Users', analytics.totalUsers || 0],
    ['Total Events', analytics.totalEvents || 0],
    ['Total Services', analytics.totalServices || 0],
    ['Total Bookings', analytics.totalBookings || 0],
    ['Total Revenue', `Rs ${analytics.totalRevenue || 0}`],
    [''],
    ['User Distribution'],
    ['Participants', analytics.usersByRole?.participant || 0],
    ['Organizers', analytics.usersByRole?.organizer || 0],
    ['Vendors', analytics.usersByRole?.vendor || 0],
    ['Admins', analytics.usersByRole?.admin || 0]
  ];

  const csvContent = csvData.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `eventease-analytics-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  alert('CSV file downloaded successfully!');
};

const [pendingVerifications, setPendingVerifications] = useState([]);

const handleApproveVerification = async (vendorId, vendorName) => {
  const badgeType = prompt(`Select badge type for ${vendorName}:\n- standard\n- premium\n- elite`, 'standard');
  const trustScore = prompt('Enter trust score (0-100) or leave empty for auto-calculation:', '');

  if (badgeType) {
    try {
      await API.post(`/admin/verifications/${vendorId}/approve`, {
        badgeType: badgeType.toLowerCase(),
        customTrustScore: trustScore ? Number(trustScore) : null,
        notes: 'Approved by admin'
      });
      alert('Vendor verification approved!');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error approving verification');
    }
  }
};

const handleRejectVerification = async (vendorId, vendorName) => {
  const reason = prompt(`Enter rejection reason for ${vendorName}:`);

  if (reason) {
    try {
      await API.post(`/admin/verifications/${vendorId}/reject`, { reason });
      alert('Verification rejected');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error rejecting verification');
    }
  }
};

const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user: ${userName}?`)) {
      try {
        await API.delete(`/admin/users/${userId}`);
        alert('User deleted successfully');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  const handleChangeRole = async (userId, currentRole, userName) => {
    const roles = ['participant', 'organizer', 'vendor', 'admin'];
    const newRole = prompt(`Change role for ${userName}\nCurrent: ${currentRole}\nEnter new role (${roles.join(', ')}):`, currentRole);
    
    if (newRole && roles.includes(newRole.toLowerCase())) {
      try {
        await API.put(`/admin/users/${userId}/role`, { role: newRole.toLowerCase() });
        alert('User role updated successfully');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Error updating role');
      }
    } else if (newRole) {
      alert('Invalid role. Must be: participant, organizer, vendor, or admin');
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete event: ${eventTitle}?`)) {
      try {
        await API.delete(`/admin/events/${eventId}`);
        alert('Event deleted successfully');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting event');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⚙️</div>
          <p className="text-xl">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">⚙️ Admin Dashboard</h1>
          <Link
            to="/admin/fraud-detection"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold flex items-center space-x-2"
          >
            <span>🚨</span>
            <span>Fraud Detection</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-lg font-semibold ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-semibold ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
          >
            👥 Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 rounded-lg font-semibold ${activeTab === 'events' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
          >
            📅 Events ({events.length})
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && analytics && (
          <>
            {/* Export Buttons */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold flex items-center space-x-2"
              >
                <span>📊</span>
                <span>Export to CSV</span>
              </button>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl font-bold text-indigo-600">{analytics.totalUsers}</div>
                <div className="text-gray-600 mt-2">Total Users</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl font-bold text-green-600">{analytics.totalEvents}</div>
                <div className="text-gray-600 mt-2">Total Events</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl font-bold text-purple-600">{analytics.totalServices}</div>
                <div className="text-gray-600 mt-2">Total Services</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl font-bold text-yellow-600">₹{analytics.totalRevenue}</div>
                <div className="text-gray-600 mt-2">Total Revenue</div>
              </div>
            </div>

            {/* User Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">User Distribution</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{analytics.usersByRole?.participant || 0}</div>
                  <div className="text-gray-600">Participants</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{analytics.usersByRole?.organizer || 0}</div>
                  <div className="text-gray-600">Organizers</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{analytics.usersByRole?.vendor || 0}</div>
                  <div className="text-gray-600">Vendors</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{analytics.usersByRole?.admin || 0}</div>
                  <div className="text-gray-600">Admins</div>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            {analytics.recentUsers && analytics.recentUsers.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Recent Users</h2>
                <div className="space-y-3">
                  {analytics.recentUsers.map(user => (
                    <div key={user._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm capitalize">
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <h2 className="text-2xl font-bold">User Management</h2>
            </div>

            {users.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600 text-xl">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'organizer' ? 'bg-green-100 text-green-800' :
                            user.role === 'vendor' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.location || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleChangeRole(user._id, user.role, user.name)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs font-semibold"
                            >
                              Change Role
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id, user.name)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-green-600 to-teal-600 text-white">
              <h2 className="text-2xl font-bold">Event Management</h2>
            </div>

            {events.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600 text-xl">No events found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {events.map(event => (
                  <div key={event._id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-2">{event.description}</p>
                        <div className="flex space-x-4 text-sm text-gray-600">
                          <span>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
                          <span>📍 {event.location}</span>
                          <span>👥 {event.currentAttendees || 0} attendees</span>
                          <span className="capitalize">🏷️ {event.category}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          Organized by: {event.organizerId?.name} ({event.organizerId?.email})
                        </div>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handleDeleteEvent(event._id, event.title)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-semibold"
                        >
                          Delete Event
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'verifications' && (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <h2 className="text-2xl font-bold">Vendor Verification Requests</h2>
    </div>

    {pendingVerifications.length === 0 ? (
      <div className="p-12 text-center">
        <p className="text-gray-600 text-xl">No pending verifications</p>
      </div>
    ) : (
      <div className="divide-y divide-gray-200">
        {pendingVerifications.map(vendor => (
          <div key={vendor._id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{vendor.userId.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>📧 {vendor.userId.email}</div>
                  <div>📞 {vendor.userId.phone}</div>
                  <div>📍 {vendor.userId.location}</div>
                  <div>📊 Current Trust Score: {vendor.trustScore}</div>
                  <div>🎯 Completed Events: {vendor.completedEvents}</div>
                </div>
              </div>
            </div>

            {/* Documents */}
            {vendor.verificationDocuments && vendor.verificationDocuments.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Uploaded Documents:</h4>
                <div className="space-y-2">
                  {vendor.verificationDocuments.map((doc, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                      <div>
                        <div className="font-semibold capitalize">{doc.documentType.replace('_', ' ')}</div>
                        <div className="text-sm text-gray-600">{doc.documentName}</div>
                      </div>
                      
                        <a href={doc.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
                      >
                        View Document
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => handleApproveVerification(vendor.userId._id, vendor.userId.name)}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
              >
                ✓ Approve Verification
              </button>
              <button
                onClick={() => handleRejectVerification(vendor.userId._id, vendor.userId.name)}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold"
              >
                ✗ Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
      </div>
    </div>
  );
};

export default Admin;