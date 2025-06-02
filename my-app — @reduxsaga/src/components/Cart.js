import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cartModule } from '../store/modules';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { items, loading, error } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRemoveItem = (productId) => {
        dispatch(cartModule.actions.removeFromCart(productId));
    };

    const handleUpdateQuantity = (productId, quantity) => {
        if (quantity > 0) {
            dispatch(cartModule.actions.updateCartItem({ productId, quantity }));
        }
    };

    if (items.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Ваша корзина пуста</h2>
                <Link to="/products" className="continue-shopping">
                    Бегом за покупками
                </Link>
            </div>
        );
    }

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="cart-container">
            <h2>Корзина</h2>
            <div className="cart-items">
                {items.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="item-details">
                            <h3>{item.name}</h3>
                            <p>Цена: {item.price} руб.</p>
                        </div>
                        <div className="quantity-controls">
                            <button 
                                className="btn btn-sm"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                                -
                            </button>
                            <input 
                                type="number" 
                                value={item.quantity} 
                                onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                                min="1"
                            />
                            <button 
                                className="btn btn-sm"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                        <button 
                            className="btn"
                            onClick={() => handleRemoveItem(item.id)}
                        >
                            Удалить
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="cart-summary">
                <h3>Итого</h3>
                <div className="summary-row">
                    <span>Товары ({totalItems}):</span>
                    <span>{totalPrice} руб.</span>
                </div>
                <button className="btn btn-primary checkout-button" onClick={() => navigate('/checkout')}>
                    Оформить заказ
                </button>
            </div>
        </div>
    );
};

export default Cart; 