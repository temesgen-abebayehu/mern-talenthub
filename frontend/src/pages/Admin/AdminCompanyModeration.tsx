import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface Owner {
    email?: string;
}

interface Company {
    _id: string;
    name: string;
    owner?: Owner;
    isApproved: boolean;
}

const AdminCompanyModeration: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [actionMsg, setActionMsg] = useState<string>('');

    useEffect(() => {
        setLoading(true);
        setError('');
        api.get('/companies')
            .then(res => setCompanies(res.data))
            .catch(() => setError('Failed to load companies'))
            .finally(() => setLoading(false));
    }, [actionMsg]);

    const handleStatus = async (companyId: string, isApproved: boolean) => {
        setActionMsg('');
        try {
            await api.put(`/companies/${companyId}/approve`, { isApproved });
            setActionMsg(isApproved ? 'Company approved' : 'Company rejected');
        } catch {
            setActionMsg('Failed to update company status');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <section className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Company Moderation</h2>
            {actionMsg && <div className="text-green-600 mb-2">{actionMsg}</div>}
            <div className="overflow-x-auto">
                <table className="min-w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Owner</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(company => (
                            <tr key={company._id}>
                                <td className="p-2 border">{company.name}</td>
                                <td className="p-2 border">{company.owner?.email || '-'}</td>
                                <td className="p-2 border">{company.isApproved ? 'Approved' : 'Pending'}</td>
                                <td className="p-2 border flex gap-2">
                                    {!company.isApproved && (
                                        <>
                                            <button onClick={() => handleStatus(company._id, true)} className="bg-green-600 text-white px-2 py-1 rounded">Approve</button>
                                            <button onClick={() => handleStatus(company._id, false)} className="bg-red-600 text-white px-2 py-1 rounded">Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminCompanyModeration;
