import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../services/authService';

const EmailVerification: React.FC = () => {
    const [message, setMessage] = useState<string>('Verifying...');
    const [error, setError] = useState<string>('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (!token) {
            setError('No verification token provided.');
            setMessage('');
            return;
        }
        verifyEmail(token)
            .then((res: any) => {
                setMessage(res.message || 'Email verified successfully. You can now log in.');
                setTimeout(() => navigate('/auth/login'), 2000);
            })
            .catch((err: any) => {
                setError(err?.response?.data?.message || 'Verification failed.');
                setMessage('');
            });
    }, [location, navigate]);

    return (
        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded shadow text-center">
            <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
            {message && <div className="text-green-600 mb-2">{message}</div>}
            {error && <div className="text-red-500 mb-2">{error}</div>}
        </div>
    );
};

export default EmailVerification;
