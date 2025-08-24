import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
            {children}
        </div>
    </div>
);

export default AuthLayout;
