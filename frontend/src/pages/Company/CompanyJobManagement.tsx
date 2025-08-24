import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import JobApplicationsModal from '../../components/jobs/JobApplicationsModal';
import JobAnalyticsModal from '../../components/jobs/JobAnalyticsModal';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Job {
    _id: string;
    title: string;
    status: string;
    type: string;
    location: string;
}

const CompanyJobManagement = forwardRef<any, {}>((props, ref) => {
    const { user } = useAuth() as { user: { _id: string } };
    const [jobs, setJobs] = useState<Job[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionMsg, setActionMsg] = useState('');
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [analyticsJobId, setAnalyticsJobId] = useState<string>('');

    const fetchJobs = async () => {
        if (!user) return;
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get(`/jobs/employer/${user._id}`);
            setJobs(data);
        } catch {
            setError('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        // eslint-disable-next-line
    }, [user, actionMsg]);

    useImperativeHandle(ref, () => ({
        refreshJobs: fetchJobs
    }));

    const handleStatusChange = async (jobId: string, status: string) => {
        setActionMsg('');
        try {
            await api.put(`/jobs/${jobId}`, { status });
            setActionMsg('Status updated');
        } catch {
            setActionMsg('Failed to update status');
        }
    };

    const handleDelete = async (jobId: string) => {
        setActionMsg('');
        try {
            await api.delete(`/jobs/${jobId}`);
            setActionMsg('Job deleted');
        } catch {
            setActionMsg('Failed to delete job');
        }
    };

    if (!user) return <div className="text-center mt-10">Please log in as a company owner.</div>;
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <section className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">My Job Postings</h2>
            {actionMsg && <div className="text-green-600 mb-2">{actionMsg}</div>}
            {jobs.length === 0 ? (
                <div>No jobs found.</div>
            ) : (
                <ul className="space-y-4">
                    {jobs.map(job => (
                        <li key={job._id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="font-semibold">{job.title}</div>
                                <div>Status: <span className={
                                    job.status === 'active' ? 'text-green-600' : job.status === 'closed' ? 'text-yellow-600' : 'text-blue-600'
                                }>{job.status}</span></div>
                                <div>{job.type} | {job.location}</div>
                            </div>
                            <div className="flex gap-2 mt-2 md:mt-0">
                                <button onClick={() => handleStatusChange(job._id, 'active')} className="bg-green-600 text-white px-3 py-1 rounded">Active</button>
                                <button onClick={() => handleStatusChange(job._id, 'closed')} className="bg-yellow-600 text-white px-3 py-1 rounded">Closed</button>
                                <button onClick={() => handleStatusChange(job._id, 'hired')} className="bg-blue-600 text-white px-3 py-1 rounded">Hired</button>
                                <button onClick={() => handleDelete(job._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                                <button onClick={() => { setSelectedJobId(job._id || ''); setShowModal(true); }} className="bg-gray-700 text-white px-3 py-1 rounded">View Applications</button>
                                <button onClick={() => { setAnalyticsJobId(job._id || ''); setShowAnalytics(true); }} className="bg-indigo-600 text-white px-3 py-1 rounded">Analytics</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {selectedJobId && <JobApplicationsModal jobId={selectedJobId} open={showModal} onClose={() => setShowModal(false)} />}
            {analyticsJobId && <JobAnalyticsModal jobId={analyticsJobId} open={showAnalytics} onClose={() => setShowAnalytics(false)} />}
        </section>
    );
});

export default CompanyJobManagement;
