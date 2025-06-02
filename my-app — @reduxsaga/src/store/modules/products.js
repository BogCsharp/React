import { createReduxModule } from '../../utils/createReduxModule';
import { getProducts } from '../../services/api';
import { put, call } from 'redux-saga/effects';

const initialState = {
    items: [],
    currentProduct: null,
    loading: false,
    error: null,
    hasMore: true,
    currentPage: 1
};

const productsModule = createReduxModule('products', {
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.items = action.payload;
            state.error = null;
            state.loading = false;
        },
        appendProducts: (state, action) => {
            state.items = [...state.items, ...action.payload];
            state.error = null;
            state.loading = false;
        },
        setHasMore: (state, action) => {
            state.hasMore = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setCurrentProduct: (state, action) => {
            state.currentProduct = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
    sagas: {
        getProducts: function* (action) {
            try {
                const page = action.payload || 1;
                console.log('Getting products for page:', page);
                yield put({ type: 'products/setLoading', payload: true });
                const data = yield call(getProducts, page);
                
                console.log('Products saga received data:', {
                    productsCount: data.products.length,
                    hasMore: data.hasMore,
                    currentPage: data.currentPage,
                    totalPages: data.totalPages
                });

                const hasMore = Boolean(data.hasMore) && data.products.length > 0;
                console.log('Calculated hasMore:', hasMore);

                if (page === 1) {
                    yield put({ type: 'products/setProducts', payload: data.products });
                } else {
                    yield put({ type: 'products/appendProducts', payload: data.products });
                }
                
                yield put({ type: 'products/setHasMore', payload: hasMore });
                yield put({ type: 'products/setCurrentPage', payload: data.currentPage });
                return data;
            } catch (error) {
                console.error('Get products saga error:', error);
                yield put({ type: 'products/setError', payload: error.message });
                throw error;
            } finally {
                yield put({ type: 'products/setLoading', payload: false });
            }
        }
    }
});

export default productsModule; 