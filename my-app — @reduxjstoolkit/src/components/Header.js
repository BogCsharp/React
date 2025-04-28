import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const cart = useSelector(state => state.cart);
    const cartItemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <header>
            <nav>
                <Link to="/" className="link">Главная</Link>
                <Link to="/products" className="link">Товары</Link>
                <Link to="/orders" className="link">Заказы</Link>
            </nav>
            <div className="user-info">
                <Link to="/cart" className="link">
                    Корзина ({cartItemsCount})
                </Link>
                <button onClick={handleLogout}>Выйти</button>
            </div>
        </header>
    );
};

export default Header;
