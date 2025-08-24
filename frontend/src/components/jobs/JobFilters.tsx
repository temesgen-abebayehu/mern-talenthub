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
    <div className="flex flex-wrap gap-4 mb-6">
        <input
            type="text"
            name="keywords"
            value={filters.keywords || ''}
            onChange={onChange}
            placeholder="Keywords"
            className="border rounded px-3 py-2 w-48"
        />
        <select name="type" value={filters.type || ''} onChange={onChange} className="border rounded px-3 py-2">
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
        </select>
        <select name="location" value={filters.location || ''} onChange={onChange} className="border rounded px-3 py-2">
            <option value="">All Locations</option>
            <option value="remote">Remote</option>
            <option value="on-site">On-site</option>
            <option value="hybrid">Hybrid</option>
        </select>
    </div>
);

export default JobFilters;
