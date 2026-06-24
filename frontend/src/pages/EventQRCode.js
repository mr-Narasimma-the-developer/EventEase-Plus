import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';

const EventQRCode = () => {
  const { id } = useParams();
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    generateQRCode();
  }, [id]);

  const generateQRCode = async () => {
    try {
      console.log('Generating QR code for event:', id);
      
      const { data } = await API.get(`/events/${id}/qr`);
      
      console.log('QR code generated:', data);
      
      setQrData(data);
      setLoading(false);
      
    } catch (error) {
      console.error('QR generation error:', error);
      setMessage(error.response?.data?.message || 'Failed to generate QR code');
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrData || !qrData.qrCode) return;

    const link = document.createElement('a');
    link.href = qrData.qrCode;
    link.download = `event-qr-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareQRCode = async () => {
    if (!qrData || !qrData.attendUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: qrData.eventTitle || 'Event QR Code',
          text: `Scan to mark attendance for: ${qrData.eventTitle}`,
          url: qrData.attendUrl
        });
      } catch (error) {
        console.error('Share error:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(qrData.attendUrl);
      setMessage('Link copied to clipboard!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating QR Code...</p>
        </div>
      </div>
    );
  }

  if (message && !qrData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-800 p-6 rounded-lg">
          <p className="font-semibold">Error: {message}</p>
          <Link to="/my-events" className="text-indigo-600 hover:underline mt-2 block">
            ← Back to My Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/my-events" className="text-indigo-600 hover:underline mb-4 inline-block">
            ← Back to My Events
          </Link>
          <h1 className="text-3xl font-bold mb-2">Event QR Code</h1>
          <p className="text-gray-600">Scan this QR code to mark attendance</p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
            {message}
          </div>
        )}

        {/* QR Code Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Event Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {qrData?.eventTitle || 'Event Attendance'}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Event ID: {id}
            </p>
          </div>

          {/* QR Code Image */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-6 rounded-lg border-4 border-indigo-600 shadow-lg">
              <img
                src={qrData.qrCode}
                alt="Event QR Code"
                className="w-80 h-80"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-lg mb-3">📱 How to Use:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Display this QR code at your event venue</li>
              <li>Attendees scan the code with their phone camera</li>
              <li>They'll be redirected to the attendance page</li>
              <li>One-click attendance marking</li>
              <li>Real-time attendance tracking in your dashboard</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={downloadQRCode}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 font-semibold transition-all"
            >
              📥 Download QR Code
            </button>

            <button
              onClick={shareQRCode}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-semibold transition-all"
            >
              📤 Share QR Code
            </button>
          </div>

          {/* Attendance URL */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Attendance URL:</p>
            <code className="text-xs text-gray-800 break-all">
              {qrData.attendUrl}
            </code>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-3 text-blue-900">💡 Pro Tips:</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• Print the QR code and place it at the entrance</li>
            <li>• Display on a tablet or screen for easy scanning</li>
            <li>• Test the QR code before the event</li>
            <li>• Keep your phone/tablet charged for on-site scanning</li>
            <li>• Monitor attendance in real-time from your dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventQRCode;