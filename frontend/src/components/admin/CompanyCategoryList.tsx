import React, { useEffect, useState } from 'react';
import { companyAPI, Company } from '../../services/companyService';
import CompanyApprovalCard from './CompanyApprovalCard';

const CompanyCategoryList: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await companyAPI.getAllCompanies();
            setCompanies(response.data);
        } catch (err: any) {
            setError('Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (companyId: string, status: 'approved' | 'rejected', reason?: string) => {
        try {
            await companyAPI.reviewCompany({ companyId, status, reason });
            fetchCompanies();
        } catch (err) {
            alert('Failed to update company status');
        }
    };

    if (loading) return <div>Loading companies...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    const pendingCompanies = companies.filter((c) => c.status === 'pending');

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-2">Pending Companies</h3>
                {pendingCompanies.length === 0 ? (
                    <div className="text-gray-500">No pending companies.</div>
                ) : (
                    <div className="space-y-4">
                        {pendingCompanies.map((company) => (
                            <CompanyApprovalCard
                                key={company._id}
                                company={company}
                                onStatusUpdate={handleStatusUpdate}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyCategoryList;
