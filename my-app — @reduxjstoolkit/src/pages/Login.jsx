import { useAuth } from '../hooks/UseAuth';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
    };

    return (
        <div className="login-container">
            <h2>Вход в систему</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Логин"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Загрузка...' : 'Войти'}
                </button>
            </form>
            <div style={{ marginTop: '20px' }}>
                <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
            </div>
        </div>
    );
};

export default Login;