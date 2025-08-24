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
    const [applicationId, setApplicationId] = useState<string | null>(null);
    const [applyMsg, setApplyMsg] = useState<string>('');
    const { user } = useAuth() as { user: { role: string, id?: string } };

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

    useEffect(() => {
        // Check if user has applied for this job
        const checkApplied = async () => {
            if (!user || !user.id) return;
            try {
                const { data } = await api.get(`/applications/user/${user.id}`);
                const found = data.find((app: any) => app.jobId === id);
                if (found) {
                    setApplied(true);
                    setApplicationId(found._id);
                } else {
                    setApplied(false);
                    setApplicationId(null);
                }
            } catch {
                setApplied(false);
                setApplicationId(null);
            }
        };
        checkApplied();
    }, [id, user]);

    const handleApply = async (e: FormEvent) => {
        e.preventDefault();
        setApplyMsg('');
        try {
            await api.post('/applications', { jobId: id });
            setApplied(true);
            setApplyMsg('Application submitted!');
            // Refetch applicationId
            const { data } = await api.get(`/applications/user/${user.id}`);
            const found = data.find((app: any) => app.jobId === id);
            if (found) setApplicationId(found._id);
        } catch (err: any) {
            setApplyMsg(err?.response?.data?.message || 'Application failed');
        }
    };

    const handleWithdraw = async () => {
        setApplyMsg('');
        if (!applicationId) return;
        try {
            await api.delete(`/applications/${applicationId}`);
            setApplied(false);
            setApplicationId(null);
            setApplyMsg('Application withdrawn.');
        } catch (err: any) {
            setApplyMsg(err?.response?.data?.message || 'Failed to withdraw application');
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
            {user && user.role === 'user' && applied && (
                <div className="mt-4 flex flex-col gap-2">
                    <div className="text-green-600">You have applied for this job.</div>
                    <button onClick={handleWithdraw} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-max">Withdraw Application</button>
                </div>
            )}
            {applyMsg && <div className="mt-2 text-green-600">{applyMsg}</div>}
        </section>
    );
};

export default JobDetail;
