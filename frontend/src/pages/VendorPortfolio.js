import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const VendorPortfolio = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    bio: '',
    specializations: ''
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/vendors/profile');
      setProfile(data);
      setFormData({
        bio: data.bio || '',
        specializations: data.specializations?.join(', ') || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const data = new FormData();
      data.append('bio', formData.bio);
      data.append('specializations', JSON.stringify(formData.specializations.split(',').map(s => s.trim())));
      
      files.forEach(file => {
        data.append('portfolio', file);
      });

      await API.put('/vendors/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Profile updated successfully!');
      setFiles([]);
      fetchProfile();
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Portfolio</h1>

          {message && (
            <div className={`mb-6 p-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          {/* Trust Score Display */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Trust Score</h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-5xl font-bold text-green-600">{profile.trustScore}</div>
                <div className="text-gray-600 mt-2">
                  {profile.isVerified ? '✓ Verified Vendor' : 'Pending Verification'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-600 mb-1">Completed Events</div>
                <div className="text-3xl font-bold">{profile.completedEvents}</div>
              </div>
            </div>
          </div>

          {/* Update Profile Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tell clients about yourself and your services..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">Specializations (comma-separated)</label>
                <input
                  type="text"
                  value={formData.specializations}
                  onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Wedding Photography, Corporate Events, Portraits"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold">Add Portfolio Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-sm text-gray-600 mt-1">You can upload multiple images at once</p>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
              >
                Update Portfolio
              </button>
            </form>
          </div>

          {/* Portfolio Gallery */}
          {profile.portfolioImages && profile.portfolioImages.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Portfolio Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profile.portfolioImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorPortfolio;