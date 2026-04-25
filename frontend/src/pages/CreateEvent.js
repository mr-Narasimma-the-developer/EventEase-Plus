import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
<<<<<<< HEAD
// import EventTemplateSelector from '../components/EventTemplateSelector';
=======
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
import EventTemplateSelector from '../components/EventTemplateSelector';

const CreateEvent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'public',
    category: 'music',
    location: '',
    venue: '',
    eventDate: '',
    maxAttendees: ''
  });
  const [posterFile, setPosterFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPosterFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (posterFile) {
        data.append('poster', posterFile);
      }

      await API.post('/events', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating event');
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setFormData({
      ...formData,
      title: template.title,
      description: template.description,
      category: template.category,
      eventType: template.eventType,
      maxAttendees: template.maxAttendees.toString()
    });
  };
<<<<<<< HEAD
=======
  <EventTemplateSelector onSelectTemplate={handleTemplateSelect} />
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

  if (!user || (user.role !== 'organizer' && user.role !== 'admin')) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600">Only organizers can create events.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Create New Event</h1>

<<<<<<< HEAD
  {error && (
    <div className="mb-6 p-4 bg-red-100 text-red-800 rounded">
      {error}
    </div>
  )}

  <EventTemplateSelector onSelectTemplate={handleTemplateSelect} />

  <form onSubmit={handleSubmit}>
=======
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2 font-semibold">Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2 font-semibold">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Event Type *</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="public">Public (Visible to everyone)</option>
                  <option value="private">Private (Invitation only)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="music">Music</option>
                  <option value="workshop">Workshop</option>
                  <option value="conference">Conference</option>
                  <option value="sports">Sports</option>
                  <option value="social">Social</option>
                  <option value="festival">Festival</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Location (City) *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Mumbai"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Venue *</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g., Phoenix Marketcity"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Event Date & Time *</label>
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Max Attendees (Optional)</label>
                <input
                  type="number"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  placeholder="Leave empty for unlimited"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2 font-semibold">Event Poster (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-sm text-gray-600 mt-1">Recommended: 1200x630px</p>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-semibold"
              >
                {loading ? 'Creating Event...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-8 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;