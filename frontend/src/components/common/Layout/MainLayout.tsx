import React from 'react';
import Header from '../Header/Header';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-8">{children}</main>
        {/* Footer could go here */}
    </div>
);

export default MainLayout;
