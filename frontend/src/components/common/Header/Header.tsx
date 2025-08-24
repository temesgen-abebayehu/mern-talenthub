// src/components/common/Header/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Navigation from './Navigation';
import UserMenu from './UserMenu';
import MobileNavigation from './MobileNavigation';

const Header = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xl">TH</span>
            </div>
            <span className="text-2xl font-bold text-gray-800 hidden sm:block">TalentHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <Navigation user={user} currentPath={location.pathname} />
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile Navigation Button */}
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;