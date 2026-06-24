import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const Admin = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Edit modals
  const [eventModal, setEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [serviceModal, setServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (activeTab === 'verifications') fetchVerifications();
    if (activeTab === 'services') fetchServices();
  }, [activeTab]);

  // ─── DATA FETCHING ───────────────────────────────────────────────

  const fetchData = async () => {
    try {
      const [analyticsRes, usersRes, eventsRes] = await Promise.all([
        API.get('/admin/analytics'),
        API.get('/admin/users'),
        API.get('/admin/events')
      ]);
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data.users || []);
      setEvents(eventsRes.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      alert('Error loading admin panel. Make sure you are logged in as admin.');
      setLoading(false);
    }
  };

  const fetchVerifications = async () => {
    try {
      const { data } = await API.get('/admin/verifications/pending');
      let arr = [];
      if (Array.isArray(data)) arr = data;
      else if (Array.isArray(data?.vendors)) arr = data.vendors;
      else if (Array.isArray(data?.verifications)) arr = data.verifications;
      setVerifications(arr);
    } catch (error) {
      console.error('Error fetching verifications:', error);
      setVerifications([]);
    }
  };

  const fetchServices = async () => {
    try {
      const { data } = await API.get('/services');
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    }
  };

  // ─── USER HANDLERS ───────────────────────────────────────────────

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete user: ${userName}?`)) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      alert('User deleted');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting user');
    }
  };

  const handleChangeRole = async (userId, currentRole, userName) => {
    const roles = ['participant', 'organizer', 'vendor', 'admin'];
    const newRole = prompt(
      `Change role for ${userName}\nCurrent: ${currentRole}\nEnter new role (${roles.join(', ')}):`,
      currentRole
    );
    if (!newRole) return;
    if (!roles.includes(newRole.toLowerCase())) {
      alert('Invalid role. Must be: participant, organizer, vendor, or admin');
      return;
    }
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole.toLowerCase() });
      alert('Role updated');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating role');
    }
  };

  // ─── EVENT HANDLERS ───────────────────────────────────────────────

  const openEditEvent = (event) => {
    setEditingEvent({
      _id: event._id,
      title: event.title || '',
      description: event.description || '',
      location: event.location || '',
      venue: event.venue || '',
      category: event.category || '',
      eventDate: event.eventDate
        ? new Date(event.eventDate).toISOString().slice(0, 16)
        : '',
      maxAttendees: event.maxAttendees || ''
    });
    setEventModal(true);
  };

  const handleSaveEvent = async () => {
    if (!editingEvent.title || !editingEvent.location) {
      alert('Title and location are required');
      return;
    }
    setSaving(true);
    try {
      await API.put(`/admin/events/${editingEvent._id}`, {
        title: editingEvent.title,
        description: editingEvent.description,
        location: editingEvent.location,
        venue: editingEvent.venue,
        category: editingEvent.category,
        eventDate: editingEvent.eventDate,
        maxAttendees: editingEvent.maxAttendees
          ? Number(editingEvent.maxAttendees)
          : null
      });
      alert('Event updated successfully!');
      setEventModal(false);
      setEditingEvent(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating event');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (!window.confirm(`Delete event: "${eventTitle}"?`)) return;
    try {
      await API.delete(`/admin/events/${eventId}`);
      alert('Event deleted');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting event');
    }
  };

  // ─── SERVICE HANDLERS ─────────────────────────────────────────────

  const openEditService = (service) => {
    setEditingService({
      _id: service._id,
      serviceName: service.serviceName || '',
      description: service.description || '',
      price: service.price || '',
      category: service.category || '',
      location: service.location || ''
    });
    setServiceModal(true);
  };

  const handleSaveService = async () => {
    if (!editingService.serviceName || !editingService.price) {
      alert('Service name and price are required');
      return;
    }
    setSaving(true);
    try {
      await API.put(`/admin/services/${editingService._id}`, {
        serviceName: editingService.serviceName,
        description: editingService.description,
        price: Number(editingService.price),
        category: editingService.category,
        location: editingService.location
      });
      alert('Service updated successfully!');
      setServiceModal(false);
      setEditingService(null);
      fetchServices();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating service');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (serviceId, serviceName) => {
    if (!window.confirm(`Delete service: "${serviceName}"?`)) return;
    try {
      await API.delete(`/admin/services/${serviceId}`);
      alert('Service deleted');
      fetchServices();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting service');
    }
  };

  // ─── VERIFICATION HANDLERS ────────────────────────────────────────

  const handleApproveVerification = async (vendorId) => {
    const badge = prompt('Badge type (standard/premium/elite):', 'standard');
    if (!badge) return;
    const trustScore = prompt('Trust score (0-100) or leave empty for auto:');
    try {
      await API.post(`/admin/verifications/${vendorId}/approve`, {
        badge,
        trustScore: trustScore ? Number(trustScore) : undefined
      });
      alert('Vendor verified!');
      fetchVerifications();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve');
    }
  };

  const handleRejectVerification = async (vendorId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await API.post(`/admin/verifications/${vendorId}/reject`, { reason });
      alert('Verification rejected');
      fetchVerifications();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject');
    }
  };

  // ─── CSV EXPORT ───────────────────────────────────────────────────

  const exportToCSV = () => {
    if (!analytics) { alert('No analytics data'); return; }
    const rows = [
      ['EventEase+ Analytics Report'],
      ['Generated:', new Date().toLocaleString()],
      [''],
      ['Metric', 'Value'],
      ['Total Users', analytics.totalUsers || 0],
      ['Total Events', analytics.totalEvents || 0],
      ['Total Services', analytics.totalServices || 0],
      ['Total Bookings', analytics.totalBookings || 0],
      ['Total Revenue', `₹${analytics.totalRevenue || 0}`],
      [''],
      ['User Distribution'],
      ['Participants', analytics.usersByRole?.participant || 0],
      ['Organizers', analytics.usersByRole?.organizer || 0],
      ['Vendors', analytics.usersByRole?.vendor || 0],
      ['Admins', analytics.usersByRole?.admin || 0]
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eventease-analytics-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    alert('CSV downloaded!');
  };

  // ─── TAB BUTTON HELPER ────────────────────────────────────────────

  const TabBtn = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-5 py-3 rounded-lg font-semibold whitespace-nowrap text-sm transition-all ${
        activeTab === id
          ? 'bg-indigo-600 text-white shadow'
          : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  // ─── LOADING ──────────────────────────────────────────────────────

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

  // ─── RENDER ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">⚙️ Admin Dashboard</h1>
          <Link
            to="/fraud-detection"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold flex items-center gap-2"
          >
            🚨 Fraud Detection
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabBtn id="dashboard" label="📊 Dashboard" />
          <TabBtn id="users"     label={`👥 Users (${users.length})`} />
          <TabBtn id="events"    label={`🗓️ Events (${events.length})`} />
          <TabBtn id="services"  label={`🛠️ Services (${services.length})`} />
          <TabBtn id="verifications" label={`✅ Verifications (${verifications.length})`} />
        </div>

        {/* ── DASHBOARD TAB ── */}
        {activeTab === 'dashboard' && analytics && (
          <>
            <div className="mb-6">
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
              >
                📊 Export to CSV
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Users',    value: analytics.totalUsers || 0,    color: 'indigo' },
                { label: 'Total Events',   value: analytics.totalEvents || 0,   color: 'green'  },
                { label: 'Total Services', value: analytics.totalServices || 0, color: 'purple' },
                { label: 'Total Revenue',  value: `₹${analytics.totalRevenue || 0}`, color: 'yellow' }
              ].map(card => (
                <div key={card.label} className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className={`text-4xl font-bold text-${card.color}-600`}>{card.value}</div>
                  <div className="text-gray-600 mt-2 text-sm">{card.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">User Distribution</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Participants', key: 'participant', color: 'blue'   },
                  { label: 'Organizers',   key: 'organizer',   color: 'green'  },
                  { label: 'Vendors',      key: 'vendor',      color: 'purple' },
                  { label: 'Admins',       key: 'admin',       color: 'red'    }
                ].map(r => (
                  <div key={r.key} className={`text-center p-4 bg-${r.color}-50 rounded-lg`}>
                    <div className={`text-3xl font-bold text-${r.color}-600`}>
                      {analytics.usersByRole?.[r.key] || 0}
                    </div>
                    <div className="text-gray-600 text-sm">{r.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {analytics.recentUsers?.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Recent Users</h2>
                <div className="space-y-3">
                  {analytics.recentUsers.map(u => (
                    <div key={u._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </div>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs capitalize">
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <h2 className="text-2xl font-bold">User Management</h2>
            </div>
            {users.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Name','Email','Role','Location','Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                            user.role === 'admin'     ? 'bg-red-100 text-red-800' :
                            user.role === 'organizer' ? 'bg-green-100 text-green-800' :
                            user.role === 'vendor'    ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>{user.role}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.location || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
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

        {/* ── EVENTS TAB ── */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-green-600 to-teal-600 text-white flex justify-between items-center">
              <h2 className="text-2xl font-bold">Event Management</h2>
              <span className="text-sm opacity-80">{events.length} total events</span>
            </div>

            {events.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No events found</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {events.map(event => (
                  <div key={event._id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold mb-1 truncate">{event.title}</h3>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{event.description}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span>📅 {new Date(event.eventDate).toLocaleDateString('en-IN')}</span>
                          <span>📍 {event.venue ? `${event.venue}, ` : ''}{event.location}</span>
                          <span>👥 {event.currentAttendees || 0} attendees</span>
                          <span className="capitalize bg-gray-100 px-2 py-0.5 rounded">
                            {event.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            event.privacy === 'private'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {event.privacy || 'public'}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          By: {event.organizerId?.name || 'Unknown'} ({event.organizerId?.email || ''})
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => openEditEvent(event)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold text-sm w-28"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id, event.title)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold text-sm w-28"
                        >
                          🗑️ Delete
                        </button>
                        <Link
                          to={`/events/${event._id}`}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 font-semibold text-sm text-center w-28"
                        >
                          👁️ View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SERVICES TAB ── */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white flex justify-between items-center">
              <h2 className="text-2xl font-bold">Service Management</h2>
              <span className="text-sm opacity-80">{services.length} total services</span>
            </div>

            {services.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No services found
                <button
                  onClick={fetchServices}
                  className="block mx-auto mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  🔄 Refresh
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {services.map(service => (
                  <div key={service._id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold mb-1">{service.serviceName}</h3>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{service.description}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="font-semibold text-green-700">
                            ₹{service.price?.toLocaleString()}
                          </span>
                          <span className="capitalize bg-gray-100 px-2 py-0.5 rounded">
                            {service.category}
                          </span>
                          <span>📍 {service.location}</span>
                          <span>⭐ {service.rating || 'No rating'}</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          Provider: {service.providerId?.name || 'Unknown'} ({service.providerId?.email || ''})
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => openEditService(service)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold text-sm w-28"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteService(service._id, service.serviceName)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold text-sm w-28"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── VERIFICATIONS TAB ── */}
        {activeTab === 'verifications' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white flex justify-between items-center">
              <h2 className="text-2xl font-bold">Vendor Verification Requests</h2>
              <button
                onClick={fetchVerifications}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 text-sm"
              >
                🔄 Refresh
              </button>
            </div>

            {verifications.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No pending verifications</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {verifications.map(vendor => (
                  <div key={vendor._id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{vendor.userId?.name || 'Unknown'}</h3>
                        <div className="mt-1 space-y-1 text-sm text-gray-600">
                          <div>📧 {vendor.userId?.email || 'N/A'}</div>
                          <div>📞 {vendor.userId?.phone || 'N/A'}</div>
                          <div>📍 {vendor.userId?.location || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div>Trust Score: <span className="font-bold text-indigo-600">{vendor.trustScore || 0}</span></div>
                        <div>Completed: <span className="font-bold">{vendor.completedEvents || 0}</span></div>
                      </div>
                    </div>

                    {vendor.verificationDocuments?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-sm">Uploaded Documents:</h4>
                        <div className="space-y-2">
                          {vendor.verificationDocuments.map((doc, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                              <div>
                                <div className="font-medium text-sm capitalize">
                                  {doc.documentType?.replace('_', ' ')}
                                </div>
                                <div className="text-xs text-gray-500">{doc.documentName}</div>
                              </div>
                              <a
                                href={doc.documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-xs"
                              >
                                View
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveVerification(vendor.userId?._id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleRejectVerification(vendor.userId?._id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-semibold"
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

      {/* ── EVENT EDIT MODAL ── */}
      {eventModal && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
              <h2 className="text-2xl font-bold">✏️ Edit Event</h2>
            </div>
            <div className="p-6 space-y-4">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={e => setEditingEvent({...editingEvent, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingEvent.description}
                  onChange={e => setEditingEvent({...editingEvent, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={editingEvent.venue}
                    onChange={e => setEditingEvent({...editingEvent, venue: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Location / City *
                  </label>
                  <input
                    type="text"
                    value={editingEvent.location}
                    onChange={e => setEditingEvent({...editingEvent, location: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Event Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={editingEvent.eventDate}
                    onChange={e => setEditingEvent({...editingEvent, eventDate: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Max Attendees
                  </label>
                  <input
                    type="number"
                    value={editingEvent.maxAttendees}
                    onChange={e => setEditingEvent({...editingEvent, maxAttendees: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editingEvent.category}
                  onChange={e => setEditingEvent({...editingEvent, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {['music','festival','conference','workshop','sports','social','food','tech','art','other'].map(c => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveEvent}
                  disabled={saving}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button
                  onClick={() => { setEventModal(false); setEditingEvent(null); }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SERVICE EDIT MODAL ── */}
      {serviceModal && editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-2xl">
              <h2 className="text-2xl font-bold">✏️ Edit Service</h2>
            </div>
            <div className="p-6 space-y-4">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={editingService.serviceName}
                  onChange={e => setEditingService({...editingService, serviceName: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingService.description}
                  onChange={e => setEditingService({...editingService, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={editingService.price}
                    onChange={e => setEditingService({...editingService, price: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingService.location}
                    onChange={e => setEditingService({...editingService, location: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editingService.category}
                  onChange={e => setEditingService({...editingService, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {['catering','photography','music','decoration','venue','transport','security','other'].map(c => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveService}
                  disabled={saving}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button
                  onClick={() => { setServiceModal(false); setEditingService(null); }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;