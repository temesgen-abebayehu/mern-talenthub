import React, { createContext, useState, useEffect } from 'react';
import { getUser, loginUser, logoutUser } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUser();
            setUser(userData);
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (credentials) => {
        const userData = await loginUser(credentials);
        setUser(userData);
        return userData;
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
