import axios from 'axios';

export const createOrder = (orderData) => async (dispatch) => {
    try {
        dispatch({ type: 'CREATE_ORDER_START' });
        
        const response = await axios.post('http://localhost:5112/api/orders', orderData);
        
        dispatch({
            type: 'CREATE_ORDER_SUCCESS',
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: 'CREATE_ORDER_ERROR',
            payload: error.message
        });
    }
};

export const fetchOrders = (username) => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_ORDERS_START' });
        
        const response = await axios.get(`http://localhost:5112/api/orders/user/${username}`);
        
        dispatch({
            type: 'FETCH_ORDERS_SUCCESS',
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: 'FETCH_ORDERS_ERROR',
            payload: error.message
        });
    }
}; 