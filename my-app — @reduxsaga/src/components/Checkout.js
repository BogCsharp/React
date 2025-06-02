import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ordersModule, cartModule } from '../store/modules';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import './Checkout.css';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items } = useSelector(state => state.cart);
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: user?.username || '',
        email: user?.email || '',
        address: '',
        paymentMethod: 'Кредитная карта'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const isStepValid = () => {
        switch (step) {
            case 1:
                return formData.name.trim() && formData.email.trim() && formData.address.trim();
            case 2:
                return formData.paymentMethod.trim();
            case 3:
                return items.length > 0;
            default:
                return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        if (!isStepValid()) {
            setSubmitError('Пожалуйста, заполните все обязательные поля');
            return;
        }

        if (step === 3) {
            setIsSubmitting(true);
            try {
                if (!user || !user.id) {
                    throw new Error('Отсутствует информация о пользователе');
                }

                if (!items || items.length === 0) {
                    throw new Error('Корзина пуста');
                }

                if (!formData.name || !formData.email || !formData.address || !formData.paymentMethod) {
                    throw new Error('Пожалуйста, заполните все поля формы');
                }

                const orderData = {
                    userId: String(user.id),
                    userName: formData.name,
                    email: formData.email,
                    address: formData.address,
                    paymentMethod: formData.paymentMethod,
                    totalAmount: Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0)),
                    items: items.map(item => ({
                        productId: Number(item.id),
                        productName: item.name,
                        price: Number(item.price),
                        quantity: Number(item.quantity)
                    }))
                };

                // Проверяем обязательные поля
                if (!orderData.userId || !orderData.userName || !orderData.email || !orderData.address || !orderData.paymentMethod) {
                    throw new Error('Пожалуйста, заполните все обязательные поля');
                }

                // Проверяем числовые значения
                if (isNaN(orderData.totalAmount) || orderData.totalAmount <= 0) {
                    throw new Error('Некорректная сумма заказа');
                }

                // Проверяем товары
                if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
                    throw new Error('Корзина пуста');
                }

                // Проверяем каждый товар
                orderData.items.forEach((item, index) => {
                    if (!item.productId || !item.productName || !item.price || !item.quantity) {
                        throw new Error(`Товар #${index + 1} имеет неполные данные`);
                    }
                    if (isNaN(item.price) || item.price <= 0) {
                        throw new Error(`Товар #${index + 1} имеет некорректную цену`);
                    }
                    if (isNaN(item.quantity) || item.quantity <= 0) {
                        throw new Error(`Товар #${index + 1} имеет некорректное количество`);
                    }
                });

                dispatch(ordersModule.actions.createOrder(orderData));
                dispatch(cartModule.actions.clearCart());
                navigate('/orders');
            } catch (error) {
                setSubmitError(error.message);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setStep(prev => prev + 1);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="checkout-step">
                        <h3>Контактная информация</h3>
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Имя"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Адрес доставки"
                                required
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="checkout-step">
                        <h3>Способ оплаты</h3>
                        <div className="form-group">
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                                className="payment-select"
                            >
                                <option value="Кредитная карта">Кредитная карта</option>
                                <option value="СБП">СБП</option>
                                <option value="Дебитовая карта">Дебитовая карта</option>
                            </select>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="checkout-step">
                        <h3>Подтверждение заказа</h3>
                        <div className="order-summary">
                            <h4>Ваш заказ</h4>
                            <div className="order-items">
                                {items.map(item => (
                                    <div key={item.id} className="order-item">
                                        <span>{item.name}</span>
                                        <span>{item.quantity} шт.</span>
                                        <span>{item.price} руб.</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-total">
                                <p>Итого: {items.reduce((sum, item) => sum + (item.price * item.quantity), 0)} руб.</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (!user) {
        return (
            <div className="checkout-container">
                <h2>Оформление заказа</h2>
                <p>Пожалуйста, войдите в систему для оформления заказа</p>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h2>Оформление заказа</h2>
            {submitError && (
                <div className="error-message">
                    {submitError}
                </div>
            )}
            <form onSubmit={handleSubmit} className="checkout-form">
                {renderStep()}
                <div className="checkout-buttons">
                    {step > 1 && (
                        <button 
                            type="button" 
                            onClick={() => setStep(prev => prev - 1)}
                            className="btn btn-secondary"
                        >
                            Назад
                        </button>
                    )}
                    <button 
                        type="submit"
                        disabled={!isStepValid() || isSubmitting}
                        className="btn btn-primary"
                    >
                        {isSubmitting ? 'Загрузка...' : (step === 3 ? 'Оформить заказ' : 'Далее')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Checkout; 