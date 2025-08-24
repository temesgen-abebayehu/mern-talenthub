import React, { useEffect, useState } from 'react';
import JobFilters from '../../components/jobs/JobFilters';
import JobList from '../../components/jobs/JobList';
import api from '../../services/api';

import { Job } from '../../components/jobs/JobList';

interface Filters {
    [key: string]: string;
}

const Jobs: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filters, setFilters] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const limit = 9;

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setError('');
            try {
                const params = { ...filters, page, limit };
                const { data } = await api.get('/jobs', { params });
                setJobs(data.jobs);
                setTotal(data.total);
            } catch (err) {
                setError('Failed to load jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [filters, page]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
        setPage(1);
    };

    const handleJobClick = (job: Job) => {
        window.location.href = `/jobs/${job._id}`;
    };

    return (
        <section className="mt-10 max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-primary mb-6">Job Listings</h2>
            <JobFilters filters={filters} onChange={handleFilterChange} />
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <>
                    <JobList jobs={jobs} onJobClick={handleJobClick} />
                    <div className="flex justify-center mt-6 gap-2">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Prev</button>
                        <span>Page {page}</span>
                        <button disabled={page * limit >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Next</button>
                    </div>
                </>
            )}
        </section>
    );
};

export default Jobs;
