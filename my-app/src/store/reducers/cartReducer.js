const initialState = {
    items: [],
    total: 0
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                    total: state.total + action.payload.price
                };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }],
                total: state.total + action.payload.price
            };
        case 'REMOVE_FROM_CART':
            const itemToRemove = state.items.find(item => item.id === action.payload);
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
                total: state.total - (itemToRemove.price * itemToRemove.quantity)
            };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
                total: state.items.reduce((sum, item) => {
                    if (item.id === action.payload.id) {
                        return sum + (item.price * action.payload.quantity);
                    }
                    return sum + (item.price * item.quantity);
                }, 0)
            };
        case 'CLEAR_CART':
            return initialState;
        default:
            return state;
    }
}; 