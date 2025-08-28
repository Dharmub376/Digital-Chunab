import React, { useState, useEffect } from 'react';
import { Activity, Search, Filter } from 'lucide-react';
import api from '../../services/api';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setLogs(response.data.data.recentActivity);
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'LOGIN':
        return '🔐';
      case 'CAST_VOTE':
        return '🗳️';
      case 'CREATE_STUDENT':
        return '👨‍🎓';
      case 'CREATE_POSITION':
        return '🏆';
      case 'CREATE_CANDIDATE':
        return '👤';
      default:
        return '📝';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'LOGIN':
        return 'bg-blue-100 text-blue-800';
      case 'CAST_VOTE':
        return 'bg-green-100 text-green-800';
      case 'CREATE_STUDENT':
        return 'bg-purple-100 text-purple-800';
      case 'CREATE_POSITION':
        return 'bg-yellow-100 text-yellow-800';
      case 'CREATE_CANDIDATE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600">System activity and audit trail</p>
        </div>
      </div>

      <div className="card">
        <div className="space-y-4">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getActionIcon(log.action)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {log.user?.name || 'System'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {log.userType}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Yet</h3>
              <p className="text-gray-600">Activity logs will appear here as actions are performed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;