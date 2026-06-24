import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const StarRating = ({ value, onChange, readonly = false }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`text-3xl transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          disabled={readonly}
        >
          <span className={
            star <= (hovered || value)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }>★</span>
        </button>
      ))}
    </div>
  );
};

const ServiceDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [service, setService] = useState(null);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Booking state
  const [bookingData, setBookingData] = useState({
    eventDate: '', numberOfPeople: '', notes: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  // Review state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => { fetchService(); }, [id]);

  const fetchService = async () => {
    try {
      const { data } = await API.get(`/services/${id}`);
      setService(data);

      // Fetch vendor profile for badge + trust score
      if (data.providerId?._id) {
        try {
          const vpRes = await API.get(`/vendors/profile/${data.providerId._id}`);
          setVendorProfile(vpRes.data);
        } catch {
          // Vendor profile may not exist — that's fine
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching service:', error);
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingData.eventDate) {
      setMessage('Please select an event date');
      return;
    }
    setBookingLoading(true);
    setMessage('');
    try {
      await API.post('/bookings', {
        serviceId: id,
        vendorId: service.providerId._id,
        bookingDate: bookingData.eventDate,
        numberOfPeople: bookingData.numberOfPeople || null,
        notes: bookingData.notes || '',
        totalPrice: service.price
      });
      setMessage('✅ Booking request sent! The vendor will contact you soon.');
      setBookingData({ eventDate: '', numberOfPeople: '', notes: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewRating) {
      setReviewMessage('Please select a star rating');
      return;
    }
    setReviewLoading(true);
    setReviewMessage('');
    try {
      const { data } = await API.post(`/services/${id}/review`, {
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewMessage('✅ Review submitted successfully!');
      setReviewRating(0);
      setReviewComment('');
      setShowReviewForm(false);
      // Update service with new rating
      setService(prev => ({
        ...prev,
        rating: data.rating,
        reviews: data.reviews
      }));
    } catch (error) {
      setReviewMessage(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const getBadgeStyle = (badge) => {
    switch (badge) {
      case 'elite':   return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'premium': return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'standard':return 'bg-blue-100 text-blue-800 border border-blue-300';
      default:        return '';
    }
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'elite':   return '👑';
      case 'premium': return '💎';
      case 'standard':return '✅';
      default:        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500">Loading service...</p>
      </div>
    );
  }

  if (!service) {
    return <div className="text-center py-20 text-gray-500">Service not found</div>;
  }

  const alreadyReviewed = service.reviews?.some(
    r => r.userId?.toString() === user?._id?.toString()
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── LEFT: Service Info ── */}
          <div className="space-y-6">

            {/* Main Service Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-800">{service.serviceName}</h1>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm capitalize">
                  {service.category}
                </span>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

              {/* Price */}
              <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Total Package Price</span>
                  <span className="text-3xl font-bold text-indigo-600">
                    ₹{service.price?.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Fixed price — not per person</p>
              </div>

              {/* Rating Display */}
              <div className="flex items-center gap-3 mb-2">
                <StarRating value={Math.round(service.rating || 0)} readonly />
                <span className="font-semibold text-gray-700">
                  {service.rating ? service.rating.toFixed(1) : '0.0'} / 5
                </span>
                <span className="text-sm text-gray-500">
                  ({service.reviews?.length || 0} reviews)
                </span>
              </div>

              <div className="text-sm text-gray-500">
                Total Bookings: {service.totalBookings || 0}
              </div>
            </div>

            {/* Vendor Profile Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">👤 Vendor Details</h3>

              <div className="space-y-2 text-gray-700 mb-4">
                <p><span className="font-semibold">Name:</span> {service.providerId?.name}</p>
                <p><span className="font-semibold">Email:</span> {service.providerId?.email}</p>
                <p><span className="font-semibold">Phone:</span> {service.providerId?.phone || 'N/A'}</p>
                <p><span className="font-semibold">Location:</span> {service.providerId?.location || 'N/A'}</p>
              </div>

              {/* Verification Badge */}
              {vendorProfile && vendorProfile.isVerified && vendorProfile.verificationBadge !== 'none' && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-3 ${
                  getBadgeStyle(vendorProfile.verificationBadge)
                }`}>
                  {getBadgeIcon(vendorProfile.verificationBadge)}
                  {vendorProfile.verificationBadge.charAt(0).toUpperCase() +
                   vendorProfile.verificationBadge.slice(1)} Verified
                </div>
              )}

              {/* Trust Score */}
              {vendorProfile && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">Trust Score</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {vendorProfile.trustScore || 0}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        vendorProfile.trustScore >= 80 ? 'bg-green-500' :
                        vendorProfile.trustScore >= 50 ? 'bg-yellow-500' : 'bg-red-400'
                      }`}
                      style={{ width: `${vendorProfile.trustScore || 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span className={
                      vendorProfile.trustScore >= 80 ? 'text-green-600 font-semibold' :
                      vendorProfile.trustScore >= 50 ? 'text-yellow-600 font-semibold' :
                      'text-red-500 font-semibold'
                    }>
                      {vendorProfile.trustScore >= 80 ? 'Highly Trusted' :
                       vendorProfile.trustScore >= 50 ? 'Moderate Trust' : 'Building Trust'}
                    </span>
                    <span>100</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Completed Events: {vendorProfile.completedEvents || 0}
                  </p>
                </div>
              )}

              {!vendorProfile && (
                <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-500">
                  📋 Vendor not yet verified
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">⭐ Reviews</h3>
                {user && !alreadyReviewed && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-semibold"
                  >
                    {showReviewForm ? 'Cancel' : '+ Write Review'}
                  </button>
                )}
                {alreadyReviewed && (
                  <span className="text-sm text-green-600 font-semibold">✅ You reviewed this</span>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="bg-indigo-50 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold mb-3">Your Review</h4>

                  {reviewMessage && (
                    <div className={`p-3 mb-3 rounded-lg text-sm ${
                      reviewMessage.includes('✅')
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {reviewMessage}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">Rating *</label>
                    <StarRating value={reviewRating} onChange={setReviewRating} />
                    {reviewRating > 0 && (
                      <p className="text-xs text-indigo-600 mt-1">
                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewRating]}
                      </p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
                    <textarea
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      rows={3}
                      placeholder="Share your experience..."
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading || !reviewRating}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold disabled:opacity-50 text-sm"
                  >
                    {reviewLoading ? 'Submitting...' : '⭐ Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              {service.reviews && service.reviews.length > 0 ? (
                <div className="space-y-4">
                  {service.reviews.map((review, idx) => (
                    <div key={idx} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                            {review.userName?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-800">{review.userName}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <StarRating value={review.rating} readonly />
                      {review.comment && (
                        <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <p className="text-4xl mb-2">⭐</p>
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Booking ── */}
          <div>
            {user && user.role === 'organizer' && (
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-8">
                <h2 className="text-2xl font-bold mb-6">📅 Book This Service</h2>

                {message && (
                  <div className={`p-4 mb-4 rounded-lg text-sm ${
                    message.includes('✅')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Event Date *</label>
                    <input
                      type="date"
                      value={bookingData.eventDate}
                      onChange={e => setBookingData({...bookingData, eventDate: e.target.value})}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Number of People <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="number"
                      value={bookingData.numberOfPeople}
                      onChange={e => setBookingData({...bookingData, numberOfPeople: e.target.value})}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="For reference only"
                      min="1"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Price is fixed — not calculated per person
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Notes <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={bookingData.notes}
                      onChange={e => setBookingData({...bookingData, notes: e.target.value})}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                      placeholder="Special requirements..."
                    />
                  </div>

                  <div className="bg-indigo-50 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Cost</span>
                      <span className="text-3xl font-bold text-indigo-600">
                        ₹{service.price?.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Fixed package price</p>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-bold text-lg"
                  >
                    {bookingLoading ? 'Processing...' : '📅 Book Now'}
                  </button>
                </form>
              </div>
            )}

            {user && user.role === 'participant' && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="text-center py-4">
                  <p className="text-5xl mb-3">ℹ️</p>
                  <p className="text-gray-600">
                    Only organizers can book services. If you're planning an event,
                    register as an organizer.
                  </p>
                </div>
              </div>
            )}

            {!user && (
              <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                <p className="text-gray-600 mb-4">Login as an organizer to book this service</p>
                <a
                  href="/login"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
                >
                  Login
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;