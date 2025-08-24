import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const getNavItems = () => {
    const commonItems = [
      { path: '/', label: 'Home', icon: '🏠' },
      { path: '/jobs', label: 'Browse Jobs', icon: '🔍' },
    ];

    if (!user) return commonItems;

    if (user.role === 'admin') {
      return [
        ...commonItems,
        { path: '/admin', label: 'Dashboard', icon: '⚙️' },
        { path: '/admin/companies', label: 'Approvals', icon: '✅' },
      ];
    }

    if (user.role === 'companyOwner') {
      return [
        ...commonItems,
        { path: '/company/my', label: 'My Companies', icon: '🏢' },
        { path: '/jobs/create', label: 'Create Job', icon: '➕' },
        { path: '/jobs/my', label: 'Manage Jobs', icon: '🗂️' },
        { path: '/profile', label: 'Profile', icon: '👤' },
      ];
    }

    return [
      ...commonItems,
      { path: '/profile/applications', label: 'Applications', icon: '📝' },
      { path: '/profile', label: 'Profile', icon: '👤' },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleMenu}>
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2" onClick={toggleMenu}>
                  <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TH</span>
                  </div>
                  <span className="text-xl font-bold text-gray-800">TalentHub</span>
                </Link>
                <button onClick={toggleMenu} className="p-1 rounded-md hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <nav className="p-4">
              {user && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              )}

              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={toggleMenu}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                      }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="w-full mt-4 flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <span className="text-lg">🚪</span>
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="mt-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="block w-full text-center px-4 py-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMenu}
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavigation;