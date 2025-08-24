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

    // Dummy getJobs implementation (replace with real API call)
    const getJobs = (filters: any) => {
        setLoading(true);
        setError(null);
        // Simulate async fetch
        setTimeout(() => {
            setJobs([]); // Replace with fetched jobs
            setTotal(0); // Replace with fetched total
            setLoading(false);
        }, 500);
    };

    return (
        <JobContext.Provider value={{ jobs, setJobs, loading, error, total, getJobs }}>
            {children}
        </JobContext.Provider>
    );
};
