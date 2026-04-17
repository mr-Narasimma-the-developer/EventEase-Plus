import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';

const EventQRCode = () => {
  const { id } = useParams();
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQRCode();
  }, [id]);

  const fetchQRCode = async () => {
    try {
      const { data } = await API.get(`/events/${id}/qr-code`);
      setQrData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching QR code:', error);
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrData.qrCode;
    link.download = `${qrData.eventTitle}-QR.png`;
    link.click();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Generating QR Code...</div>;
  }

  if (!qrData) {
    return <div className="text-center py-20">Error generating QR code</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Event Attendance QR Code</h1>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold text-center mb-2">{qrData.eventTitle}</h2>
            <p className="text-center text-gray-600">Scan this QR code to mark attendance</p>
          </div>

          <div className="bg-white border-4 border-indigo-600 rounded-lg p-8 mb-6">
            <img 
              src={qrData.qrCode} 
              alt="Event QR Code" 
              className="w-full max-w-md mx-auto"
            />
          </div>

          <div className="space-y-4">
            <button
              onClick={downloadQR}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
            >
              📥 Download QR Code
            </button>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-800">
                <strong>How to use:</strong><br/>
                1. Display this QR code at your event entrance<br/>
                2. Participants scan with their phone camera<br/>
                3. Attendance is marked automatically<br/>
                4. Track attendance in real-time from dashboard
              </p>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>Direct URL: <code className="bg-gray-100 px-2 py-1 rounded">{qrData.attendanceUrl}</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventQRCode;