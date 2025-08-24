// src/components/admin/CompanyApprovalCard.jsx
import React, { useState } from 'react';

interface Company {
  _id: string;
  name: string;
  legalDetails?: string;
  owner?: {
    name?: string;
    email?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  documents?: string[];
}

interface CompanyApprovalCardProps {
  company: Company;
  onStatusUpdate: (id: string, status: 'approved' | 'rejected', reason?: string) => Promise<void>;
}

const CompanyApprovalCard: React.FC<CompanyApprovalCardProps> = ({ company, onStatusUpdate }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await onStatusUpdate(company._id, 'approved');
    setLoading(false);
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    await onStatusUpdate(company._id, 'rejected', reason);
    setLoading(false);
    setReason('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{company.name}</h3>
          <p className="text-gray-600">{company.legalDetails}</p>
          <p className="text-sm text-gray-500">Registered by: {company.owner?.name}</p>
          <p className="text-sm text-gray-500">Email: {company.owner?.email}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${company.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            company.status === 'approved' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
          }`}>
          {company.status}
        </span>
      </div>

      {company.documents && company.documents.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Documents:</h4>
          <div className="flex space-x-2">
            {company.documents.map((doc: string, index: number) => (
              <a
                key={index}
                href={doc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Document {index + 1}
              </a>
            ))}
          </div>
        </div>
      )}

      {company.status === 'pending' && (
        <div className="mt-4">
          <div className="mb-3">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Reason for rejection (required if rejecting):
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Provide reason for rejection..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Approving...' : 'Approve'}
            </button>
            <button
              onClick={handleReject}
              disabled={loading || !reason.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Rejecting...' : 'Reject'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyApprovalCard;