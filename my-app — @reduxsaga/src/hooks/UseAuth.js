import { useDispatch, useSelector } from 'react-redux';
import { authModule } from '../store/modules';
import { checkAuth } from '../services/api';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector(state => {
        console.log('Current auth state:', state.auth);
        return state.auth;
    });

    const login = async (credentials) => {
        try {
            console.log('Login called with:', credentials);
            const result = await dispatch(authModule.actions.login(credentials));
            console.log('Login result:', result);
            
            // Проверяем результат входа
            if (!result || !result.payload) {
                console.warn('Вход не удался');
                return null;
            }

            // Добавляем задержку перед проверкой токена
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Проверяем токен после входа
            const userData = checkAuth();
            console.log('User data from token:', userData);
            
            if (!userData || !userData.username) {
                console.warn('Токен не содержит данных пользователя');
                return null;
            }
            
            return result.payload;
        } catch (error) {
            console.error('Login error in useAuth:', error);
            return null;
        }
    };

    const logout = async () => {
        try {
            await dispatch(authModule.actions.logout());
            // Проверяем, что токен удален
            const token = localStorage.getItem('token');
            if (token) {
                console.warn('Токен все еще существует после выхода');
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Logout error:', error);
            return null;
        }
    };

    const register = async (userData) => {
        try {
            console.log('Register called with:', userData);
            
            // Очищаем предыдущее состояние
            await logout();
            
            // Проверяем данные перед отправкой
            if (!userData.username?.trim()) {
                console.warn('Имя пользователя обязательно');
                return null;
            }
            if (!userData.email?.trim()) {
                console.warn('Email обязателен');
                return null;
            }
            if (!userData.password) {
                console.warn('Пароль обязателен');
                return null;
            }
            
            const result = await dispatch(authModule.actions.register(userData));
            console.log('Register result:', result);
            
            // Проверяем результат регистрации
            if (!result || !result.payload || !result.payload.username) {
                console.warn('Регистрация не удалась: отсутствуют данные пользователя');
                return null;
            }
            
            // Добавляем задержку перед проверкой токена
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Проверяем токен после регистрации
            const authData = checkAuth();
            console.log('Auth data from token:', authData);
            
            if (!authData || !authData.username) {
                console.warn('Токен не содержит данных пользователя после регистрации');
                // Пробуем еще раз через небольшую задержку
                await new Promise(resolve => setTimeout(resolve, 500));
                const retryAuthData = checkAuth();
                console.log('Retry auth data:', retryAuthData);
                
                if (!retryAuthData || !retryAuthData.username) {
                    return null;
                }
                return retryAuthData;
            }
            
            // Если все успешно, возвращаем данные пользователя из токена
            return authData;
        } catch (error) {
            console.error('Register error in useAuth:', error);
            // Очищаем состояние в случае ошибки
            await logout();
            return null;
        }
    };

    const isAuthenticated = () => {
        const userData = checkAuth();
        return Boolean(userData && userData.username);
    };

    return {
        user,
        loading,
        error,
        login,
        logout,
        register,
        isAuthenticated
    };
};