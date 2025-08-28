import React, { useState, useEffect } from 'react';
import { Download, Trophy, TrendingUp } from 'lucide-react';
import api from '../../services/api';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get('/admin/results');
      setResults(response.data.data);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      const response = await api.get('/admin/results/export/csv', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'voting-results.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export CSV:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Election Results</h1>
          <p className="text-gray-600">Live voting results and analytics</p>
        </div>
        <button
          onClick={exportCSV}
          className="btn-primary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Results by Position */}
      <div className="space-y-6">
        {results.map((result, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-full">
                  <Trophy className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{result.position}</h3>
                  <p className="text-sm text-gray-600">Total Votes: {result.totalVotes}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {result.candidates.map((candidate, candidateIndex) => (
                <div key={candidateIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {candidateIndex === 0 && result.totalVotes > 0 && (
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        #{candidateIndex + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{candidate.name}</p>
                      <p className="text-sm text-gray-600">ID: {candidate.studentId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{candidate.voteCount}</p>
                      <p className="text-sm text-gray-600">{candidate.percentage}%</p>
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${candidate.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="card text-center py-12">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
          <p className="text-gray-600">Results will appear here once voting begins.</p>
        </div>
      )}
    </div>
  );
};

export default Results;