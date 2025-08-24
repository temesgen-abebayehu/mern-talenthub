import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
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

interface JobApplicationsModalProps {
    jobId: string;
    open: boolean;
    onClose: () => void;
}

const JobApplicationsModal: React.FC<JobApplicationsModalProps> = ({ jobId, open, onClose }) => {
    const { user } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
    const [noteMsgs, setNoteMsgs] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!open || !jobId) return;
        setLoading(true);
        setError('');
        api.get(`/jobs/${jobId}/applications`)
            .then(res => setApplications(res.data))
            .catch(() => setError('Failed to load applications'))
            .finally(() => setLoading(false));
    }, [open, jobId, noteMsgs]);

    const handleNoteChange = (appId: string, value: string) => {
        setNoteInputs(inputs => ({ ...inputs, [appId]: value }));
    };

    const handleAddNote = async (appId: string) => {
        if (!noteInputs[appId]) return;
        setNoteMsgs(msgs => ({ ...msgs, [appId]: 'Saving...' }));
        try {
            await api.post(`/applications/${appId}/notes`, { note: noteInputs[appId] });
            setNoteMsgs(msgs => ({ ...msgs, [appId]: 'Note added!' }));
            setNoteInputs(inputs => ({ ...inputs, [appId]: '' }));
        } catch {
            setNoteMsgs(msgs => ({ ...msgs, [appId]: 'Failed to add note' }));
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">&times;</button>
                <h3 className="text-xl font-bold mb-4">Applications</h3>
                {loading && <div>Loading...</div>}
                {error && <div className="text-red-600">{error}</div>}
                {!loading && !error && applications.length === 0 && <div>No applications found.</div>}
                {!loading && !error && applications.length > 0 && (
                    <ul className="divide-y">
                        {applications.map(app => (
                            <li key={app._id} className="py-3">
                                <div className="font-semibold">{app.applicant?.name || app.applicant?.email}</div>
                                <div>Email: {app.applicant?.email}</div>
                                <div>Applied: {new Date(app.createdAt).toLocaleString()}</div>
                                <div>Status: <span className="capitalize">{app.status}</span></div>
                                {app.coverLetter && <div className="mt-1">Cover Letter: {app.coverLetter}</div>}
                                <div className="mt-2">
                                    <div className="font-semibold text-sm">Notes:</div>
                                    <ul className="list-disc ml-5 text-xs text-gray-700">
                                        {app.notes && app.notes.length > 0 ? app.notes.map((n, i) => (
                                            <li key={i}>{n}</li>
                                        )) : <li className="italic text-gray-400">No notes yet.</li>}
                                    </ul>
                                    {(user?.role === 'companyOwner' || user?.role === 'admin') && (
                                        <form onSubmit={e => { e.preventDefault(); handleAddNote(app._id); }} className="flex gap-2 mt-1">
                                            <input
                                                type="text"
                                                value={noteInputs[app._id] || ''}
                                                onChange={e => handleNoteChange(app._id, e.target.value)}
                                                placeholder="Add note"
                                                className="border rounded px-2 py-1 text-xs"
                                            />
                                            <button type="submit" className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Add</button>
                                            {noteMsgs[app._id] && <span className="text-xs ml-2 text-green-600">{noteMsgs[app._id]}</span>}
                                        </form>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default JobApplicationsModal;
