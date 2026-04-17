import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };
  const exportToCSV = () => {
  if (!stats) return;

  const csvData = [
    ['EventEase+ Analytics Report'],
    ['Generated:', new Date().toLocaleString()],
    [''],
    ['Metric', 'Value'],
    ['Total Users', stats.totalUsers],
    ['Total Events', stats.totalEvents],
    ['Total Services', stats.totalServices],
    ['Total Bookings', stats.totalBookings],
    ['Total Revenue', `₹${stats.totalRevenue}`],
    [''],
    ['User Distribution'],
    ['Participants', stats.usersByRole?.participant || 0],
    ['Organizers', stats.usersByRole?.organizer || 0],
    ['Vendors', stats.usersByRole?.vendor || 0],
    ['Admins', stats.usersByRole?.admin || 0]
  ];

  const csvContent = csvData.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `eventease-analytics-${Date.now()}.csv`;
  link.click();
};

const exportToPDF = () => {
  alert('PDF Export: Install jsPDF library for full implementation.\nFor now, use Print (Ctrl+P) to save as PDF.');
  window.print();
};

  const handleVerifyProvider = async (userId) => {
    try {
      await API.put(`/admin/verify-provider/${userId}`);
      fetchData();
    } catch (error) {
      console.error('Error verifying provider:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/admin/users/${userId}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

return (
  <div>
    <div className="flex space-x-4 mb-8">
     <button
        onClick={exportToCSV}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold flex items-center space-x-2"
      >
      <span>📊</span>
    <span>Export to CSV</span>
  </button>
  <button
    onClick={exportToPDF}
    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold flex items-center space-x-2"
  >
    <span>📄</span>
    <span>Export to PDF</span>
  </button>
</div>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-600 text-sm mb-2">Total Users</div>
            <div className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-600 text-sm mb-2">Total Providers</div>
            <div className="text-3xl font-bold text-green-600">{stats.totalProviders}</div>
            <div className="text-sm text-gray-500">Verified: {stats.verifiedProviders}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-600 text-sm mb-2">Total Services</div>
            <div className="text-3xl font-bold text-purple-600">{stats.totalServices}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-600 text-sm mb-2">Total Bookings</div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalBookings}</div>
            <div className="text-sm text-gray-500">Pending: {stats.pendingBookings}</div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">User Management</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'provider' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.location || '-'}</td>
                  <td className="px-6 py-4">
                    {user.role === 'provider' && (
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {user.role === 'provider' && !user.isVerified && (
                        <button
                          onClick={() => handleVerifyProvider(user._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Verify
                        </button>
                      )}
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);
};

export default Admin;