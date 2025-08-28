import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Dashboard from './Dashboard';
import Students from './Students';
import Positions from './Positions';
import Candidates from './Candidates';
import Results from './Results';
import ActivityLogs from './ActivityLogs';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/results" element={<Results />} />
            <Route path="/activity" element={<ActivityLogs />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;