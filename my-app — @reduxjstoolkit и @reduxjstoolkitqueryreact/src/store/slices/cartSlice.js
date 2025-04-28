import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    total: 0
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            state.total += action.payload.price;
        },
        removeFromCart: (state, action) => {
            const itemToRemove = state.items.find(item => item.id === action.payload);
            state.items = state.items.filter(item => item.id !== action.payload);
            state.total -= itemToRemove.price * itemToRemove.quantity;
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                const oldQuantity = item.quantity;
                item.quantity = quantity;
                state.total += item.price * (quantity - oldQuantity);
            }
        },
        clearCart: () => initialState
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 