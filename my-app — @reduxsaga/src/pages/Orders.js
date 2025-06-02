import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ordersModule } from '../store/modules';
import Loading from '../components/Loading';
import Error from '../components/Error';
import './Orders.css';

const Orders = () => {
    const dispatch = useDispatch();
    const { items = [], loading = false, error = null } = useSelector(state => state.orders || {});

    useEffect(() => {
        dispatch(ordersModule.actions.fetchOrders());
        return () => {
            dispatch(ordersModule.actions.clearError());
        };
    }, [dispatch]);

    if (error) {
        return <Error message={error} />;
    }

    if (loading && items.length === 0) {
        return <Loading />;
    }

    return (
        <div className="orders-container">
            <h2>Мои заказы</h2>
            
            {items.length === 0 ? (
                <div className="no-orders">
                    <p>У вас пока нет заказов</p>
                </div>
            ) : (
                <div className="orders-list">
                    {items.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <h3>Заказ #{order.id}</h3>
                                <p>Дата: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="order-items">
                                {Array.isArray(order.items) && order.items.map(item => (
                                    <div key={item.id} className="order-item">
                                        <span>{item.name}</span>
                                        <span>{item.quantity} шт.</span>
                                        <span>{item.price} руб.</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-total">
                                <p>Итого: {order.total} руб.</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {loading && <Loading />}
        </div>
    );
};

export default Orders; 