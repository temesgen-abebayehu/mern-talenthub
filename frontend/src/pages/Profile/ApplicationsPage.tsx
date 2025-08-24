// src/pages/Profile/ApplicationsPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { applicationAPI } from '../../services/applicationService';
import ApplicationList from '../../components/applications/ApplicationList';

const ApplicationsPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, []);

  const fetchApplications = async () => {
    if (!user || !user._id) {
      setError('User not found');
      setLoading(false);
      return;
    }
    try {
      // Use backend endpoint to get only the current user's applications
      const response = await applicationAPI.getUserApplications(user._id);
      setApplications(response.data);
    } catch (error) {
      setError('Failed to fetch applications');
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      await applicationAPI.delete(applicationId);
      // Refresh the list
      fetchApplications();
    } catch (error) {
      setError('Failed to withdraw application');
      console.error('Failed to withdraw application', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Your Job Applications</h1>
        <p className="text-gray-600 mt-2">
          Track the status of all your job applications
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <ApplicationList
        applications={applications}
        onWithdraw={handleWithdraw}
      />
    </div>
  );
};

export default ApplicationsPage;