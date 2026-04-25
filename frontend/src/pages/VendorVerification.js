import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const VendorVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [formData, setFormData] = useState({
    documentType: 'business_license',
    documentName: ''
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const { data } = await API.get('/vendors/verification/status');
      setVerificationStatus(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching verification status:', error);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile && !formData.documentName) {
      setFormData({ ...formData, documentName: selectedFile.name });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage('Please select a file to upload');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const uploadData = new FormData();
      uploadData.append('document', file);
      uploadData.append('documentType', formData.documentType);
      uploadData.append('documentName', formData.documentName);

      const { data } = await API.post('/vendors/verification/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Document uploaded successfully! Awaiting admin verification.');
      setFile(null);
      setFormData({ documentType: 'business_license', documentName: '' });
      
      // Refresh status
      fetchVerificationStatus();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Vendor Verification</h1>

          {/* Verification Status Card */}
          <div className={`rounded-lg shadow-lg p-8 mb-8 ${
            verificationStatus?.verificationStatus === 'verified' ? 'bg-gradient-to-r from-green-500 to-teal-500' :
            verificationStatus?.verificationStatus === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
            verificationStatus?.verificationStatus === 'rejected' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
            'bg-gradient-to-r from-gray-500 to-gray-600'
          } text-white`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {verificationStatus?.verificationStatus === 'verified' ? '✓ Verified Vendor' :
                   verificationStatus?.verificationStatus === 'pending' ? '⏳ Verification Pending' :
                   verificationStatus?.verificationStatus === 'rejected' ? '✗ Verification Rejected' :
                   '📋 Unverified'}
                </h2>
                <p className="text-lg opacity-90">
                  {verificationStatus?.verificationStatus === 'verified' && 'Your vendor account is verified!'}
                  {verificationStatus?.verificationStatus === 'pending' && 'Your documents are under review'}
                  {verificationStatus?.verificationStatus === 'rejected' && 'Please resubmit your documents'}
                  {verificationStatus?.verificationStatus === 'unverified' && 'Upload documents to get verified'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold">{verificationStatus?.trustScore || 0}</div>
                <div className="text-lg">Trust Score</div>
              </div>
            </div>

            {verificationStatus?.verificationBadge && verificationStatus.verificationBadge !== 'none' && (
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <span className="text-xl font-bold capitalize">🏅 {verificationStatus.verificationBadge} Badge</span>
              </div>
            )}

            {verificationStatus?.verificationNotes && (
              <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-4">
                <p className="font-semibold">Admin Notes:</p>
                <p>{verificationStatus.verificationNotes}</p>
              </div>
            )}
          </div>

          {/* Upload Documents Section */}
          {verificationStatus?.verificationStatus !== 'verified' && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Upload Verification Documents</h2>

              {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-semibold">Document Type *</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="business_license">Business License</option>
                    <option value="tax_id">Tax ID / GST Certificate</option>
                    <option value="insurance">Insurance Certificate</option>
                    <option value="portfolio">Portfolio / Work Samples</option>
                    <option value="identity_proof">Identity Proof (Aadhar/PAN)</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-semibold">Document Name *</label>
                  <input
                    type="text"
                    value={formData.documentName}
                    onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
                    placeholder="e.g., Business License 2024"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-semibold">Upload Document *</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB)
                  </p>
                  {file && (
                    <p className="text-sm text-green-600 mt-2">✓ Selected: {file.name}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-gray-400"
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </button>
              </form>
            </div>
          )}

          {/* Uploaded Documents List */}
          {verificationStatus?.documents && verificationStatus.documents.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Uploaded Documents</h2>
              
              <div className="space-y-4">
                {verificationStatus.documents.map((doc, index) => (
                  <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold capitalize">{doc.documentType.replace('_', ' ')}</h3>
                      <p className="text-sm text-gray-600">{doc.documentName}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                        doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.status === 'approved' && '✓ Approved'}
                        {doc.status === 'rejected' && '✗ Rejected'}
                        {doc.status === 'pending' && '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorVerification;