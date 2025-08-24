import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Job {
    _id: string;
    title: string;
    company: string;
    [key: string]: any;
}

interface JobContextType {
    jobs: Job[];
    setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
    loading: boolean;
    error: string | null;
    total: number;
    getJobs: (filters: any) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const useJobContext = (): JobContextType => {
    const context = useContext(JobContext);
    if (!context) {
        throw new Error('useJobContext must be used within a JobProvider');
    }
    return context;
};

interface JobProviderProps {
    children: ReactNode;
}

export const JobProvider: React.FC<JobProviderProps> = ({ children }) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);

    // Real getJobs implementation
    const { jobAPI } = require('../services/jobService');
    const getJobs = async (filters: any) => {
        setLoading(true);
        setError(null);
        try {
            // Only send non-empty filters
            const params: any = {};
            if (filters) {
                Object.keys(filters).forEach(key => {
                    if (filters[key]) params[key] = filters[key];
                });
            }
            const { data } = await jobAPI.getAll(params);
            setJobs(data.jobs || []);
            setTotal(data.total || 0);
        } catch (err: any) {
            setError('Failed to fetch jobs');
            setJobs([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    return (
        <JobContext.Provider value={{ jobs, setJobs, loading, error, total, getJobs }}>
            {children}
        </JobContext.Provider>
    );
};
