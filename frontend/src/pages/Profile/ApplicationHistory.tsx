import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Application {
    _id: string;
    jobId?: { title?: string };
    jobTitle?: string;
    status: string;
    createdAt: string;
    feedback?: string;
}

const ApplicationHistory: React.FC = () => {
    const { user } = useAuth() as { user: { _id: string } };
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!user) return;
        const fetchApplications = async () => {
            setLoading(true);
            setError('');
            try {
                const { data } = await api.get(`/applications/user/${user._id}`);
                setApplications(data);
            } catch {
                setError('Failed to load applications');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [user]);

    if (!user) return <div className="text-center mt-10">Please log in to view your applications.</div>;
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <section className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">My Applications</h2>
            {applications.length === 0 ? (
                <div>No applications found.</div>
            ) : (
                <ul className="space-y-4">
                    {applications.map(app => (
                        <li key={app._id} className="border rounded p-4">
                            <div className="font-semibold">Job: {app.jobId?.title || app.jobTitle}</div>
                            <div>Status: <span className={
                                app.status === 'applied' ? 'text-blue-600' : app.status === 'hired' ? 'text-green-600' : 'text-gray-600'
                            }>{app.status}</span></div>
                            <div>Applied: {new Date(app.createdAt).toLocaleDateString()}</div>
                            {app.feedback && <div>Feedback: {app.feedback}</div>}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default ApplicationHistory;
