// src/pages/Company/CompanyApplicationsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { applicationAPI } from '../../services/applicationService';
import ApplicationList from '../../components/applications/ApplicationList';

const CompanyApplicationsPage = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const response = await applicationAPI.getAll();
      const filtered = response.data.filter((app: any) => app.jobId?._id === jobId);
      setApplications(filtered);
      // Set job title from the first application (if exists)
      if (filtered.length > 0) {
        setJobTitle(filtered[0].jobId?.title);
      }
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold">
          Applications for {jobTitle || 'this Job'}
        </h1>
        <p className="text-gray-600 mt-2">
          {applications.length} application{applications.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <ApplicationList
        applications={applications}
        title={undefined} // Don't show default title
        onWithdraw={() => { }}
      />
    </div>
  );
};

export default CompanyApplicationsPage;