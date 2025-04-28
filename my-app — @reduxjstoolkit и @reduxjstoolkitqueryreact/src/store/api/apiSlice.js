import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:5112/api',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        }
    }),
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (page = 1) => ({
                url: `products?page=${page}`,
                method: 'GET'
            }),
            transformResponse: (response, meta, arg) => {
                console.log('Raw API Response:', response);
                if (Array.isArray(response)) {
                    return {
                        products: response,
                        hasMore: response.length >= 10,
                        currentPage: arg
                    };
                } else if (response && typeof response === 'object') {
                    const products = response.products || response.items || [];
                    return {
                        products,
                        hasMore: products.length >= 10 || response.hasMore || response.totalPages > arg,
                        currentPage: arg
                    };
                }
                return {
                    products: [],
                    hasMore: false,
                    currentPage: arg
                };
            },
            keepUnusedDataFor: 300,
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newItems) => {
                if (newItems.currentPage === 1) {
                    return newItems;
                }
                return {
                    ...newItems,
                    products: [...currentCache.products, ...newItems.products]
                };
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg !== previousArg;
            },
            providesTags: ['Products']
        }),
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: 'orders',
                method: 'POST',
                body: orderData
            }),
            invalidatesTags: ['Orders']
        }),
        getOrders: builder.query({
            query: () => 'orders',
            providesTags: ['Orders']
        })
    })
});

export const {
    useGetProductsQuery,
    useCreateOrderMutation,
    useGetOrdersQuery
} = apiSlice; 