import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const LoginForm = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login({ email, password });
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="input" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="input" />
            {error && <div className="text-red-500">{error}</div>}
            <button type="submit" className="btn btn-primary w-full">Login</button>
        </form>
    );
};

export default LoginForm;
