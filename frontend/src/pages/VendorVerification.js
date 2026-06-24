import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const VendorVerification = () => {
  const { user } = useContext(AuthContext);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    documentType: '',
    documentName: '',
    file: null
  });

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const { data } = await API.get('/vendors/verification/status');
      setVerificationStatus(data.status);
      setDocuments(data.documents || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching verification status:', error);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.documentType || !formData.documentName || !formData.file) {
      setMessage('Please fill all fields and select a file');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const uploadData = new FormData();
      uploadData.append('document', formData.file);
      uploadData.append('documentType', formData.documentType);
      uploadData.append('documentName', formData.documentName);

      await API.post('/vendors/verification/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Document uploaded successfully!');
      setFormData({ documentType: '', documentName: '', file: null });
      fetchVerificationStatus();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      verified: { text: '✓ Verified Vendor', color: 'bg-green-100 text-green-800 border-green-300' },
      pending: { text: '⏳ Verification Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      rejected: { text: '✗ Verification Rejected', color: 'bg-red-100 text-red-800 border-red-300' },
      unverified: { text: '📋 Unverified', color: 'bg-gray-100 text-gray-800 border-gray-300' }
    };

    const config = statusConfig[verificationStatus] || statusConfig.unverified;
    
    return (
      <div className={`p-6 rounded-lg border-2 ${config.color} text-center`}>
        <h2 className="text-2xl font-bold mb-2">{config.text}</h2>
        <p className="text-sm">Status: {verificationStatus || 'Not Submitted'}</p>
      </div>
    );
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🔒 Vendor Verification</h1>

      {/* Status Card */}
      {getStatusBadge()}

      {/* Upload Form */}
      {verificationStatus !== 'verified' && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Upload Verification Document</h2>
          
          {message && (
            <div className={`p-4 mb-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Document Type *</label>
              <select
  value={formData.documentType}
  onChange={(e) => setFormData({...formData, documentType: e.target.value})}
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
  required
>
  <option value="">Select Document Type</option>
  <option value="identity_proof">Identity Proof</option>
  <option value="business_license">Business License</option>
  <option value="tax_id">Tax ID</option>
  <option value="insurance">Insurance</option>
  <option value="portfolio">Portfolio</option>
  <option value="other">Other</option>
</select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Document Name *</label>
              <input
                type="text"
                value={formData.documentName}
                onChange={(e) => setFormData({...formData, documentName: e.target.value})}
                placeholder="e.g., Business License 2024"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Upload Document *</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Accepted: PDF, JPG, PNG (Max 5MB)</p>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {uploading ? 'Uploading...' : '📤 Upload Document'}
            </button>
          </form>
        </div>
      )}

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Uploaded Documents</h2>
          
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{doc.documentName}</p>
                  <p className="text-sm text-gray-600">Type: {doc.documentType}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  {doc.status === 'approved' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">✓ Approved</span>
                  )}
                  {doc.status === 'pending' && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">⏳ Pending</span>
                  )}
                  {doc.status === 'rejected' && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">✗ Rejected</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorVerification;