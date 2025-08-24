import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface JobAnalytics {
    applications: number;
    views: number;
    hires: number;
    [key: string]: any;
}

interface JobAnalyticsModalProps {
    jobId: string;
    open: boolean;
    onClose: () => void;
}

const JobAnalyticsModal: React.FC<JobAnalyticsModalProps> = ({ jobId, open, onClose }) => {
    const [analytics, setAnalytics] = useState<JobAnalytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open || !jobId) return;
        setLoading(true);
        setError('');
        api.get(`/jobs/${jobId}/analytics`)
            .then(res => setAnalytics(res.data))
            .catch(() => setError('Failed to load analytics'))
            .finally(() => setLoading(false));
    }, [open, jobId]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">&times;</button>
                <h3 className="text-xl font-bold mb-4">Job Analytics</h3>
                {loading && <div>Loading...</div>}
                {error && <div className="text-red-600">{error}</div>}
                {analytics && (
                    <ul className="text-gray-700">
                        <li>Applications: {analytics.applications}</li>
                        <li>Views: {analytics.views}</li>
                        <li>Hires: {analytics.hires}</li>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default JobAnalyticsModal;
