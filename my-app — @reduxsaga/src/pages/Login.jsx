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
        <main className="login-container" role="main" id="main-content" tabIndex="-1">
            <h1 className="visually-hidden">Страница входа</h1>
            <h2 id="login-heading">Вход в систему</h2>
            
            {error && (
                <div 
                    className="error-message" 
                    role="alert" 
                    aria-live="assertive"
                >
                    {error}
                </div>
            )}
            
            <form 
                onSubmit={handleSubmit} 
                className="login-form"
                aria-labelledby="login-heading"
                noValidate
            >
                <div className="form-group">
                    <label htmlFor="username" id="username-label">
                        Имя пользователя:
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        aria-required="true"
                        aria-invalid={error ? "true" : "false"}
                        aria-describedby={error ? "error-message" : undefined}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password" id="password-label">
                        Пароль:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        aria-required="true"
                        aria-invalid={error ? "true" : "false"}
                        aria-describedby={error ? "error-message" : undefined}
                        minLength="6"
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="login-button"
                    disabled={loading}
                    aria-busy={loading}
                >
                    {loading ? 'Вход...' : 'Войти'}
                </button>
            </form>
            
            <div className="register-link">
                <p>
                    Нет аккаунта?{' '}
                    <Link 
                        to="/register"
                        aria-label="Перейти на страницу регистрации"
                    >
                        Зарегистрироваться
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default Login;