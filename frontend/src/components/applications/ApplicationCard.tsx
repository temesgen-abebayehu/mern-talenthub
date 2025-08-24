// src/components/applications/ApplicationCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';


interface Job {
  _id: string;
  title: string;
  company: string;
}

interface Application {
  _id: string;
  jobId: Job;
  createdAt: string;
  status: string;
  coverLetter?: string;
}

interface ApplicationCardProps {
  application: Application;
  onWithdraw: (id: string) => void;
  showActions?: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onWithdraw, showActions = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Link
            to={`/jobs/${application.jobId._id}`}
            className="text-lg font-semibold text-blue-600 hover:underline"
          >
            {application.jobId.title}
          </Link>

          <p className="text-gray-600 mt-1">{application.jobId.company}</p>

          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
            <span>Applied: {formatDate(application.createdAt)}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(application.status)}`}>
              {application.status}
            </span>
          </div>

          {application.coverLetter && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {application.coverLetter}
            </p>
          )}
        </div>

        {showActions && application.status === 'applied' && (
          <button
            onClick={() => onWithdraw(application._id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Withdraw
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;