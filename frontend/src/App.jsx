import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<div className="bg-white p-6 rounded-md-custom border border-primary-200 shadow-sm-flat text-primary-500">Projects Workspace (Coming Soon)</div>} />
          <Route path="tasks" element={<div className="bg-white p-6 rounded-md-custom border border-primary-200 shadow-sm-flat text-primary-500">Tasks Board (Coming Soon)</div>} />
          <Route path="audit-logs" element={<div className="bg-white p-6 rounded-md-custom border border-primary-200 shadow-sm-flat text-primary-500">System Activity Logs (Coming Soon)</div>} />
          <Route path="notifications" element={<div className="bg-white p-6 rounded-md-custom border border-primary-200 shadow-sm-flat text-primary-500">User Alerts Center (Coming Soon)</div>} />
          <Route path="profile" element={<div className="bg-white p-6 rounded-md-custom border border-primary-200 shadow-sm-flat text-primary-500">User Account Settings (Coming Soon)</div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
