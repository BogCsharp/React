import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import './Login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, logout, error: authError } = useAuth();

    // Очищаем состояние при монтировании компонента
    useEffect(() => {
        const cleanup = async () => {
            try {
                await logout();
            } catch (error) {
                console.error('Error during cleanup:', error);
            }
        };
        cleanup();
    }, []); // Пустой массив зависимостей

    // Обновляем локальную ошибку при изменении ошибки в Redux
    useEffect(() => {
        if (authError) {
            setError(authError);
            setLoading(false);
        }
    }, [authError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
        // Очищаем ошибку при изменении полей
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        const loginData = {
            username: credentials.username.trim(),
            password: credentials.password
        };
        
        console.log('Submitting login data:', loginData);

        if (!loginData.username || !loginData.password) {
            setError('Пожалуйста, заполните все поля');
            setLoading(false);
            return;
        }

        try {
            const result = await login(loginData);
            console.log('Login result:', result);
            
            if (!result) {
                setError('Не удалось войти в систему');
                setLoading(false);
                return;
            }
            
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Не удалось войти в систему');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Вход в систему</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Имя пользователя:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="login-button"
                    disabled={loading}
                >
                    {loading ? 'Вход...' : 'Войти'}
                </button>
            </form>
            <div style={{ marginTop: '20px' }}>
                <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
            </div>
        </div>
    );
};

export default Login;