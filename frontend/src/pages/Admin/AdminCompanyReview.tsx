import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface Company {
    _id: string;
    name: string;
    status: string;
    legalDetails?: string;
    documents?: string[];
    rejectionReason?: string;
}

const AdminCompanyReview: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [actionMsg, setActionMsg] = useState<string>('');

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const { data } = await api.get('/companies', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCompanies(data);
            } catch (err) {
                setError('Failed to load companies');
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, [actionMsg]);

    const handleReview = async (companyId: string, status: string) => {
        setActionMsg('');
        try {
            const token = localStorage.getItem('token');
            await api.post('/companies/review', { companyId, status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setActionMsg(`Company ${status}`);
        } catch (err) {
            setActionMsg('Action failed');
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Admin: Company Review</h2>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {actionMsg && <div className="text-green-600 mb-2">{actionMsg}</div>}
            <ul className="space-y-4">
                {companies.map(company => (
                    <li key={company._id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="font-semibold">{company.name}</div>
                            <div>Status: <span className={
                                company.status === 'approved' ? 'text-green-600' : company.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                            }>{company.status}</span></div>
                            <div>Legal: {company.legalDetails}</div>
                            <div>Documents: {company.documents?.join(', ')}</div>
                            {company.rejectionReason && <div className="text-red-500">Reason: {company.rejectionReason}</div>}
                        </div>
                        {company.status === 'pending' && (
                            <div className="flex gap-2 mt-4 md:mt-0">
                                <button onClick={() => handleReview(company._id, 'approved')} className="bg-green-600 text-white px-4 py-2 rounded">Approve</button>
                                <button onClick={() => handleReview(company._id, 'rejected')} className="bg-red-600 text-white px-4 py-2 rounded">Reject</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminCompanyReview;
