import { createReduxModule } from '../../utils/createReduxModule';
import { login, register, logout } from '../../services/api';
import { put, call } from 'redux-saga/effects';

const initialState = {
    user: null,
    loading: false,
    error: null
};

const authModule = createReduxModule('auth', {
    initialState,
    reducers: {
        setUser: (state, action) => {
            console.log('Setting user in state:', action.payload);
            state.user = action.payload;
            state.error = null;
        },
        clearUser: (state) => {
            console.log('Clearing user from state');
            state.user = null;
            state.error = null;
            state.loading = false;
        },
        setError: (state, action) => {
            console.log('Setting error in state:', action.payload);
            state.error = action.payload;
            state.user = null;
            state.loading = false;
        }
    },
    sagas: {
        login: function* (action) {
            try {
                console.log('Login saga received:', action);
                yield put({ type: 'auth/clearUser' });
                
                const data = yield call(login, action.payload);
                console.log('Login successful, user data:', data);
                
                if (!data || !data.username) {
                    yield put({ type: 'auth/setError', payload: 'Неверные данные для входа' });
                    return null;
                }
                
                yield put({ type: 'auth/setUser', payload: data });
                return data;
            } catch (error) {
                console.error('Login saga error:', error);
                yield put({ type: 'auth/setError', payload: error.message || 'Ошибка входа' });
                return null;
            }
        },
        register: function* (action) {
            try {
                console.log('Register saga received:', action);
                yield put({ type: 'auth/clearUser' });
                
                const data = yield call(register, action.payload);
                console.log('Registration successful, user data:', data);
                
                if (!data || !data.username) {
                    yield put({ type: 'auth/setError', payload: 'Ошибка регистрации' });
                    return null;
                }
                
                yield put({ type: 'auth/setUser', payload: data });
                return data;
            } catch (error) {
                console.error('Register saga error:', error);
                yield put({ type: 'auth/setError', payload: error.message || 'Ошибка регистрации' });
                return null;
            }
        },
        logout: function* () {
            try {
                yield call(logout);
                yield put({ type: 'auth/clearUser' });
            } catch (error) {
                console.error('Logout error:', error);
                yield put({ type: 'auth/setError', payload: error.message || 'Ошибка выхода' });
            }
        }
    }
});

export default authModule; 