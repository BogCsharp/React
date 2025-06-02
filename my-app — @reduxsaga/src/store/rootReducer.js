import { combineReducers } from '@reduxjs/toolkit';
import { authModule, cartModule, ordersModule, productsModule } from './modules';

const rootReducer = combineReducers({
    auth: authModule.reducer,
    cart: cartModule.reducer,
    orders: ordersModule.reducer,
    products: productsModule.reducer
});

export default rootReducer; 