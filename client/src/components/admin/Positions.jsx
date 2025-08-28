import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import api from '../../services/api';
import Modal from '../Modal';

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await api.get('/admin/positions');
      setPositions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPosition) {
        await api.put(`/admin/positions/${editingPosition._id}`, formData);
      } else {
        await api.post('/admin/positions', formData);
      }
      setShowAddModal(false);
      setEditingPosition(null);
      setFormData({ title: '', description: '', startTime: '', endTime: '' });
      fetchPositions();
    } catch (error) {
      console.error('Failed to save position:', error);
    }
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
    setFormData({
      title: position.title,
      description: position.description,
      startTime: new Date(position.startTime).toISOString().slice(0, 16),
      endTime: new Date(position.endTime).toISOString().slice(0, 16)
    });
    setShowAddModal(true);
  };

  const getStatusColor = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return 'bg-yellow-100 text-yellow-800';
    if (now > end) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return 'Upcoming';
    if (now > end) return 'Ended';
    return 'Active';
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
          <h1 className="text-2xl font-bold text-gray-900">Positions</h1>
          <p className="text-gray-600">Manage voting positions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Position</span>
        </button>
      </div>

      {/* Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {positions.map((position) => (
          <div key={position._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{position.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{position.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(position)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {new Date(position.startTime).toLocaleString()} - {new Date(position.endTime).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(position.startTime, position.endTime)}`}>
                  {getStatusText(position.startTime, position.endTime)}
                </span>
                <span className="text-sm text-gray-500">
                  {position.candidates.length} candidates
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Position Modal */}
      {showAddModal && (
        <Modal
          title={editingPosition ? 'Edit Position' : 'Add Position'}
          onClose={() => {
            setShowAddModal(false);
            setEditingPosition(null);
            setFormData({ title: '', description: '', startTime: '', endTime: '' });
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-input"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingPosition ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingPosition(null);
                  setFormData({ title: '', description: '', startTime: '', endTime: '' });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Positions;