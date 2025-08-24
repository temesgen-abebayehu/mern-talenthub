// src/pages/Home/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';



interface HeroSectionProps {
  onSearch: (searchTerm: string) => void;
}

// Fallback for useAuth if AuthContext is missing
const useAuthFallback = () => ({ user: null });
let useAuthSafe: any;
try {
  useAuthSafe = useAuth;
} catch {
  useAuthSafe = useAuthFallback;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const { user } = useAuthSafe();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Discover thousands of job opportunities from top companies.
          Start your career journey today.
        </p>

        {/* SearchBar removed: implement or import if needed */}
        <div className="max-w-2xl mx-auto mb-8">
          {/* <SearchBar onSearch={onSearch} placeholder="Search jobs by title, company, or keywords..." /> */}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!user ? (
            <>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Sign Up - It's Free
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
            </>
          ) : user.role === 'companyOwner' ? (
            <Link
              to="/jobs/create"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Post a Job
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;