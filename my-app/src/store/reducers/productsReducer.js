const initialState = {
    items: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true
};

export const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_PRODUCTS_START':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'FETCH_PRODUCTS_SUCCESS':
            return {
                ...state,
                loading: false,
                items: action.payload.page === 1 ? action.payload.products : [...state.items, ...action.payload.products],
                page: action.payload.page + 1,
                hasMore: action.payload.products.length === 10
            };
        case 'FETCH_PRODUCTS_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
}; 