import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface Company {
    name?: string;
}

interface Job {
    _id: string;
    title: string;
    company?: Company;
    status: string;
    type: string;
    location: string;
}

const AdminJobModeration: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [actionMsg, setActionMsg] = useState<string>('');

    useEffect(() => {
        setLoading(true);
        setError('');
        api.get('/jobs')
            .then(res => setJobs(res.data.jobs || res.data))
            .catch(() => setError('Failed to load jobs'))
            .finally(() => setLoading(false));
    }, [actionMsg]);

    const handleStatus = async (jobId: string, status: string) => {
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <section className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Job Moderation</h2>
            {actionMsg && <div className="text-green-600 mb-2">{actionMsg}</div>}
            <div className="overflow-x-auto">
                <table className="min-w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Title</th>
                            <th className="p-2 border">Company</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Type</th>
                            <th className="p-2 border">Location</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job._id}>
                                <td className="p-2 border">{job.title}</td>
                                <td className="p-2 border">{job.company?.name || '-'}</td>
                                <td className="p-2 border capitalize">{job.status}</td>
                                <td className="p-2 border">{job.type}</td>
                                <td className="p-2 border">{job.location}</td>
                                <td className="p-2 border flex gap-2">
                                    <button onClick={() => handleStatus(job._id, 'active')} className="bg-green-600 text-white px-2 py-1 rounded">Approve</button>
                                    <button onClick={() => handleStatus(job._id, 'closed')} className="bg-yellow-600 text-white px-2 py-1 rounded">Close</button>
                                    <button onClick={() => handleDelete(job._id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminJobModeration;
