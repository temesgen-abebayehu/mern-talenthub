import React from 'react';

export interface Filters {
    keywords?: string;
    type?: string;
    location?: string;
    [key: string]: any;
}

interface JobFiltersProps {
    filters: Filters;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}


const JobFilters: React.FC<JobFiltersProps> = ({ filters, onChange }) => (
    <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
            <label htmlFor="keywords" className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                Position/Keywords
            </label>
            <input
                type="text"
                id="keywords"
                name="keywords"
                value={filters.keywords || ''}
                onChange={onChange}
                placeholder="e.g. Developer, Designer"
                className="border border-gray-300 rounded-lg px-4 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
            />
        </div>
        <div className="flex flex-col">
            <label htmlFor="type" className="mb-1 text-sm font-medium text-gray-700">Type</label>
            <select
                id="type"
                name="type"
                value={filters.type || ''}
                onChange={onChange}
                className="border border-gray-300 rounded-lg px-4 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
            >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
            </select>
        </div>
        <div className="flex flex-col">
            <label htmlFor="location" className="mb-1 text-sm font-medium text-gray-700">Location</label>
            <select
                id="location"
                name="location"
                value={filters.location || ''}
                onChange={onChange}
                className="border border-gray-300 rounded-lg px-4 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
            >
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="on-site">On-site</option>
                <option value="hybrid">Hybrid</option>
            </select>
        </div>
    </div>
);

export default JobFilters;
