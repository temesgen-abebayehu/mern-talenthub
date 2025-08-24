// src/pages/Company/CompanyRegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyAPI } from '../../services/companyService';
import { useAuth } from '../../contexts/AuthContext';

const CompanyRegisterPage = () => {
  const [formData, setFormData] = useState<{
    name: string;
    legalDetails: string;
    documents: File | null;
  }>({
    name: '',
    legalDetails: '',
    documents: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setFormData(prev => ({ ...prev, documents: file }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('legalDetails', formData.legalDetails);
      if (formData.documents) {
        formDataToSend.append('documents', formData.documents);
      }

      await companyAPI.registerCompany(formDataToSend);
      navigate('/company/my');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to register company');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is a company owner
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Register Your Company</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Company Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="legalDetails">
            Legal Details
          </label>
          <textarea
            id="legalDetails"
            name="legalDetails"
            value={formData.legalDetails}
            onChange={handleChange}
            required
            rows={4}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="documents">
            Legal Documents (PDF, DOC, DOCX)
          </label>
          <input
            type="file"
            id="documents"
            name="documents"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {formData.documents && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-600">{formData.documents.name}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !formData.documents}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register Company'}
        </button>
      </form>
    </div>
  );
};

export default CompanyRegisterPage;