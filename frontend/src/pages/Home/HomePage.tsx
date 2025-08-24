// src/pages/Home/HomePage.tsx
import React, { useEffect, useState } from 'react';
import JobFilters from '../../components/jobs/JobFilters';
import JobList from '../../components/jobs/JobList';
import api from '../../services/api';
import { setQueryParams } from '../../utils/queryParams';
import HeroSection from './HeroSection';

interface Filters {
  [key: string]: string | number;
}

const HomePage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 12,
    keywords: '',
    type: '',
    location: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    window.history.replaceState({}, '', window.location.pathname);
    fetchJobs(filters);
    // eslint-disable-next-line
  }, []);

  const fetchJobs = async (filtersObj: Filters) => {
    setLoading(true);
    setError('');
    const params: any = {};
    Object.keys(filtersObj).forEach(key => {
      if (filtersObj[key] !== '' && filtersObj[key] !== undefined) params[key] = filtersObj[key];
    });
    setQueryParams(params);
    try {
      const { data } = await api.get('/jobs', { params });
      setJobs(data.jobs);
      setTotal(data.total);
    } catch {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  const handleSearch = () => {
    setFilters(f => {
      const updated = { ...f, page: 1 };
      fetchJobs(updated);
      return updated;
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters(f => {
      const updated = { ...f, page: newPage };
      fetchJobs(updated);
      return updated;
    });
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection onSearch={handleSearch} />
      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <form
            className="flex flex-col md:flex-row md:items-end md:gap-8 gap-4"
            onSubmit={e => { e.preventDefault(); handleSearch(); }}
          >
            <div className="flex-1">
              <JobFilters filters={filters} onChange={handleFilterChange} />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow font-semibold transition-colors duration-150"
                style={{ minWidth: 120 }}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  Search
                </span>
              </button>
            </div>
          </form>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {filters.keywords ? `Search Results for "${filters.keywords}"` : 'Latest Jobs'}
            </h2>
            <div className="text-sm text-gray-600">
              {total > 0 ? `${total} job${total !== 1 ? 's' : ''} found` : 'No jobs found'}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              Failed to load jobs. Please try again.
            </div>
          )}

          <JobList jobs={jobs} onJobClick={job => window.location.href = `/jobs/${job._id}`} />

          {/* Pagination */}
          {total > 0 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(Number(filters.page) - 1)}
                  disabled={Number(filters.page) === 1}
                  className="px-3 py-1 rounded border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                {Array.from({ length: Math.ceil(total / Number(filters.limit)) }, (_, i) => i + 1)
                  .slice(Math.max(0, Number(filters.page) - 3), Math.min(Math.ceil(total / Number(filters.limit)), Number(filters.page) + 2))
                  .map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded border ${Number(filters.page) === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                <button
                  onClick={() => handlePageChange(Number(filters.page) + 1)}
                  disabled={Number(filters.page) >= Math.ceil(total / Number(filters.limit))}
                  className="px-3 py-1 rounded border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
