import React, { useState } from 'react';
import { resetPassword } from '../../services/authService';

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await resetPassword(email);
            setMessage('Check your email for reset instructions.');
        } catch (err) {
            setError('Failed to send reset email.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="input" />
            {error && <div className="text-red-500">{error}</div>}
            {message && <div className="text-green-500">{message}</div>}
            <button type="submit" className="btn btn-primary w-full">Reset Password</button>
        </form>
    );
};

export default PasswordReset;
