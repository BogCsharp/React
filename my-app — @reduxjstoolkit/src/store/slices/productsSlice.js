import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (page, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/products?page=${page}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            return { products: data.products, page };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.page === 1 
                    ? action.payload.products 
                    : [...state.items, ...action.payload.products];
                state.page = action.payload.page + 1;
                state.hasMore = action.payload.products.length === 10;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default productsSlice.reducer; 