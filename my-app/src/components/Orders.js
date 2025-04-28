import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/UseAuth';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (!user?.username) {
                    console.log('No username found');
                    setLoading(false);
                    return;
                }

                console.log('Fetching orders for username:', user.username);
                const response = await axios.get(`http://localhost:5112/api/orders/user/${user.username}`);
                console.log('Raw orders response:', response);
                
                if (response.data && Array.isArray(response.data)) {
                    console.log('Setting orders:', response.data);
                    setOrders(response.data);
                } else {
                    console.log('No orders found or invalid response format');
                    setOrders([]);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching orders:', err);
                console.error('Error details:', err.response?.data);
                setError(err.response?.data || 'Failed to load orders');
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) return <div>Загрузка ваших заказов...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!user) return <div>Войдите, чтобы увидеть заказы</div>;

    return (
        <div className="orders-container">
            <h2>Ваши заказы</h2>
            {orders.length === 0 ? (
                <p>Бегом за покупками</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <h3>Заказ #{order.id}</h3>
                                <p>Дата: {new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                            <div className="order-details">
                                <p>Всего: {order.totalAmount.toFixed(2)} руб</p>
                                <p>Метод оплаты: {order.paymentMethod}</p>
                                <p>Адрес: {order.address}</p>
                            </div>
                            <div className="order-items">
                                <h4>Товары:</h4>
                                {order.orderItems && order.orderItems.length > 0 ? (
                                    order.orderItems.map(item => (
                                        <div key={item.id} className="order-item">
                                            <p>{item.productName}</p>
                                            <p>Количество: {item.quantity} </p>
                                            <p>Цена: {item.price.toFixed(2)} руб</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>Нет товаров</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders; 