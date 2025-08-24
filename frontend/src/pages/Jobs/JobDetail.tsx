import React, { useEffect, useState, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Job {
    _id: string;
    title: string;
    company?: { name?: string };
    companyName?: string;
    type: string;
    location: string;
    description: string;
    status: string;
}

const JobDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [applied, setApplied] = useState<boolean>(false);
    const [applyMsg, setApplyMsg] = useState<string>('');
    const { user } = useAuth() as { user: { role: string } };

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            setError('');
            try {
                const { data } = await api.get(`/jobs/${id}`);
                setJob(data);
            } catch {
                setError('Job not found');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async (e: FormEvent) => {
        e.preventDefault();
        setApplyMsg('');
        try {
            await api.post('/applications', { jobId: id });
            setApplied(true);
            setApplyMsg('Application submitted!');
        } catch (err: any) {
            setApplyMsg(err?.response?.data?.message || 'Application failed');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!job) return null;

    return (
        <section className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
            <div className="text-gray-600 mb-2">{job.company?.name || job.companyName}</div>
            <div className="text-sm text-gray-500 mb-2">{job.type} | {job.location}</div>
            <div className="mb-4">{job.description}</div>
            <div className="mb-4">Status: <span className={
                job.status === 'active' ? 'text-green-600' : job.status === 'closed' ? 'text-yellow-600' : 'text-blue-600'
            }>{job.status}</span></div>
            {user && user.role === 'user' && job.status === 'active' && !applied && (
                <form onSubmit={handleApply} className="mt-4">
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Apply</button>
                </form>
            )}
            {applyMsg && <div className="mt-2 text-green-600">{applyMsg}</div>}
            {applied && <div className="mt-2 text-green-600">You have applied for this job.</div>}
        </section>
    );
};

export default JobDetail;
