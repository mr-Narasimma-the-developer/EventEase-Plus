import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const VendorPortfolio = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    bio: '',
    specializations: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/vendors/profile/me');
      setProfile(data.profile);
      if (data.profile) {
        setFormData({
          bio: data.profile.bio || '',
          specializations: data.profile.specializations?.join(', ') || ''
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const uploadData = new FormData();
      uploadData.append('bio', formData.bio);
      
      const specs = formData.specializations
        .split(',')
        .map(s => s.trim())
        .filter(s => s);
      uploadData.append('specializations', JSON.stringify(specs));

      if (images.length > 0) {
        for (let i = 0; i < Math.min(images.length, 5); i++) {
          uploadData.append('portfolioImages', images[i]);
        }
      }

      await API.put('/vendors/profile', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Portfolio updated successfully!');
      fetchProfile();
      setImages([]);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating portfolio');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Vendor Portfolio</h1>

          {/* Profile Info Card */}
          {profile && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-gray-600">Trust Score:</span>
                  <span className="ml-2 text-2xl font-bold text-indigo-600">
                    {profile.trustScore || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Verified:</span>
                  <span className="ml-2">
                    {profile.isVerified ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Completed Events:</span>
                  <span className="ml-2 font-semibold">
                    {profile.completedEvents || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Badge:</span>
                  <span className="ml-2 capitalize">
                    {profile.verificationBadge || 'none'}
                  </span>
                </div>
              </div>

              {profile.portfolioImages && profile.portfolioImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3">Portfolio Images</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {profile.portfolioImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Portfolio ${idx + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Update Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Update Portfolio</h2>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('success') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about your services..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold">
                  Specializations
                </label>
                <input
                  type="text"
                  name="specializations"
                  value={formData.specializations}
                  onChange={handleChange}
                  placeholder="Wedding Photography, Corporate Events (comma separated)"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold">
                  Portfolio Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-1">Max 5 images</p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-gray-400"
              >
                {submitting ? 'Updating...' : 'Update Portfolio'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorPortfolio;