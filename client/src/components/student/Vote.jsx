import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, User, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Modal from '../Modal';

const Vote = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await api.get('/student/positions');
      setPositions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (positionId, candidateId) => {
    setVotingLoading(true);
    try {
      const response = await api.post('/voting/vote', {
        positionId,
        candidateId
      });
      
      setMessage(response.data.message);
      setTimeout(() => setMessage(''), 5000);
      
      // Refresh positions to update voting status
      await fetchPositions();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to cast vote');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setVotingLoading(false);
      setShowConfirmModal(false);
      setSelectedCandidate(null);
    }
  };

  const openConfirmModal = (candidate, position) => {
    setSelectedCandidate({ candidate, position });
    setShowConfirmModal(true);
  };

  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cast Your Vote</h1>
        <p className="text-gray-600">Choose your candidates for each position</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message}
        </div>
      )}

      {/* Voting Positions */}
      <div className="space-y-6">
        {positions.length > 0 ? (
          positions.map((position) => (
            <div key={position._id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{position.title}</h3>
                  <p className="text-sm text-gray-600">{position.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {formatTimeRemaining(position.endTime)}
                  </span>
                </div>
              </div>

              {/* Check if user has voted */}
              {position.hasVoted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      Thank you for voting! You have already cast your vote for this position.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {position.candidates.map((candidate) => (
                    <div key={candidate._id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                          <p className="text-sm text-gray-600">ID: {candidate.studentId}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{candidate.description}</p>
                      {candidate.manifesto && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <h5 className="text-sm font-medium text-gray-900 mb-1">Manifesto:</h5>
                          <p className="text-sm text-gray-700">{candidate.manifesto}</p>
                        </div>
                      )}
                      <button
                        onClick={() => openConfirmModal(candidate, position)}
                        disabled={votingLoading}
                        className="w-full btn-primary disabled:opacity-50"
                      >
                        {votingLoading ? 'Voting...' : 'Vote for this candidate'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Voting</h3>
            <p className="text-gray-600">No voting positions are currently active.</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedCandidate && (
        <Modal
          title="Confirm Your Vote"
          onClose={() => {
            setShowConfirmModal(false);
            setSelectedCandidate(null);
          }}
        >
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">You are voting for:</h4>
              <p className="text-blue-800">
                <strong>{selectedCandidate.candidate.name}</strong> for <strong>{selectedCandidate.position.title}</strong>
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-800 font-medium">Important:</span>
              </div>
              <p className="text-yellow-800 mt-1">
                You can only vote once per position. This action cannot be undone.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleVote(selectedCandidate.position._id, selectedCandidate.candidate._id)}
                disabled={votingLoading}
                className="btn-primary disabled:opacity-50"
              >
                {votingLoading ? 'Casting Vote...' : 'Confirm Vote'}
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedCandidate(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Vote;