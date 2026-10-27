import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest } from '../../api/authApi';
import { setAccessToken } from '../../api/client';
import { clearTokens, getTokens, saveTokens } from '../../storage/tokenStorage';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isRestoring, setIsRestoring] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const tokens = await getTokens();
                if (tokens?.accessToken) {
                    setAccessToken(tokens.accessToken);
                    setIsAuthenticated(true);
                }
            } finally {
                setIsRestoring(false);
            }
        };
        restoreSession();
    }, []);

    const register = useCallback(
        async ({ name, email, phone, password }) => {
            await registerRequest({ name, email, phone, password });
            // Account exists now, so sign in with the same details.
            await login({ contact: email || phone, password });
        },
        [login],
    );

    const login = useCallback(async ({ contact, password }) => {
        const tokens = await loginRequest({ contact, password });
        await saveTokens(tokens);
        setAccessToken(tokens.accessToken);
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(async () => {
        await clearTokens();
        setAccessToken(null);
        setIsAuthenticated(false);
    }, []);

    const value = useMemo(
        () => ({ isRestoring, isAuthenticated, login, register, logout }),
        [isRestoring, isAuthenticated, login, register, logout],
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside <AuthProvider>');
    }
    return context;
};