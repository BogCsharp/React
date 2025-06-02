import { useDispatch, useSelector } from 'react-redux';
import { authModule } from '../store/modules';
import { checkAuth } from '../services/api';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector(state => state.auth);

    const login = async (credentials) => {
        try {
            const result = await dispatch(authModule.actions.login(credentials));
            
            if (!result || !result.payload) {
                return null;
            }

            await new Promise(resolve => setTimeout(resolve, 500));
            
            const userData = checkAuth();
            
            if (!userData || !userData.username) {
                return null;
            }
            
            return result.payload;
        } catch (error) {
            return null;
        }
    };

    const logout = async () => {
        try {
            await dispatch(authModule.actions.logout());
            const token = localStorage.getItem('token');
            if (token) {
                localStorage.removeItem('token');
            }
        } catch (error) {
            return null;
        }
    };

    const register = async (userData) => {
        try {
            await logout();
            
            if (!userData.username?.trim()) {
                return null;
            }
            if (!userData.email?.trim()) {
                return null;
            }
            if (!userData.password) {
                return null;
            }
            
            const result = await dispatch(authModule.actions.register(userData));
            
            if (!result || !result.payload || !result.payload.username) {
                return null;
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const authData = checkAuth();
            
            if (!authData || !authData.username) {
                await new Promise(resolve => setTimeout(resolve, 500));
                const retryAuthData = checkAuth();
                
                if (!retryAuthData || !retryAuthData.username) {
                    return null;
                }
                return retryAuthData;
            }
            
            return authData;
        } catch (error) {
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