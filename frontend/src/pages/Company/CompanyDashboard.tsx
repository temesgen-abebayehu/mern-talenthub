import React, { useRef } from 'react';
import CompanyJobManagement from '../../pages/Company/CompanyJobManagement';
import CreateJobForm from '../../components/jobs/CreateJobForm';

const CompanyDashboard: React.FC = () => {
    // Use a ref to trigger job list refresh after job creation
    const jobMgmtRef = useRef<any>(null);
    const handleJobCreated = () => {
        if (jobMgmtRef.current && jobMgmtRef.current.refreshJobs) {
            jobMgmtRef.current.refreshJobs();
        }
    };
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-6xl mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Company Dashboard</h1>
                <CreateJobForm onJobCreated={handleJobCreated} />
                <CompanyJobManagement ref={jobMgmtRef} />
            </div>
        </div>
    );
};

export default CompanyDashboard;
