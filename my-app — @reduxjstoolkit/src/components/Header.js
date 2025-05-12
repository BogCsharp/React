import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../hooks/UseAuth';
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth();
    const cart = useSelector(state => state.cart);
    const cartItemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    const handleLogout = () => {
        logout();
    };

    return (
        <header>
            <nav>
                <Link to="/" className="link">Главная</Link>
                {user && (
                    <>
                        <Link to="/products" className="link">Товары</Link>
                        <Link to="/orders" className="link">Заказы</Link>
                    </>
                )}
            </nav>
            <div className="user-info">
                {user && (
                    <>
                        <Link to="/cart" className="link">
                            Корзина ({cartItemsCount})
                        </Link>
                        <button onClick={handleLogout}>Выйти</button>
                    </>
                )}
                {!user && (
                    <Link to="/login" className="link">Войти</Link>
                )}
            </div>
        </header>
    );
};

export default Header;
