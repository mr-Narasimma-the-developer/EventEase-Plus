import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/auth/profile');
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
        bio: data.bio || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
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
      await API.put('/auth/profile', formData);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating profile');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>

            {message && (
              <div className={`mb-6 p-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Basic Info Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-semibold">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-semibold">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-semibold">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-semibold">Role</label>
                    <input
                      type="text"
                      value={user?.role}
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed capitalize"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Address Details</h2>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-semibold">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House/Flat no, Building name, Street"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2 font-semibold">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-semibold">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-semibold">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-semibold">Location (for search)</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Mumbai, Delhi"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-600 mt-1">This will be used for location-based searches</p>
                  </div>
                </div>
              </div>

              {/* Bio Section (for vendors and organizers) */}
              {(user?.role === 'vendor' || user?.role === 'organizer') && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4 border-b pb-2">Professional Info</h2>
                  
                  <div>
                    <label className="block text-gray-700 mb-2 font-semibold">Bio / About</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell others about yourself..."
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;