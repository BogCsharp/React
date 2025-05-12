import React from 'react';
import { useAuth } from '../hooks/UseAuth';
import { useGetOrdersQuery } from '../store/api/apiSlice';
import './Orders.css';

const Orders = () => {
    const { user } = useAuth();
    const { data: allOrders = [], isLoading, error } = useGetOrdersQuery();
    const orders = allOrders.filter(order => order.userId === user?.id?.toString());

    if (!user) return <div>Войдите, чтобы увидеть заказы</div>;
    if (isLoading) return <div>Загрузка ваших заказов...</div>;
    if (error) return <div className="error">{error.data || 'Failed to load orders'}</div>;

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