// src/components/applications/ApplicationList.jsx
import React from 'react';
import ApplicationCard from './ApplicationCard';

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

interface ApplicationListProps {
  applications: Application[];
  title?: string;
  onWithdraw: (id: string) => void;
}

const ApplicationList: React.FC<ApplicationListProps> = ({ applications, title = "Your Applications", onWithdraw }) => {
  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No applications found.</p>
      </div>
    );
  }

  return (
    <div>
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}

      <div className="space-y-4">
        {applications.map((application: Application) => (
          <ApplicationCard
            key={application._id}
            application={application}
            onWithdraw={onWithdraw}
          />
        ))}
      </div>
    </div>
  );
};

export default ApplicationList;