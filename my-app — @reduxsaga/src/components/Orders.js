import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ordersModule } from '../store/modules';
import { useAuth } from '../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { orders, loading, error } = useSelector(state => state.orders);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        dispatch(ordersModule.actions.fetchOrders());
    }, [dispatch, user, navigate]);

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div className="orders-container">
                <h2>Мои заказы</h2>
                <div className="loading">Загрузка заказов...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-container">
                <h2>Мои заказы</h2>
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="orders-container">
                <h2>Мои заказы</h2>
                <div className="no-orders">У вас пока нет заказов</div>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <h2>Мои заказы</h2>
            <div className="orders-total">
                <p>Общая сумма всех заказов: {orders.reduce((sum, order) => sum + Number(order.totalAmount), 0).toFixed(2)} руб.</p>
            </div>
            <div className="orders-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <h3>Заказ #{order.id}</h3>
                        </div>
                        <div className="order-details">
                            <p><strong>Способ оплаты:</strong> {order.paymentMethod}</p>
                            <p><strong>Адрес доставки:</strong> {order.address}</p>
                            <p className="order-total"><strong>Сумма заказа:</strong> {Number(order.totalAmount).toFixed(2)} руб.</p>
                        </div>
                        <div className="order-items">
                            <h4>Товары:</h4>
                            {order.orderItems && order.orderItems.map(item => (
                                <div key={item.id} className="order-item">
                                    <span className="item-name">{item.productName}</span>
                                    <span className="item-quantity">{item.quantity} шт.</span>
                                    <span className="item-price">{Number(item.price).toFixed(2)} руб.</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders; 