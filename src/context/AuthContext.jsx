import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authAPI.verifyToken()
                .then(response => {
                    if (response.user) {
                        setUser(response.user);
                    } else {
                        localStorage.removeItem('token');
                    }
                })
                .catch(() => {
                    localStorage.removeItem('token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const register = async (name, email, password) => {
        setError(null);
        try {
            const response = await authAPI.register({ name, email, password });
            if (response.token && response.user) {
                localStorage.setItem('token', response.token);
                setUser(response.user);
                return { success: true };
            }
            return { success: false, error: 'Неверный ответ сервера' };
        } catch (err) {
            const errorMsg = err.message || 'Ошибка регистрации';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const login = async (email, password) => {
        setError(null);
        try {
            const response = await authAPI.login({ email, password });
            if (response.token && response.user) {
                localStorage.setItem('token', response.token);
                setUser(response.user);
                return { success: true };
            }
            return { success: false, error: 'Неверный ответ сервера' };
        } catch (err) {
            const errorMsg = err.message || 'Ошибка входа';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/auth';
    };

    // Новая функция для обновления пользователя
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            register,
            login,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}