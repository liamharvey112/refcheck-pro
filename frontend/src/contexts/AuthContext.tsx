import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { apiClient } from '../services/api';

interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: () => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        if (savedToken) {
            setToken(savedToken);
        }
        setLoading(false);
    }, []);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await apiClient.post('/auth/google', {
                    accessToken: tokenResponse.access_token
                });
                const { token: jwtToken, user: userData } = response.data;
                localStorage.setItem('auth_token', jwtToken);
                setToken(jwtToken);
                setUser(userData);
            } catch (error) {
                console.error('Login failed:', error);
            }
        },
        onError: () => {
            console.error('Google login failed');
        }
    });

    const logout = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};