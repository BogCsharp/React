import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
    loading: false,
    error: null,
    currentOrder: null
};

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                throw new Error('User not authenticated');
            }

            const requestData = {
                UserId: orderData.UserId,
                UserName: orderData.UserName,
                Email: orderData.Email,
                Address: orderData.Address,
                PaymentMethod: orderData.PaymentMethod,
                TotalAmount: orderData.TotalAmount,
                Items: orderData.Items
            };

            const response = await fetch('http://localhost:5112/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(requestData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || data.error || `Server error: ${response.status} ${response.statusText}`);
            }
            
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Произошла ошибка при создании заказа');
        }
    }
);

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                throw new Error('User not authenticated');
            }

            const response = await fetch(`http://localhost:5112/api/orders?userId=${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch orders');
            }
            
            const orders = await response.json();
            const userOrders = orders.filter(order => String(order.userId) === String(user.id));
            return userOrders;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearOrders: (state) => {
            state.orders = [];
            state.currentOrder = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders.push(action.payload);
                state.currentOrder = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer; 