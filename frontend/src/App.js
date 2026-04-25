import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AIChatbot from './components/AIChatbot';
import EditService from './pages/EditService';
import EditEvent from './pages/EditEvent';
<<<<<<< HEAD
import VendorVerification from './pages/VendorVerification'
=======
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import EventQRCode from './pages/EventQRCode';
import AttendEvent from './pages/AttendEvent';
import EventHeatmap from './pages/EventHeatmap';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import MyServices from './pages/MyServices';
import Recommendations from './pages/Recommendations';
import Admin from './pages/Admin';
import Marketplace from './pages/Marketplace';
import VendorPortfolio from './pages/VendorPortfolio';
import VendorProfileView from './pages/VendorProfileView';
import Profile from './pages/Profile';
import BudgetEstimator from './pages/BudgetEstimator';
import VendorRecommendations from './pages/VendorRecommendations';
import VendorComparison from './pages/VendorComparison';
import Notifications from './pages/Notifications';
import SubmitReview from './pages/SubmitReview';
import FraudDetection from './pages/FraudDetection';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Main Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Event Routes */}
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
          <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
          <Route path="/events/:id/qr" element={<ProtectedRoute><EventQRCode /></ProtectedRoute>} />
          <Route path="/attend/:id" element={<AttendEvent />} />
          <Route path="/event-heatmap" element={<EventHeatmap />} />
          
          {/* Marketplace */}
          <Route path="/marketplace" element={<Marketplace />} />
          
          {/* Service Routes */}
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/my-services" element={<ProtectedRoute><MyServices /></ProtectedRoute>} />
          <Route path="/recommendations" element={<Recommendations />} />
          
          {/* Vendor Routes */}
          <Route path="/vendor/portfolio" element={<ProtectedRoute><VendorPortfolio /></ProtectedRoute>} />
          <Route path="/vendor-profile/:id" element={<VendorProfileView />} />
          <Route path="/vendor-comparison" element={<VendorComparison />} />
<<<<<<< HEAD
          <Route path="/vendor/verification" element={<ProtectedRoute><VendorVerification /></ProtectedRoute>} />
=======
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
          
          {/* Organizer Tools */}
          <Route path="/budget-estimator" element={<ProtectedRoute><BudgetEstimator /></ProtectedRoute>} />
          <Route path="/vendor-recommendations" element={<ProtectedRoute><VendorRecommendations /></ProtectedRoute>} />
          
          {/* Reviews */}
          <Route path="/review/:targetType/:targetId" element={<ProtectedRoute><SubmitReview /></ProtectedRoute>} />
          
          {/* User Routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/admin/fraud-detection" element={<ProtectedRoute><FraudDetection /></ProtectedRoute>} />

          <Route path="/edit-service/:id" element={<ProtectedRoute><EditService /></ProtectedRoute>} />
          <Route path="/edit-event/:id" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
        </Routes>
        
        <AIChatbot />
      </Router>
    </AuthProvider>
  );
}

export default App;