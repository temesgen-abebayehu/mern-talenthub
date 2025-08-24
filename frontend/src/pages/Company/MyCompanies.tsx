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

const MyCompanies: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const { data } = await api.get('/companies/my', {
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
    }, []);

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">My Companies</h2>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            <ul className="space-y-4">
                {companies.map(company => (
                    <li key={company._id} className="border rounded p-4">
                        <div className="font-semibold">{company.name}</div>
                        <div>Status: <span className={
                            company.status === 'approved' ? 'text-green-600' : company.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                        }>{company.status}</span></div>
                        <div>Legal: {company.legalDetails}</div>
                        <div>Documents: {company.documents?.join(', ')}</div>
                        {company.rejectionReason && <div className="text-red-500">Reason: {company.rejectionReason}</div>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyCompanies;
