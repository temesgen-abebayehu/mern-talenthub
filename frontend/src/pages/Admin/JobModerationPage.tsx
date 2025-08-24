// src/pages/Admin/JobModerationPage.tsx
import { useState, useEffect } from 'react';
import { jobAPI } from '../../services/jobService';
import JobModerationCard from '../../components/admin/JobModerationCard';

interface Job {
  _id: string;
  status: string;
  [key: string]: any;
}

const JobModerationPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed' | 'inappropriate'>('all');

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchJobs = async () => {
    try {
      const response = await jobAPI.getAll(); // Get all jobs
      let filteredJobs: Job[] = response.data.jobs;

      if (filter !== 'all') {
        filteredJobs = filteredJobs.filter((job: Job) => job.status === filter);
      }

      setJobs(filteredJobs);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobDelete = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await jobAPI.delete(jobId);
      // Refresh the list
      fetchJobs();
      alert('Job deleted successfully');
    } catch (error) {
      console.error('Failed to delete job', error);
      alert('Failed to delete job');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading jobs...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Moderation</h1>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-gray-600 text-white' : 'bg-gray-200'
              }`}
          >
            All Jobs
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-4 py-2 rounded ${filter === 'closed' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
          >
            Closed
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No jobs found</p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobModerationCard
              key={job._id}
              job={{
                id: job._id,
                title: job.title,
                company: job.company,
                status: job.status,
                postedAt: job.postedAt,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default JobModerationPage;