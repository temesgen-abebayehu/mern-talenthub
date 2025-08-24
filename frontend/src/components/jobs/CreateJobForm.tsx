import React, { useState } from 'react';
import api from '../../services/api';

interface CreateJobFormProps {
    onJobCreated?: () => void;
}

interface JobFormState {
    title: string;
    description: string;
    requirements: string;
    skills: string;
    location: string;
    type: string;
    applicationDeadline: string;
}

const initialState: JobFormState = {
    title: '',
    description: '',
    requirements: '',
    skills: '',
    location: 'remote',
    type: 'full-time',
    applicationDeadline: '',
};

const CreateJobForm: React.FC<CreateJobFormProps> = ({ onJobCreated }) => {
    const [form, setForm] = useState<JobFormState>(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const payload = {
                ...form,
                requirements: form.requirements.split(',').map(r => r.trim()),
                skills: form.skills.split(',').map(s => s.trim()),
            };
            await api.post('/jobs', payload);
            setSuccess('Job created!');
            setForm(initialState);
            if (onJobCreated) onJobCreated();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to create job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded mb-8 shadow">
            <h3 className="text-xl font-semibold mb-4">Post a New Job</h3>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="title" value={form.title} onChange={handleChange} required placeholder="Job Title" className="border p-2 rounded" />
                <input name="type" value={form.type} onChange={handleChange} required placeholder="Type (full-time, part-time, contract)" className="border p-2 rounded" />
                <input name="location" value={form.location} onChange={handleChange} required placeholder="Location (remote, on-site, hybrid)" className="border p-2 rounded" />
                <input name="applicationDeadline" value={form.applicationDeadline} onChange={handleChange} type="date" placeholder="Application Deadline" className="border p-2 rounded" />
            </div>
            <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Description" className="border p-2 rounded w-full mt-4" />
            <input name="requirements" value={form.requirements} onChange={handleChange} placeholder="Requirements (comma separated)" className="border p-2 rounded w-full mt-2" />
            <input name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated)" className="border p-2 rounded w-full mt-2" />
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
                {loading ? 'Posting...' : 'Post Job'}
            </button>
        </form>
    );
};

export default CreateJobForm;
