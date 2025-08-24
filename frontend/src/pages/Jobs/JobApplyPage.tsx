import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const JobApplyPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        education: '',
        coverLetter: '',
        gender: '',
        resume: null as File | null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as any;
        if (name === 'resume' && files && files[0]) {
            setForm(f => ({ ...f, resume: files[0] }));
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('jobId', id || '');
            formData.append('education', form.education);
            formData.append('coverLetter', form.coverLetter);
            formData.append('gender', form.gender);
            if (form.resume) formData.append('resume', form.resume);
            await api.post('/applications', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccess('Application submitted successfully!');
            setTimeout(() => navigate('/jobs/' + id), 1500);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Application failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Apply for Job</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Resume (PDF/DOC)</label>
                    <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleChange} required className="block w-full" />
                </div>
                <div>
                    <label className="block font-medium mb-1">Education</label>
                    <input type="text" name="education" value={form.education} onChange={handleChange} required className="block w-full border rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block font-medium mb-1">Cover Letter</label>
                    <textarea name="coverLetter" value={form.coverLetter} onChange={handleChange} required className="block w-full border rounded px-3 py-2" rows={4} />
                </div>
                <div>
                    <label className="block font-medium mb-1">Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} required className="block w-full border rounded px-3 py-2">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                {error && <div className="text-red-600">{error}</div>}
                {success && <div className="text-green-600">{success}</div>}
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Application'}
                </button>
            </form>
        </section>
    );
};

export default JobApplyPage;
