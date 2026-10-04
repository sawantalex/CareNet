import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import ChatBot from './components/ChatBot';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HeartPrediction from './pages/HeartPrediction';
import MedicalDiagnosis from './pages/MedicalDiagnosis';
import PredictionHistory from './pages/PredictionHistory';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <CustomCursor />
      <AuthProvider>
        <Router>
          <div className="app-container">
          <Navbar />
          <ChatBot />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/heart-prediction" element={<ProtectedRoute><HeartPrediction /></ProtectedRoute>} />
            <Route path="/medical-diagnosis" element={<ProtectedRoute><MedicalDiagnosis /></ProtectedRoute>} />
            <Route path="/prediction-history" element={<ProtectedRoute><PredictionHistory /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* 404 Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  </ThemeProvider>
  );
}

export default App;
