import React, { useState, ChangeEvent, FormEvent } from 'react';
import { companyAPI } from '../../services/companyService';

interface CompanyForm {
    name: string;
    legalDetails: string;
    documents: File[];
}

const CompanyRegistration: React.FC = () => {
    const [form, setForm] = useState<CompanyForm>({ name: '', legalDetails: '', documents: [] });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, documents: e.target.files ? Array.from(e.target.files) : [] });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            // Use FormData for file upload
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('legalDetails', form.legalDetails);
            form.documents.forEach((file) => formData.append('documents', file));
            await companyAPI.registerCompany(formData);
            setSuccess('Company submitted for approval.');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Company registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto flex flex-col gap-6 mt-8">
            <h2 className="text-2xl font-bold text-primary mb-2 text-center">Register Company</h2>
            <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Company Name" required className="border border-primary/30 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full" />
            <input name="legalDetails" type="text" value={form.legalDetails} onChange={handleChange} placeholder="Legal Details" required className="border border-primary/30 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full" />
            <input name="documents" type="file" multiple onChange={handleFileChange} className="border border-primary/30 rounded px-4 py-2 w-full" />
            {error && <div className="text-red-500 text-center">{error}</div>}
            {success && <div className="text-green-600 text-center">{success}</div>}
            <button type="submit" className="bg-primary hover:bg-secondary text-white font-semibold py-2 rounded transition w-full">Submit for Approval</button>
        </form>
    );
};

export default CompanyRegistration;
