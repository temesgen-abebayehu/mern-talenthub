// src/pages/Home/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';
import JobList from '../../components/jobs/JobList';

import JobFilters from '../../components/jobs/JobFilters';
import HeroSection from './HeroSection';


interface Filters {
  page: number;
  limit: number;
  keywords: string;
  type: string;
  location: string;
  sort: string;
}

// Fallback for useJobs if JobContext is missing
const useJobsFallback = () => ({
  jobs: [],
  loading: false,
  error: null,
  total: 0,
  getJobs: () => { }
});

let useJobsSafe: any;
try {
  useJobsSafe = useJobs;
} catch {
  useJobsSafe = useJobsFallback;
}

const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 12,
    keywords: '',
    type: '',
    location: '',
    sort: 'newest'
  });

  const { jobs, loading, error, total, getJobs } = useJobsSafe();

  useEffect(() => {
    getJobs(filters);
  }, [filters, getJobs]);

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, keywords: searchTerm, page: 1 }));
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection onSearch={handleSearch} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              <JobFilters
                filters={filters}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:w-3/4">
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

            <JobList jobs={jobs} onJobClick={() => { }} />

            {/* Pagination */}
            {total > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.ceil(total / filters.limit) }, (_, i) => i + 1)
                    .slice(Math.max(0, filters.page - 3), Math.min(Math.ceil(total / filters.limit), filters.page + 2))
                    .map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded border ${filters.page === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page >= Math.ceil(total / filters.limit)}
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
    </div>
  );
};

export default HomePage;