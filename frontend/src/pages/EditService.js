import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    category: '',
    price: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const { data } = await API.get(`/services/${id}`);
      setFormData({
        serviceName: data.serviceName,
        description: data.description,
        category: data.category,
        price: data.price,
        location: data.location
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching service:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await API.put(`/services/${id}`, formData);
      setMessage('Service updated successfully!');
      setTimeout(() => navigate('/my-services'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating service');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this service? This cannot be undone.')) {
      try {
        await API.delete(`/services/${id}`);
        alert('Service deleted successfully');
        navigate('/my-services');
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
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Edit Service</h1>

          {message && (
            <div className={`mb-6 p-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
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

<<<<<<< HEAD
           <div className="mb-4">
  <label className="block text-gray-700 mb-2 font-semibold">Service Price (₹) *</label>
  <input
    type="number"
    name="price"
    value={formData.price}
    onChange={handleChange}
    placeholder="Enter total service price"
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    required
  />
  <p className="text-sm text-gray-600 mt-1">Total price for the complete service</p>
</div>
=======
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">Price (₹ per person) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-semibold">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Mumbai, Delhi"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
              >
                Update Service
              </button>
              <button
                type="button"
                onClick={() => navigate('/my-services')}
                className="px-8 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t">
            <h3 className="text-xl font-bold mb-4 text-red-600">Danger Zone</h3>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold"
            >
              🗑️ Delete Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditService;