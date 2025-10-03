import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('role');

        if (token && userId && role) {
            try {
                setUser({ userId, role });
            } catch (error) {
                console.error('Error loading user data:', error);
                logout();
            }
        } else {
            logout();
        }
        setLoading(false);
    }, []);

    const login = (loginResponse) => {
        const { accessToken, userId, role } = loginResponse;

        if (accessToken && userId && role) {
            localStorage.setItem('token', accessToken);
            localStorage.setItem('userId', userId);
            localStorage.setItem('role', role);

            setUser({ userId, role });
        } else {
            console.error('Invalid login response:', loginResponse);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        setUser(null);
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem('token');
    };

    const getToken = () => {
        return localStorage.getItem('token');
    };

    const getUserId = () => {
        return user?.userId || localStorage.getItem('userId');
    };

    const value = {
        user,
        login,
        logout,
        isAdmin,
        isAuthenticated,
        loading,
        getToken,
        getUserId
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};