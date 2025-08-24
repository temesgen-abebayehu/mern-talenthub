// src/pages/Admin/CompanyApprovalPage.jsx
import React, { useState, useEffect } from 'react';
import { companyAPI, Company } from '../../services/companyService';
import CompanyApprovalCard from '../../components/admin/CompanyApprovalCard';

const CompanyApprovalPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  useEffect(() => {
    fetchCompanies();
  }, [filter]);

  const fetchCompanies = async () => {
    try {
      const response = await companyAPI.getAllCompanies();
      const filteredCompanies = (response.data as Company[]).filter((company: Company) =>
        filter === 'all' ? true : company.status === filter
      );
      setCompanies(filteredCompanies);
    } catch (error) {
      console.error('Failed to fetch companies', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (companyId: string, status: string, reason: string = '') => {
    try {
      await companyAPI.reviewCompany({ companyId, status, reason });
      // Refresh the list
      fetchCompanies();
    } catch (error) {
      console.error('Failed to update company status', error);
      alert('Failed to update company status');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading companies...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Company Approvals</h1>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200'
              }`}
          >
            Rejected
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-gray-600 text-white' : 'bg-gray-200'
              }`}
          >
            All
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {companies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No companies found with status: {filter}</p>
          </div>
        ) : (
          companies.map((company: Company) => (
            <CompanyApprovalCard
              key={company._id}
              company={company}
              onStatusUpdate={handleStatusUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyApprovalPage;