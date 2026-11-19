import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddStudent from './pages/AddStudent';
import StudentList from './pages/StudentList';
import EditStudent from './pages/EditStudent';
import { GraduationCap, ShieldCheck } from 'lucide-react';

function App() {
  return (
    <div className="app-shell">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/edit-student/:id" element={<EditStudent />} />
          {/* Catch-all route redirects to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-left">
            <GraduationCap size={18} className="footer-icon" />
            <span className="footer-title">Placement Skill Monitoring Management System</span>
          </div>
          <div className="footer-right">
            <span className="footer-tech">MERN Stack (MongoDB, Express, React, Node.js)</span>
            <span className="footer-divider">•</span>
            <span className="footer-status">
              <ShieldCheck size={14} className="inline-icon text-green" /> Database: placementDB
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
