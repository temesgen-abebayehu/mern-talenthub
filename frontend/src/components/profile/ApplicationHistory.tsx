import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../../services/applicationService';
import ApplicationCard from '../applications/ApplicationCard';

interface Job {
  _id: string;
  title: string;
  company: string;
}

interface Application {
  _id: string;
  jobId: Job;
  createdAt: string;
  status: string;
  coverLetter?: string;
}

interface ApplicationHistoryProps {
  userId: string;
}

const ApplicationHistory: React.FC<ApplicationHistoryProps> = ({ userId }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationAPI.getUserApplications(userId);
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications', error);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    try {
      await applicationAPI.withdrawApplication(applicationId);
      setApplications(applications.filter(app => app._id !== applicationId));
    } catch (error) {
      console.error('Failed to withdraw application', error);
      alert('Failed to withdraw application');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Application History</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Application History</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Application History</h2>
      {applications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't applied to any jobs yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application: Application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onWithdraw={handleWithdraw}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationHistory;