import React, { useState, ChangeEvent, FormEvent } from 'react';
import { registerUser } from '../../services/authService';

interface RegisterFormState {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'companyOwner';
}

const RegisterForm: React.FC = () => {
    const [form, setForm] = useState<RegisterFormState>({ name: '', email: '', password: '', role: 'user' });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await registerUser(form);
            setSuccess(res.message || 'Registration successful. Please check your email to verify your account.');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto flex flex-col gap-6 mt-8">
            <h2 className="text-2xl font-bold text-primary mb-2 text-center">Register</h2>
            <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Full Name" required className="border border-primary/30 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full" />
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="border border-primary/30 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full" />
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required className="border border-primary/30 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full" />
            <select name="role" value={form.role} onChange={handleChange} className="border border-primary/30 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full">
                <option value="user">Job Seeker</option>
                <option value="companyOwner">Company Owner</option>
            </select>
            {error && <div className="text-red-500 text-center">{error}</div>}
            {success && <div className="text-green-600 text-center">{success}</div>}
            <button type="submit" className="bg-primary hover:bg-secondary text-white font-semibold py-2 rounded transition w-full">Register</button>
        </form>
    );
};

export default RegisterForm;
