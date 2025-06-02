import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header>
            <nav>
                <Link to="/" className="link">Главная</Link>
                <Link to="/products" className="link">Товары</Link>
                {user && (
                    <>
                        <Link to="/cart" className="link">Корзина</Link>
                        <Link to="/orders" className="link">Заказы</Link>
                    </>
                )}
            </nav>
            <div className="user-info">
                {user ? (
                    <>
                        <span>{user.username}</span>
                        <button onClick={handleLogout}>Выйти</button>
                    </>
                ) : (
                    <Link to="/login" className="link">Войти</Link>
                )}
            </div>
        </header>
    );
};

export default Header;
