import { createReduxModule } from '../../utils/createReduxModule';
import { put } from 'redux-saga/effects';

const initialState = {
    items: [],
    loading: false,
    error: null
};

const cartModule = createReduxModule('cart', {
    initialState,
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
            state.error = null;
        },
        addItem: (state, action) => {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.items.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({
                    ...product,
                    quantity
                });
            }
        },
        removeItem: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter(item => item.id !== productId);
        },
        updateItemQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(item => item.id === productId);
            if (item) {
                item.quantity = quantity;
            }
        },
        clearCart: (state) => {
            state.items = [];
        }
    },
    sagas: {
        addToCart: function* (action) {
            try {
                const { product, quantity } = action.payload;
                if (!product) {
                    throw new Error('Product is required');
                }
                yield put({ type: 'cart/addItem', payload: { product, quantity } });
                return product;
            } catch (error) {
                console.error('Error adding to cart:', error);
                throw error;
            }
        },
        removeFromCart: function* (action) {
            try {
                const productId = action.payload;
                yield put({ type: 'cart/removeItem', payload: productId });
                return productId;
            } catch (error) {
                console.error('Error removing from cart:', error);
                throw error;
            }
        },
        updateCartItem: function* (action) {
            try {
                const { productId, quantity } = action.payload;
                yield put({ type: 'cart/updateItemQuantity', payload: { productId, quantity } });
                return { productId, quantity };
            } catch (error) {
                console.error('Error updating cart item:', error);
                throw error;
            }
        }
    }
});

export default cartModule; 