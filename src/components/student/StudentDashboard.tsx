import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import StudentSidebar from './StudentSidebar';

const StudentDashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/student" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;