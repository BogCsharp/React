import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/ordersSlice';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';

const Checkout = () => {
    const cart = useSelector(state => state.cart);
    const orders = useSelector(state => state.orders);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: user?.username || '',
        email: user?.email || '',
        address: '',
        paymentMethod: 'credit'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 3) {
            if (!formData.name.trim() || !formData.email.trim() || !formData.address.trim()) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }

            if (!user) {
                alert('Пожалуйста, войдите в систему для оформления заказа');
                return;
            }

            if (cart.items.length === 0) {
                alert('Корзина пуста');
                return;
            }

            const orderData = {
                UserId: user.id.toString(),
                UserName: formData.name.trim(),
                Email: formData.email.trim(),
                Address: formData.address.trim(),
                PaymentMethod: formData.paymentMethod,
                TotalAmount: Number(parseFloat(cart.total).toFixed(2)),
                Items: cart.items.map(item => ({
                    ProductId: Number(item.id),
                    ProductName: item.name.trim(),
                    Price: Number(parseFloat(item.price).toFixed(2)),
                    Quantity: Number(item.quantity)
                }))
            };

            if (!orderData.UserId || !orderData.UserName || !orderData.Email || !orderData.Address || !orderData.PaymentMethod) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }

            if (isNaN(orderData.TotalAmount) || orderData.TotalAmount <= 0) {
                alert('Некорректная сумма заказа');
                return;
            }

            if (!orderData.Items || orderData.Items.length === 0) {
                alert('Корзина пуста');
                return;
            }

            if (!orderData.Items.every(item => 
                !isNaN(item.ProductId) && 
                !isNaN(item.Price) && 
                !isNaN(item.Quantity) &&
                item.Price > 0 &&
                item.Quantity > 0
            )) {
                alert('Некорректные данные товаров');
                return;
            }

            try {
                const result = await dispatch(createOrder(orderData)).unwrap();
                if (result) {
                    dispatch(clearCart());
                    navigate('/orders');
                }
            } catch (error) {
                alert(error || 'Произошла ошибка при создании заказа');
            }
        } else {
            setStep(prev => prev + 1);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h3>Оформление заказа</h3>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Имя"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Адрес"
                            required
                        />
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3>Способ оплаты</h3>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleInputChange}
                        >
                            <option value="Кредитная карта">Кредитная карта</option>
                            <option value="СБП">СБП</option>
                            <option value="Дебитовая карта">Дебитовая карта</option>
                        </select>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3>Заказ</h3>
                        <div>
                            {cart.items.map(item => (
                                <div key={item.id}>
                                    {item.name} - {item.quantity} x {item.price} руб
                                </div>
                            ))}
                        </div>
                        <div>Всего: {cart.total} руб</div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            {orders.error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    {orders.error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {renderStep()}
                <div style={{ marginTop: '20px' }}>
                    {step > 1 && (
                        <button 
                            style={{marginBottom:'10px'}} 
                            type="button" 
                            onClick={() => setStep(prev => prev - 1)}
                            disabled={orders.loading}
                        >
                            Назад
                        </button>
                    )}
                    <button 
                        type="submit"
                        disabled={orders.loading}
                    >
                        {orders.loading ? 'Загрузка...' : (step === 3 ? 'Оформить заказ' : 'Далее')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Checkout; 