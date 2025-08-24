import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../services/jobService';
import { companyAPI, Company } from '../../services/companyService';
import { useAuth } from '../../contexts/AuthContext';

const JobCreatePage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        requirements: '',
        skills: '',
        location: 'remote',
        type: 'full-time',
        company: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await companyAPI.getMyCompanies();
                setCompanies(res.data.filter((c: Company) => c.status === 'approved'));
            } catch {
                setError('Failed to load companies');
            }
        };
        fetchCompanies();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await jobAPI.create({
                ...form,
                requirements: form.requirements.split(',').map(r => r.trim()),
                skills: form.skills.split(',').map(s => s.trim()),
            });
            setSuccess('Job created successfully!');
            // Redirect to the company's job list
            navigate(`/company/${form.company}/jobs`);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to create job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-xl">
            <h2 className="text-2xl font-bold mb-6">Create Job</h2>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {success && <div className="text-green-600 mb-4">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Company</label>
                    <select name="company" value={form.company} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                        <option value="">Select company</option>
                        {companies.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input name="title" value={form.title} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block font-medium mb-1">Requirements (comma separated)</label>
                    <input name="requirements" value={form.requirements} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block font-medium mb-1">Skills (comma separated)</label>
                    <input name="skills" value={form.skills} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block font-medium mb-1">Location</label>
                    <select name="location" value={form.location} onChange={handleChange} className="w-full border rounded px-3 py-2">
                        <option value="remote">Remote</option>
                        <option value="on-site">On-site</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>
                <div>
                    <label className="block font-medium mb-1">Type</label>
                    <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2">
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                    </select>
                </div>
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Creating...' : 'Create Job'}
                </button>
            </form>
        </div>
    );
};

export default JobCreatePage;
