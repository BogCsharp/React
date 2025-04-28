import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const cart = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRemoveItem = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleQuantityChange = (productId, quantity) => {
        if (quantity > 0) {
            dispatch(updateQuantity({ id: productId, quantity }));
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.total;

    return (
        <div className="cart-container">
            <h2>Корзина</h2>
            
            {cart.items.length === 0 ? (
                <div className="empty-cart">
                    <p>Ваша корзина пуста</p>
                    <Link to="/products">Перейти к товарам</Link>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cart.items.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p>Цена: {item.price} руб.</p>
                                </div>
                                <div className="quantity-controls">
                                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                    <input 
                                        type="number" 
                                        value={item.quantity} 
                                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                        min="1"
                                    />
                                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                                </div>
                                <button 
                                    className="remove-button"
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
                            <span>Товаров:</span>
                            <span>{totalItems}</span>
                        </div>
                        <div className="summary-row">
                            <span>Общая стоимость:</span>
                            <span>{totalPrice} руб.</span>
                        </div>
                    </div>

                    <button 
                        className="checkout-button"
                        onClick={handleCheckout}
                    >
                        Оформить заказ
                    </button>
                </>
            )}
        </div>
    );
};

export default Cart; 