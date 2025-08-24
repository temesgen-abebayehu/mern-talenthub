import React from 'react';
const AdminCompanyModeration = React.lazy(() => import('./AdminCompanyModeration'));
const AdminJobModeration = React.lazy(() => import('./AdminJobModeration'));
const AdminUserManagement = React.lazy(() => import('./AdminUserManagement'));

const AdminDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-6xl mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                <React.Suspense fallback={<div>Loading...</div>}>
                    <AdminJobModeration />
                    <AdminCompanyModeration />
                    <AdminUserManagement />
                </React.Suspense>
            </div>
        </div>
    );
};

export default AdminDashboard;
