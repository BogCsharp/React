import axios from 'axios';

const API_URL = 'http://localhost:5112/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Добавляем перехватчик для логирования запросов
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const userData = JSON.parse(atob(token));
                if (userData && userData.username) {
                    config.headers.Authorization = `Bearer ${token}`;
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Добавляем перехватчик для логирования ответов
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        let errorMessage = 'Произошла ошибка при выполнении запроса';
        
        if (error.response) {
            errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
        } else if (error.request) {
            errorMessage = 'Сервер не отвечает';
        }
        
        return Promise.reject(new Error(errorMessage));
    }
);

// Функции для работы с аутентификацией
export const login = async (credentials) => {
    try {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        
        const response = await api.post('/auth/login', {
            username: credentials.username,
            password: credentials.password
        });
        
        if (!response.data) {
            throw new Error('Пустой ответ от сервера');
        }
        
        const user = response.data;
        
        if (!user.username) {
            throw new Error('Неверный формат данных пользователя');
        }
        
        const tokenData = {
            id: user.id || user.userId,
            username: user.username,
            email: user.email
        };
        
        const tokenString = JSON.stringify(tokenData);
        const token = btoa(tokenString);
        
        localStorage.setItem('token', token);
        
        const savedToken = localStorage.getItem('token');
        
        if (savedToken !== token) {
            throw new Error('Ошибка сохранения токена');
        }
        
        const decodedToken = atob(savedToken);
        const parsedToken = JSON.parse(decodedToken);
        
        if (!parsedToken || !parsedToken.username) {
            throw new Error('Ошибка валидации токена');
        }
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return tokenData;
    } catch (error) {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const registerResponse = await api.post('/auth/register', {
            username: userData.username,
            email: userData.email,
            password: userData.password
        });
        
        if (registerResponse.data.message === 'User registered successfully' || 
            registerResponse.data.success === true) {
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            try {
                const loginResponse = await api.post('/auth/login', {
                    username: userData.username,
                    password: userData.password
                });
                
                if (!loginResponse.data) {
                    throw new Error('Не удалось выполнить вход после регистрации');
                }
                
                const user = loginResponse.data;
                
                if (!user.username) {
                    throw new Error('Неверный формат данных пользователя');
                }
                
                const tokenData = {
                    id: user.id || user.userId,
                    username: user.username,
                    email: user.email
                };
                
                const tokenString = JSON.stringify(tokenData);
                const token = btoa(tokenString);
                
                localStorage.setItem('token', token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                return tokenData;
            } catch (loginError) {
                throw new Error('Не удалось выполнить вход после регистрации');
            }
        }
        
        throw new Error('Ошибка регистрации');
    } catch (error) {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        throw error;
    }
};

export const logout = async () => {
    try {
        // Удаляем токен из localStorage
        localStorage.removeItem('token');
        
        // Очищаем заголовок Authorization
        delete api.defaults.headers.common['Authorization'];
        
        return true;
    } catch (error) {
        throw error;
    }
};

// Добавляем функцию проверки токена
export const checkAuth = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }
        
        // Пробуем декодировать токен
        const decodedToken = atob(token);
        
        const userData = JSON.parse(decodedToken);
        
        if (!userData || !userData.username) {
            localStorage.removeItem('token');
            return null;
        }
        
        return userData;
    } catch (error) {
        localStorage.removeItem('token');
        return null;
    }
};

// Функции для работы с продуктами
export const getProducts = async (page = 1) => {
    try {
        const pageNumber = typeof page === 'object' ? 1 : page;
        const response = await api.get(`/products?page=${pageNumber}`);
        
        // Проверяем и форматируем ответ
        const data = response.data;
        
        // Вычисляем hasMore на основе totalCount и pageSize
        const hasMore = data.totalCount > (data.page * data.pageSize);
        
        const formattedData = {
            products: Array.isArray(data.products) ? data.products : [],
            hasMore,
            totalPages: Math.ceil(data.totalCount / data.pageSize),
            currentPage: data.page
        };
        
        return formattedData;
    } catch (error) {
        throw error;
    }
};

// Функции для работы с корзиной
export const getCart = async () => {
    try {
        const response = await api.get('/cart/items');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addToCart = async (productId, quantity = 1) => {
    try {
        const response = await api.post('/cart/items', { productId, quantity });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeFromCart = async (productId) => {
    try {
        const response = await api.delete(`/cart/items/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCartItem = async (productId, quantity) => {
    try {
        const response = await api.put(`/cart/items/${productId}`, { quantity });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Функции для работы с заказами
export const getOrders = async () => {
    try {
        const user = checkAuth();
        if (!user || !user.username) {
            throw new Error('Требуется авторизация');
        }
        const response = await api.get(`/orders/user/${user.username}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                throw new Error('Требуется авторизация');
            }
            throw new Error(error.response.data?.message || 'Ошибка при получении заказов');
        }
        throw error;
    }
};

export const createOrder = async (orderData) => {
    try {
        const response = await api.post('/orders', orderData);
        return response.data;
    } catch (error) {
        if (error.response) {
            const errorData = error.response.data;
            if (error.response.status === 400) {
                throw new Error(errorData.message || 'Ошибка валидации данных');
            }
            if (error.response.status === 401) {
                throw new Error('Требуется авторизация');
            }
            throw new Error(errorData.message || 'Ошибка при создании заказа');
        }
        throw new Error('Ошибка при отправке запроса');
    }
};

export const getOrder = async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
}; 