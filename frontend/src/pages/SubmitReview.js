import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const SubmitReview = () => {
  const { targetId, targetType } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = new FormData();
      data.append('targetId', targetId);
      data.append('targetType', targetType);
      data.append('rating', formData.rating);
      data.append('comment', formData.comment);
      
      images.forEach(image => {
        data.append('images', image);
      });

      await API.post('/reviews', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Review submitted successfully!');
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting review');
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Write a Review</h1>

          {message && (
            <div className={`mb-6 p-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-3 font-semibold">Rating *</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none"
                  >
                    <span className={`text-4xl ${star <= formData.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                      ⭐
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">Selected: {formData.rating} stars</p>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-semibold">Your Review *</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows="6"
                placeholder="Share your experience..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Images */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-semibold">Add Photos (Optional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-sm text-gray-600 mt-1">You can upload up to 5 images</p>
              
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {images.map((img, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                      📷 {img.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-gray-400"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
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

export default SubmitReview;