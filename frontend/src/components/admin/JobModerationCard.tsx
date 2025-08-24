import React from 'react';

interface JobModerationCardProps {
    job: {
        id: string;
        title: string;
        company: string;
        status: string;
        postedAt: string;
    };
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
}

const JobModerationCard: React.FC<JobModerationCardProps> = ({ job, onApprove, onReject }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
                <div className="font-bold text-lg">{job.title}</div>
                <div className="text-gray-500">{job.company}</div>
                <div className="text-xs text-gray-400">Posted: {job.postedAt}</div>
                <div className="text-xs mt-1">Status: <span className="font-semibold">{job.status}</span></div>
            </div>
            <div className="mt-2 md:mt-0 flex gap-2">
                <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => onApprove && onApprove(job.id)}
                >
                    Approve
                </button>
                <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => onReject && onReject(job.id)}
                >
                    Reject
                </button>
            </div>
        </div>
    );
};

export default JobModerationCard;
