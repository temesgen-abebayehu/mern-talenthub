import React from 'react';

export interface Job {
    _id: string;
    title: string;
    company?: { name?: string } | string;
    type?: string;
    location?: string;
    status?: string;
    description?: string;
    [key: string]: any;
}

interface JobCardProps {
    job: Job;
    onClick?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => (
    <div className="border rounded p-4 shadow hover:shadow-lg transition cursor-pointer" onClick={onClick}>
        <div className="font-bold text-lg mb-1">{job.title}</div>
        <div className="text-gray-600 mb-1">{typeof job.company === 'object' ? job.company?.name : job.company || job.companyName}</div>
        <div className="text-sm text-gray-500 mb-1">{job.type} | {job.location}</div>
        <div className="text-sm text-gray-500 mb-1">Status: <span className={
            job.status === 'active' ? 'text-green-600' : job.status === 'closed' ? 'text-yellow-600' : 'text-blue-600'
        }>{job.status}</span></div>
        <div className="text-gray-700 mt-2 line-clamp-2">{job.description}</div>
    </div>
);

export default JobCard;
