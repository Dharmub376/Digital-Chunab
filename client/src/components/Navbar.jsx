import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Vote, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Vote className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-gray-900">Digital Chunab</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-700">{user.name}</span>
              <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;