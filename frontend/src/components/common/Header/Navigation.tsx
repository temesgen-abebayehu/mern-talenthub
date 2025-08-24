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
    const commonItems = [
      { path: '/', label: 'Home' },
      { path: '/jobs', label: 'Browse Jobs' },
    ];

    if (!user) return commonItems;

    if (user.role === 'admin') {
      return [
        ...commonItems,
        { path: '/admin', label: 'Admin Dashboard' },
        { path: '/admin/companies', label: 'Company Approval' },
      ];
    }

    if (user.role === 'companyOwner') {
      return [
        ...commonItems,
        { path: '/company/my', label: 'My Companies' },
        { path: '/company/new', label: 'Post a Job' },
      ];
    }

    // Regular user
    return [
      ...commonItems,
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