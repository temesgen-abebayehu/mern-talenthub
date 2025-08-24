// src/pages/Company/CompanyListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyAPI } from '../../services/companyService';
import { useAuth } from '../../contexts/AuthContext';

const CompanyListPage = () => {
  interface Company {
    _id: string;
    name: string;
    legalDetails: string;
    status: string;
  }
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await companyAPI.getMyCompanies();
      setCompanies(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (companyId: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyAPI.deleteCompany(companyId);
        setCompanies(companies.filter(company => company._id !== companyId));
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to delete company');
      }
    }
  };

  if (user?.role !== 'companyOwner') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-2">You need to be a company owner to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Companies</h1>
        <Link
          to="/company/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Register New Company
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {companies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">You haven't registered any companies yet.</p>
          <Link
            to="/company/register"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Register Your First Company
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map(company => (
            <div key={company._id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
              <p className="text-gray-600 mb-4">{company.legalDetails}</p>

              <div className="mb-4">
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${company.status === 'approved' ? 'bg-green-100 text-green-800' :
                    company.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                  }`}>
                  {company.status?.toUpperCase()}
                </span>
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/company/${company._id}/jobs`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  View Jobs
                </Link>
                <Link
                  to={`/company/${company._id}/edit`}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(company._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyListPage;