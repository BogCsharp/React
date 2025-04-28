import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('http://localhost:5112/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            const userData = {
                id: data.id,
                username: data.username,
                email: data.email,
                isAuthenticated: true
            };

            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            navigate('/');
        } catch (err) {
            setError(err.message);
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('http://localhost:5112/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            await login(username, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return { 
        user,
        error,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user?.isAuthenticated
    };
};