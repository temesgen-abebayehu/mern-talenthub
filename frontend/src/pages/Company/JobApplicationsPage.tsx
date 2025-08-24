import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

interface Applicant {
    name?: string;
    email?: string;
}

interface Application {
    _id: string;
    applicant?: Applicant;
    createdAt: string;
    status: string;
    coverLetter?: string;
    notes?: string[];
}

const JobApplicationsPage: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!jobId) return;
        setLoading(true);
        setError('');
        api.get(`/jobs/${jobId}/applications`)
            .then(res => setApplications(res.data))
            .catch(() => setError('Failed to load applications'))
            .finally(() => setLoading(false));
    }, [jobId]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Job Applications</h2>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {!loading && applications.length === 0 && <div>No applications found.</div>}
            <ul className="space-y-4">
                {applications.map(app => (
                    <li key={app._id} className="border rounded p-4">
                        <div className="font-semibold">{app.applicant?.name || 'Unknown Applicant'}</div>
                        <div className="text-sm text-gray-600">{app.applicant?.email}</div>
                        <div className="text-xs text-gray-500">Applied: {new Date(app.createdAt).toLocaleString()}</div>
                        <div>Status: <span className="font-medium">{app.status}</span></div>
                        {app.coverLetter && <div className="mt-2"><span className="font-medium">Cover Letter:</span> {app.coverLetter}</div>}
                        {app.notes && app.notes.length > 0 && (
                            <div className="mt-2">
                                <span className="font-medium">Notes:</span>
                                <ul className="list-disc ml-6">
                                    {app.notes.map((note, idx) => <li key={idx}>{note}</li>)}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JobApplicationsPage;
