import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  user?: {
    role?: string;
    [key: string]: any;
  } | null;
  currentPath: string;
}

const Navigation: React.FC<NavigationProps> = ({ user, currentPath }) => {
  // Navigation items based on user role
  const getNavItems = () => {
    if (!user) return [];

    if (user.role === 'admin') {
      return [
        { path: '/admin', label: 'Admin Dashboard' },
        { path: '/admin/companies', label: 'Company Approval' },
      ];
    }

    if (user.role === 'companyOwner') {
      return [
        { path: '/company/my', label: 'My Companies' },
        { path: '/jobs/create', label: 'Create Job' },
        { path: '/jobs/my', label: 'Manage Jobs' },
      ];
    }

    // Regular user
    return [
      { path: '/profile/applications', label: 'My Applications' },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPath === item.path
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-blue-600'
            }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
