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
                state.total += action.payload.price;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
                state.total += action.payload.price;
            }
        },
        removeFromCart: (state, action) => {
            const itemToRemove = state.items.find(item => item.id === action.payload);
            state.items = state.items.filter(item => item.id !== action.payload);
            state.total -= (itemToRemove.price * itemToRemove.quantity);
        },
        updateQuantity: (state, action) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
                state.total = state.items.reduce((sum, item) => 
                    sum + (item.price * item.quantity), 0);
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 