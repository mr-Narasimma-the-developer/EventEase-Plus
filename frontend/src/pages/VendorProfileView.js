import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';

const VendorProfileView = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorData();
  }, [id]);

 useEffect(() => {
  fetchVendorData();
}, [id]);

const fetchVendorData = async () => {
  try {
    const [vendorRes, servicesRes, reviewsRes] = await Promise.all([
      API.get(`/vendors/${id}`),
      API.get(`/services?providerId=${id}`),
      API.get(`/reviews/vendor/${id}`)  // UPDATED LINE
    ]);

    setVendor(vendorRes.data);
    setServices(servicesRes.data || []);
    setReviews(reviewsRes.data || []);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching vendor data:', error);
    setLoading(false);
  }
};

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading vendor profile...</div>;
  }

  if (!vendor) {
    return <div className="text-center py-20">Vendor not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section (FB-style) */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="bg-indigo-600 text-white w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold">
              {vendor.profile?.userId?.name?.charAt(0).toUpperCase()}
            </div>

            {/* Vendor Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">{vendor.profile?.userId?.name}</h1>
                {vendor.profile?.isVerified && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    ✓ Verified
                  </span>
                )}
              </div>

              {vendor.profile?.bio && (
                <p className="text-gray-700 mb-4 max-w-2xl">{vendor.profile.bio}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600">{vendor.trustScore}</div>
                  <div className="text-sm text-gray-600">Trust Score</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-indigo-600">{vendor.profile?.completedEvents}</div>
                  <div className="text-sm text-gray-600">Events Completed</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-600">{services.length}</div>
                  <div className="text-sm text-gray-600">Services Offered</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-yellow-600">{reviews.length}</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
              </div>

              {vendor.profile?.specializations && vendor.profile.specializations.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">Specializations:</div>
                  <div className="flex flex-wrap gap-2">
                    {vendor.profile.specializations.map((spec, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <div>📍 {vendor.profile?.userId?.location}</div>
                <div>📧 {vendor.profile?.userId?.email}</div>
                <div>📞 {vendor.profile?.userId?.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section (FB-style Posts) */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Services Offered</h2>

        {services.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No services listed yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {services.map((service) => (
              <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Service Header */}
                <div className="p-4 border-b flex items-center space-x-3">
                  <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                    {vendor.profile?.userId?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold">{vendor.profile?.userId?.name}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{service.serviceName}</h3>
                  <p className="text-gray-700 mb-4">{service.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg mb-4">
                    <div>
                      <div className="text-gray-600 text-sm">Price</div>
                      <div className="text-2xl font-bold text-indigo-600">₹{service.price}</div>
                      <div className="text-sm text-gray-600">per person</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm">Category</div>
                      <div className="font-semibold capitalize">{service.category}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm">Rating</div>
                      <div className="font-semibold">⭐ {service.rating || 0}/5</div>
                    </div>
                  </div>

                  <Link
                    to={`/services/${service._id}`}
                    className="block text-center bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
                  >
                    View Service Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="bg-gray-300 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                      {review.reviewerId?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{review.reviewerId?.name}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  {review.images && review.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {review.images.map((img, index) => (
                        <img key={index} src={img} alt="Review" className="w-full h-24 object-cover rounded" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProfileView;