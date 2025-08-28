import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import api from '../../services/api';
import Modal from '../Modal';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    positionId: '',
    description: '',
    manifesto: ''
  });

  useEffect(() => {
    fetchCandidates();
    fetchPositions();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await api.get('/admin/candidates');
      setCandidates(response.data.data);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await api.get('/admin/positions');
      setPositions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCandidate) {
        await api.put(`/admin/candidates/${editingCandidate._id}`, formData);
      } else {
        await api.post('/admin/candidates', formData);
      }
      setShowAddModal(false);
      setEditingCandidate(null);
      setFormData({ name: '', studentId: '', positionId: '', description: '', manifesto: '' });
      fetchCandidates();
    } catch (error) {
      console.error('Failed to save candidate:', error);
    }
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      name: candidate.name,
      studentId: candidate.studentId,
      positionId: candidate.position._id,
      description: candidate.description,
      manifesto: candidate.manifesto
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await api.delete(`/admin/candidates/${id}`);
        fetchCandidates();
      } catch (error) {
        console.error('Failed to delete candidate:', error);
      }
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
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600">Manage election candidates</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Candidate</span>
        </button>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                  <p className="text-sm text-gray-600">ID: {candidate.studentId}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(candidate)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(candidate._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Position:</span>
                <p className="text-sm text-gray-600">{candidate.position.title}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Description:</span>
                <p className="text-sm text-gray-600">{candidate.description}</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium text-primary-600">
                  Votes: {candidate.voteCount}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  candidate.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {candidate.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Candidate Modal */}
      {showAddModal && (
        <Modal
          title={editingCandidate ? 'Edit Candidate' : 'Add Candidate'}
          onClose={() => {
            setShowAddModal(false);
            setEditingCandidate(null);
            setFormData({ name: '', studentId: '', positionId: '', description: '', manifesto: '' });
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={formData.positionId}
                onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                className="form-input"
                required
              >
                <option value="">Select Position</option>
                {positions.map((position) => (
                  <option key={position._id} value={position._id}>
                    {position.title}
                  </option>
                ))}
              </select>
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
                Manifesto
              </label>
              <textarea
                value={formData.manifesto}
                onChange={(e) => setFormData({ ...formData, manifesto: e.target.value })}
                className="form-input"
                rows={4}
                placeholder="Candidate's manifesto and promises..."
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingCandidate ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCandidate(null);
                  setFormData({ name: '', studentId: '', positionId: '', description: '', manifesto: '' });
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

export default Candidates;