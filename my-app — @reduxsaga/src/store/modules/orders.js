import { createReduxModule } from '../../utils/createReduxModule';
import { getOrders, getOrder, createOrder } from '../../services/api';
import { put, call } from 'redux-saga/effects';

const initialState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null
};

const ordersModule = createReduxModule('orders', {
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload || [];
            state.error = null;
        },
        setCurrentOrder: (state, action) => {
            state.currentOrder = action.payload;
            state.error = null;
        },
        addOrder: (state, action) => {
            state.orders.push(action.payload);
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    sagas: {
        fetchOrders: function* () {
            try {
                yield put({ type: 'orders/setLoading', payload: true });
                const data = yield call(getOrders);
                yield put({ type: 'orders/setOrders', payload: data });
                return data;
            } catch (error) {
                yield put({ type: 'orders/setError', payload: error.message });
                throw error;
            } finally {
                yield put({ type: 'orders/setLoading', payload: false });
            }
        },
        fetchOrder: function* (orderId) {
            try {
                yield put({ type: 'orders/setLoading', payload: true });
                const data = yield call(getOrder, orderId);
                yield put({ type: 'orders/setCurrentOrder', payload: data });
                return data;
            } catch (error) {
                yield put({ type: 'orders/setError', payload: error.message });
                throw error;
            } finally {
                yield put({ type: 'orders/setLoading', payload: false });
            }
        },
        createOrder: function* (action) {
            try {
                yield put({ type: 'orders/setLoading', payload: true });
                const orderData = action.payload;
                const response = yield call(createOrder, orderData);
                yield put({ type: 'orders/addOrder', payload: response });
                return response;
            } catch (error) {
                yield put({ type: 'orders/setError', payload: error.message });
                throw error;
            } finally {
                yield put({ type: 'orders/setLoading', payload: false });
            }
        }
    }
});

export default ordersModule; 