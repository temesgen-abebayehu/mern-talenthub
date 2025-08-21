import React, { useState } from 'react';
import { registerUser } from '../../services/authService';

const RegisterForm = () => {
    const [form, setForm] = useState({ email: '', password: '', role: 'applicant' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await registerUser(form);
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="input" />
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required className="input" />
            <select name="role" value={form.role} onChange={handleChange} className="input">
                <option value="applicant">Applicant</option>
                <option value="employer">Employer</option>
            </select>
            {error && <div className="text-red-500">{error}</div>}
            <button type="submit" className="btn btn-primary w-full">Register</button>
        </form>
    );
};

export default RegisterForm;
