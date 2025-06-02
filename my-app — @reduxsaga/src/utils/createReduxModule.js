import { createSlice } from '@reduxjs/toolkit';
import { takeLatest, put, call } from 'redux-saga/effects';

export const createReduxModule = (moduleName, {
    initialState = {},
    reducers = {},
    sagas = {},
    api = {}
}) => {
    // Create slice
    const slice = createSlice({
        name: moduleName,
        initialState: {
            ...initialState,
            loading: initialState.loading || false,
            error: initialState.error || null
        },
        reducers: {
            setLoading: (state, action) => {
                state.loading = action.payload;
            },
            setError: (state, action) => {
                state.error = action.payload;
                state.loading = false;
            },
            clearError: (state) => {
                state.error = null;
            },
            setData: (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            },
            ...reducers
        }
    });

    // Create saga
    function* createSaga() {
        for (const [actionType, saga] of Object.entries(sagas)) {
            const actionTypeWithModule = `${moduleName}/${actionType}`;
            
            yield takeLatest(actionTypeWithModule, function* (action) {
                try {
                    yield put(slice.actions.setLoading(true));
                    const result = yield call(saga, action, api, put);
                    yield put(slice.actions.setLoading(false));
                    return result;
                } catch (error) {
                    console.error(`Error in ${actionTypeWithModule}:`, error);
                    yield put(slice.actions.setError(error.message || 'Произошла ошибка'));
                    yield put(slice.actions.setLoading(false));
                    throw error;
                }
            });
        }
    }

    // Create action creators
    const actions = {};
    for (const [actionType, saga] of Object.entries(sagas)) {
        actions[actionType] = (payload) => ({
            type: `${moduleName}/${actionType}`,
            payload: payload || {}
        });
    }

    // Combine slice actions with saga actions
    const combinedActions = {
        ...slice.actions,
        ...actions
    };

    return {
        slice,
        saga: createSaga,
        actions: combinedActions,
        reducer: slice.reducer
    };
}; 