const initialState = {
    orders: [],
    loading: false,
    error: null,
    currentOrder: null
};

export const ordersReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CREATE_ORDER_START':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'CREATE_ORDER_SUCCESS':
            return {
                ...state,
                loading: false,
                orders: [...state.orders, action.payload],
                currentOrder: action.payload
            };
        case 'CREATE_ORDER_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'FETCH_ORDERS_START':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'FETCH_ORDERS_SUCCESS':
            return {
                ...state,
                loading: false,
                orders: action.payload
            };
        case 'FETCH_ORDERS_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
}; 