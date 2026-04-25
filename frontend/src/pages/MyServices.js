import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
=======
import { useNavigate, Link } from 'react-router-dom';
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
import API from '../utils/api';

const MyServices = () => {
  const [services, setServices] = useState([]);
<<<<<<< HEAD
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    category: '',
=======
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: '',
    category: 'catering',
    description: '',
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
    price: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
=======
  const navigate = useNavigate();
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

  useEffect(() => {
    fetchMyServices();
  }, []);

  const fetchMyServices = async () => {
    try {
      const { data } = await API.get('/services/my-services');
<<<<<<< HEAD
      console.log('My services:', data);
=======
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
      setServices(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);

    console.log('Submitting service:', formData);

    try {
      const response = await API.post('/services', formData);
      console.log('Service created response:', response.data);
      
      setMessage('Service created successfully!');
      setFormData({
        serviceName: '',
        description: '',
        category: '',
        price: '',
        location: ''
      });
      
      // Refresh services list
      fetchMyServices();
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Service creation error:', error);
      const errorMessage = error.response?.data?.message || 'Error creating service';
      console.error('Error details:', error.response?.data);
      setMessage(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await API.delete(`/services/${serviceId}`);
        alert('Service deleted successfully');
        fetchMyServices();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting service');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">My Services</h1>

        {/* Create Service Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Create New Service</h2>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">Service Name *</label>
              <input
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                placeholder="e.g., Wedding Photography"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Category</option>
                <option value="catering">Catering</option>
                <option value="photography">Photography</option>
                <option value="decoration">Decoration</option>
                <option value="venue">Venue</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">Service Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="20000"
                min="1"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <p className="text-sm text-gray-600 mt-1">Enter the total price for your service package</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Chennai"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-semibold">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your service in detail..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/services', formData);
      setShowForm(false);
      setFormData({
        serviceName: '',
        category: 'catering',
        description: '',
        price: '',
        location: ''
      });
      fetchMyServices();
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this service?')) {
    try {
      await API.delete(`/services/${id}`);
      fetchMyServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  }
};

if (loading) {
  return <div className="flex justify-center items-center h-screen">Loading...</div>;
}

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Services</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add New Service'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-6">Create New Service</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Service Name</label>
                <input
                  type="text"
                  value={formData.serviceName}
                  onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="catering">Catering</option>
                  <option value="photography">Photography</option>
                  <option value="decoration">Decoration</option>
                  <option value="venue">Venue</option>
                  <option value="entertainment">Entertainment</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Price (per person)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  required
                />
              </div>
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
            </div>

            <button
              type="submit"
<<<<<<< HEAD
              disabled={submitting}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating Service...' : 'Create Service'}
            </button>
          </form>
        </div>

        {/* My Services List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">My Services ({services.length})</h2>

          {services.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-bold mb-2">No Services Yet</h3>
              <p className="text-gray-600">Create your first service above to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
                  <h3 className="text-xl font-bold mb-2">{service.serviceName}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-indigo-600">₹{service.price}</span>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded text-sm capitalize">
                      {service.category}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    📍 {service.location}
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/services/${service._id}`}
                      className="flex-1 text-center bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-semibold"
                    >
                      View
                    </Link>
                    <Link
                      to={`/edit-service/${service._id}`}
                      className="flex-1 text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="px-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-semibold"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
=======
              className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Create Service
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">No services yet. Create your first one!</p>
        ) : (
          services.map((service) => (
            <div key={service._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">{service.serviceName}</h3>
              <p className="text-gray-600 text-sm mb-2">{service.category}</p>
              <p className="text-gray-700 mb-4">{service.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-indigo-600">₹{service.price}</span>
                <span className="text-gray-600">{service.location}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-4">
                <span>Bookings: {service.totalBookings}</span>
                <span className={service.availability ? 'text-green-600' : 'text-red-600'}>
                  {service.availability ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <button
                onClick={() => handleDelete(service._id)}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))
        )}
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
      </div>
    </div>
  );
};

export default MyServices;