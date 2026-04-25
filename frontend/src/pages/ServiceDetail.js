import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const ServiceDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [bookingData, setBookingData] = useState({
    eventDate: '',
    peopleCount: '',
    customerNotes: ''
  });
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const { data } = await API.get(`/services/${id}`);
      setService(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching service:', error);
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    setMessage('');

    try {
      await API.post('/bookings', {
        serviceId: id,
        ...bookingData
      });
      setMessage('Booking created successfully!');
      setBookingData({ eventDate: '', peopleCount: '', customerNotes: '' });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Booking failed');
    }
    setBookingLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!service) {
    return <div className="text-center py-20">Service not found</div>;
  }

  const estimatedCost = bookingData.peopleCount ? service.price * bookingData.peopleCount : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Service Details */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{service.serviceName}</h1>
            {service.providerId?.isVerified && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded">Verified</span>
            )}
          </div>

          <div className="mb-6">
            <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded text-sm">
              {service.category}
            </span>
          </div>

          <p className="text-gray-700 mb-6">{service.description}</p>

          <div className="border-t pt-4 mb-4">
            <h3 className="font-bold mb-2">Provider Details</h3>
            <p className="text-gray-700">Name: {service.providerId?.name}</p>
            <p className="text-gray-700">Email: {service.providerId?.email}</p>
            <p className="text-gray-700">Phone: {service.providerId?.phone}</p>
            <p className="text-gray-700">Location: {service.providerId?.location}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="font-bold">Price per person:</span>
              <span className="text-2xl text-indigo-600">₹{service.price}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Rating:</span>
              <span>{service.rating || 0}/5</span>
            </div>
            <div className="flex justify-between">
              <span>Total Bookings:</span>
              <span>{service.totalBookings}</span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Book This Service</h2>

          {message && (
            <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleBooking}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Event Date</label>
              <input
                type="date"
                value={bookingData.eventDate}
                onChange={(e) => setBookingData({ ...bookingData, eventDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Number of People</label>
              <input
                type="number"
                value={bookingData.peopleCount}
                onChange={(e) => setBookingData({ ...bookingData, peopleCount: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                min="1"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Notes (Optional)</label>
              <textarea
                value={bookingData.customerNotes}
                onChange={(e) => setBookingData({ ...bookingData, customerNotes: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
              />
            </div>

            {estimatedCost > 0 && (
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Estimated Cost:</span>
                  <span className="text-2xl text-indigo-600">₹{estimatedCost}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={bookingLoading || !service.availability}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {bookingLoading ? 'Booking...' : service.availability ? 'Book Now' : 'Not Available'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;