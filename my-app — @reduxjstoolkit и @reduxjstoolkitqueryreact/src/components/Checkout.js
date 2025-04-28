import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { useCreateOrderMutation } from '../store/api/apiSlice';

const Checkout = () => {
    const cart = useSelector(state => state.cart);
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
    const [createOrder, { isLoading }] = useCreateOrderMutation();

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
            try {
                const orderData = {
                    userId: (user?.id || 'guest').toString(),
                    userName: formData.name.trim(),
                    email: formData.email.trim(),
                    address: formData.address.trim(),
                    paymentMethod: formData.paymentMethod,
                    totalAmount: parseFloat(cart.total),
                    items: cart.items.map(item => ({
                        productId: parseInt(item.id),
                        productName: item.name.trim(),
                        price: parseFloat(item.price),
                        quantity: parseInt(item.quantity)
                    }))
                };

                await createOrder(orderData).unwrap();
                dispatch(clearCart());
                navigate('/orders');
            } catch (error) {
                console.error('Failed to create order:', error);
                // Handle error appropriately
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
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Адрес"
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
            <form onSubmit={handleSubmit}>
                {renderStep()}
                <div style={{ marginTop: '20px' }}>
                    {step > 1 && (
                        <button style={{marginBottom:'10px'}} type="button" onClick={() => setStep(prev => prev - 1)}>
                            Назад
                        </button>
                    )}
                    <button type="submit" disabled={isLoading}>
                        {step === 3 ? (isLoading ? 'Оформление...' : 'Оформить заказ') : 'Далее'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Checkout; 