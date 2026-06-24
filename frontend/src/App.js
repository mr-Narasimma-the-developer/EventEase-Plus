import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AIChatbot from './components/AIChatbot';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import MyEvents from './pages/MyEvents';
import EventQRCode from './pages/EventQRCode';
import AttendEvent from './pages/AttendEvent';
import EventHeatmap from './pages/EventHeatmap';
import Marketplace from './pages/Marketplace';
import ServiceDetail from './pages/ServiceDetail';
import MyServices from './pages/MyServices';
import EditService from './pages/EditService';
import VendorPortfolio from './pages/VendorPortfolio';
import VendorVerification from './pages/VendorVerification';
import VendorProfileView from './pages/VendorProfileView';
import VendorComparison from './pages/VendorComparison';
import VendorRecommendations from './pages/VendorRecommendations';
import BudgetEstimator from './pages/BudgetEstimator';
import SubmitReview from './pages/SubmitReview';
import Notifications from './pages/Notifications';
import Admin from './pages/Admin';
import FraudDetection from './pages/FraudDetection';
import VendorBookings from './pages/VendorBookings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Navbar />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            
            {/* Event Routes */}
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
            <Route path="/edit-event/:id" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
            <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
            <Route path="/events/:id/qr" element={<ProtectedRoute><EventQRCode /></ProtectedRoute>} />
            <Route path="/attend/:id" element={<ProtectedRoute><AttendEvent /></ProtectedRoute>} />
            <Route path="/event-heatmap" element={<ProtectedRoute><EventHeatmap /></ProtectedRoute>} />
            
            {/* Service/Marketplace Routes */}
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/my-services" element={<ProtectedRoute><MyServices /></ProtectedRoute>} />
            <Route path="/edit-service/:id" element={<ProtectedRoute><EditService /></ProtectedRoute>} />
            
            {/* Vendor Routes */}
            <Route path="/portfolio" element={<ProtectedRoute><VendorPortfolio /></ProtectedRoute>} />
            <Route path="/get-verified" element={<ProtectedRoute><VendorVerification /></ProtectedRoute>} />
            <Route path="/vendor/:id" element={<VendorProfileView />} />
            <Route path="/vendor-comparison" element={<ProtectedRoute><VendorComparison /></ProtectedRoute>} />
            <Route path="/vendor-recommendations" element={<ProtectedRoute><VendorRecommendations /></ProtectedRoute>} />
            
            {/* Tools Routes */}
            <Route path="/budget-estimator" element={<ProtectedRoute><BudgetEstimator /></ProtectedRoute>} />
            <Route path="/submit-review/:targetType/:targetId" element={<ProtectedRoute><SubmitReview /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/fraud-detection" element={<ProtectedRoute><FraudDetection /></ProtectedRoute>} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* // Inside <Routes>: */}
<Route path="/vendor-bookings" element={<ProtectedRoute><VendorBookings /></ProtectedRoute>} />
          
          {/* AI Chatbot - Always visible when logged in */}
          <AIChatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;