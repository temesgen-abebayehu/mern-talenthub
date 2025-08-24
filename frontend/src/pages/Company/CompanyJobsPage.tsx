import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobAPI } from '../../services/jobService';
import { companyAPI } from '../../services/companyService';
import { useAuth } from '../../contexts/AuthContext';

interface Job {
  _id: string;
  title: string;
  type: string;
  location: string;
  status: string;
  applicationCount?: number;
  company?: string;
}
interface Company {
  _id: string;
  name: string;
}

const CompanyJobsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useAuth(); // user is not used, so just call useAuth() if needed for context

  useEffect(() => {
    const fetchCompanyJobs = async () => {
      try {
        const companiesResponse = await companyAPI.getMyCompanies();
        const companyData = companiesResponse.data.find((c: Company) => c._id === id);
        setCompany(companyData);
        const jobsResponse = await jobAPI.getAll();
        const filteredJobs = jobsResponse.data.filter((job: Job) => job.company === id);
        setJobs(filteredJobs);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch company jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyJobs();
  }, [id]);

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await jobAPI.update(jobId, { status: newStatus });
      setJobs(jobs.map(job =>
        job._id === jobId ? { ...job, status: newStatus } : job
      ));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update job status');
    }
  };

  const handleDelete = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.delete(jobId);
        setJobs(jobs.filter(job => job._id !== jobId));
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to delete job');
      }
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

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Company Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Jobs for {company.name}</h1>
          <p className="text-gray-600">Manage your job postings</p>
        </div>
        <Link
          to="/jobs/create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Job
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No jobs posted for this company yet.</p>
          <Link
            to="/jobs/create"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Your First Job
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map(job => (
                <tr key={job._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{job.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{job.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(job._id, e.target.value)}
                      className="text-sm rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                      <option value="hired">Hired</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/applications/job/${job._id}`}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      View Applications ({job.applicationCount || 0})
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      to={`/jobs/${job._id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompanyJobsPage;