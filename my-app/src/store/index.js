import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import { cartReducer } from './reducers/cartReducer';
import { productsReducer } from './reducers/productsReducer';
import { ordersReducer } from './reducers/ordersReducer';

const rootReducer = combineReducers({
    cart: cartReducer,
    products: productsReducer,
    orders: ordersReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk)); 