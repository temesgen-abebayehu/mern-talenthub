import React, { useEffect, useState, useRef, ChangeEvent, FormEvent } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface User {
    _id: string;
    name?: string;
    email: string;
    avatar?: string;
}

interface Stats {
    applications: number;
    jobsPosted: number;
    companiesOwned: number;
    // Add more stats as needed
}

const Profile: React.FC = () => {
    const { user } = useAuth() as { user: User };
    const [stats, setStats] = useState<Stats | null>(null);
    const [avatar, setAvatar] = useState<string>(user?.avatar || '');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [uploadMsg, setUploadMsg] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user) return;
        api.get(`/users/${user._id}/stats`).then(res => setStats(res.data)).catch(() => setStats(null));
    }, [user]);

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleAvatarUpload = async (e: FormEvent) => {
        e.preventDefault();
        if (!avatarFile) return;
        setLoading(true);
        setUploadMsg('');
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        try {
            const res = await api.post(`/users/${user._id}/upload-avatar`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setAvatar(res.data.avatarUrl || '');
            setUploadMsg('Avatar uploaded!');
        } catch {
            setUploadMsg('Failed to upload avatar');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="mt-10 text-center">Please log in.</div>;

    return (
        <section className="mt-10 max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-primary mb-6">User Profile</h2>
            <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl text-primary font-bold mb-2 overflow-hidden">
                    {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover rounded-full" /> : user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-lg font-semibold text-gray-800">{user.name}</span>
                <span className="text-gray-500">{user.email}</span>
                <form onSubmit={handleAvatarUpload} className="flex flex-col items-center gap-2 mt-2">
                    <input type="file" accept="image/*" onChange={handleAvatarChange} ref={fileInputRef} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-1 bg-gray-200 rounded">Choose Avatar</button>
                    {avatarFile && <span className="text-xs text-gray-500">{avatarFile.name}</span>}
                    <button type="submit" disabled={loading || !avatarFile} className="mt-1 px-6 py-2 rounded bg-secondary text-white font-semibold hover:bg-primary transition">{loading ? 'Uploading...' : 'Upload Avatar'}</button>
                    {uploadMsg && <div className="text-green-600 text-sm">{uploadMsg}</div>}
                </form>
                <button className="mt-4 px-6 py-2 rounded bg-secondary text-white font-semibold hover:bg-primary transition">Edit Profile</button>
            </div>
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-2">User Stats</h3>
                {stats ? (
                    <ul className="text-gray-700">
                        <li>Applications: {stats.applications}</li>
                        <li>Jobs Posted: {stats.jobsPosted}</li>
                        <li>Companies Owned: {stats.companiesOwned}</li>
                        {/* Add more stats as needed */}
                    </ul>
                ) : <div className="text-gray-500">No stats available.</div>}
            </div>
        </section>
    );
};

export default Profile;
