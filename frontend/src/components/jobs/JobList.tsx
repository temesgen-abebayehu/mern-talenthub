import React from 'react';
import JobCard from './JobCard';

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

interface JobListProps {
    jobs: Job[];
    onJobClick: (job: Job) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, onJobClick }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map(job => (
            <JobCard key={job._id} job={job} onClick={() => onJobClick(job)} />
        ))}
    </div>
);

export default JobList;
