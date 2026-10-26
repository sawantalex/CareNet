import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import ChatBot from './components/ChatBot';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import HeartPrediction from './pages/HeartPrediction';
import MedicalDiagnosis from './pages/MedicalDiagnosis';
import PredictionHistory from './pages/PredictionHistory';
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
              {/* Main Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/heart-prediction" element={<HeartPrediction />} />
              <Route path="/medical-diagnosis" element={<MedicalDiagnosis />} />
              <Route path="/prediction-history" element={<PredictionHistory />} />

              {/* Redirect legacy auth paths to home */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />

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
