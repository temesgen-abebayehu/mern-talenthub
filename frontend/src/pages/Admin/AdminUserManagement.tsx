import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface User {
    _id: string;
    name?: string;
    email: string;
    role: string;
    isActive: boolean;
}

const ROLES = ['user', 'companyOwner', 'admin'] as const;

type Role = typeof ROLES[number];

const AdminUserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [actionMsg, setActionMsg] = useState<string>('');

    useEffect(() => {
        setLoading(true);
        setError('');
        api.get('/users')
            .then(res => setUsers(res.data))
            .catch(() => setError('Failed to load users'))
            .finally(() => setLoading(false));
    }, [actionMsg]);

    const handleRoleChange = async (userId: string, role: Role) => {
        setActionMsg('');
        try {
            await api.put(`/users/${userId}/role`, { role });
            setActionMsg('Role updated');
        } catch {
            setActionMsg('Failed to update role');
        }
    };

    const handleToggleActive = async (userId: string, isActive: boolean) => {
        setActionMsg('');
        try {
            await api.put(`/users/${userId}/status`, { isActive });
            setActionMsg(isActive ? 'User activated' : 'User deactivated');
        } catch {
            setActionMsg('Failed to update user status');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <section className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            {actionMsg && <div className="text-green-600 mb-2">{actionMsg}</div>}
            <div className="overflow-x-auto">
                <table className="min-w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Role</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td className="p-2 border">{user.name || '-'}</td>
                                <td className="p-2 border">{user.email}</td>
                                <td className="p-2 border">
                                    <select
                                        value={user.role}
                                        onChange={e => handleRoleChange(user._id, e.target.value as Role)}
                                        className="border rounded px-2 py-1"
                                    >
                                        {ROLES.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-2 border">{user.isActive ? 'Active' : 'Inactive'}</td>
                                <td className="p-2 border flex gap-2">
                                    <button
                                        onClick={() => handleToggleActive(user._id, !user.isActive)}
                                        className={user.isActive ? 'bg-red-600 text-white px-2 py-1 rounded' : 'bg-green-600 text-white px-2 py-1 rounded'}
                                    >
                                        {user.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminUserManagement;
