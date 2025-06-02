import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authModule } from '../store/modules';
import './Login.css';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.auth);
    
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    
    const [localError, setLocalError] = useState('');
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setLocalError('');
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        
        if (!formData.username.trim() || !formData.password.trim()) {
            setLocalError('Пожалуйста, заполните все поля');
            return;
        }
        
        try {
            console.log('Attempting login with:', formData);
            
            const loginData = {
                username: formData.username.trim(),
                password: formData.password
            };
            
            await dispatch(authModule.actions.login(loginData));
            console.log('Login successful');
            
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setLocalError(err.message || 'Произошла ошибка при входе');
        }
    };
    
    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Вход</h2>
                
                {(error || localError) && (
                    <div className="error-message">
                        {localError || error}
                    </div>
                )}
                
                <div className="form-group">
                    <label htmlFor="username">Имя пользователя</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="Введите имя пользователя"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="Введите пароль"
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Вход...' : 'Войти'}
                </button>
            </form>
        </div>
    );
};

export default Login; 