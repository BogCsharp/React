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
        console.log('Request config:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data
        });
        
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
                console.error('Error parsing token:', error);
                localStorage.removeItem('token');
            }
        }
        
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Добавляем перехватчик для логирования ответов
api.interceptors.response.use(
    (response) => {
        console.log('Response:', response.data);
        return response;
    },
    (error) => {
        console.error('Response error:', {
            status: error.response?.status,
            data: error.response?.data,
            config: error.config
        });
        
        // Преобразуем ошибку в более понятный формат
        let errorMessage = 'Произошла ошибка при выполнении запроса';
        
        if (error.response) {
            // Сервер ответил с ошибкой
            errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
        } else if (error.request) {
            // Запрос был отправлен, но ответ не получен
            errorMessage = 'Сервер не отвечает';
        }
        
        return Promise.reject(new Error(errorMessage));
    }
);

// Функции для работы с аутентификацией
export const login = async (credentials) => {
    console.log('Login API call with:', credentials);
    try {
        // Очищаем предыдущее состояние
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        
        const response = await api.post('/auth/login', {
            username: credentials.username,
            password: credentials.password
        });
        
        console.log('Login response:', response.data);
        
        if (!response.data) {
            console.warn('Пустой ответ от сервера');
            throw new Error('Пустой ответ от сервера');
        }
        
        // Используем данные пользователя для аутентификации
        const user = response.data;
        console.log('User data from login:', user);
        
        // Проверяем наличие необходимых данных
        if (!user.username) {
            console.warn('Отсутствует имя пользователя в ответе');
            throw new Error('Неверный формат данных пользователя');
        }
        
        // Создаем простой токен на основе данных пользователя
        const tokenData = {
            id: user.id || user.userId,
            username: user.username,
            email: user.email
        };
        console.log('Token data:', tokenData);
        
        // Кодируем токен
        const tokenString = JSON.stringify(tokenData);
        console.log('Token string:', tokenString);
        
        const token = btoa(tokenString);
        console.log('Generated token:', token);
        
        // Сохраняем токен
        localStorage.setItem('token', token);
        
        // Проверяем, что токен сохранился и может быть прочитан
        const savedToken = localStorage.getItem('token');
        console.log('Saved token:', savedToken);
        
        if (savedToken !== token) {
            console.warn('Token was not saved correctly');
            throw new Error('Ошибка сохранения токена');
        }
        
        // Проверяем, что токен можно декодировать
        const decodedToken = atob(savedToken);
        console.log('Decoded saved token:', decodedToken);
        
        const parsedToken = JSON.parse(decodedToken);
        console.log('Parsed saved token:', parsedToken);
        
        if (!parsedToken || !parsedToken.username) {
            console.warn('Saved token is invalid');
            throw new Error('Ошибка валидации токена');
        }
        
        // Добавляем токен в заголовки
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Добавляем небольшую задержку перед возвратом данных
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Возвращаем данные пользователя
        return tokenData;
    } catch (error) {
        // В случае ошибки очищаем состояние
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        
        console.error('Login API error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
};

export const register = async (userData) => {
    console.log('Register API call with:', userData);
    try {
        // Сначала регистрируем пользователя
        const registerResponse = await api.post('/auth/register', {
            username: userData.username,
            email: userData.email,
            password: userData.password
        });
        console.log('Register API response:', registerResponse.data);
        
        // Проверяем успешность регистрации
        if (registerResponse.data.message === 'User registered successfully' || 
            registerResponse.data.success === true) {
            console.log('Registration successful, attempting login');
            
            // Добавляем небольшую задержку перед входом
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            try {
                // Выполняем вход
                const loginResponse = await api.post('/auth/login', {
                    username: userData.username,
                    password: userData.password
                });
                
                console.log('Login response after registration:', loginResponse.data);
                
                if (!loginResponse.data) {
                    console.warn('Пустой ответ от сервера при входе');
                    throw new Error('Не удалось выполнить вход после регистрации');
                }
                
                // Используем данные пользователя для аутентификации
                const user = loginResponse.data;
                console.log('User data from login:', user);
                
                // Создаем простой токен на основе данных пользователя
                const tokenData = {
                    id: user.id || user.userId,
                    username: user.username,
                    email: user.email
                };
                console.log('Token data:', tokenData);
                
                // Кодируем токен
                const tokenString = JSON.stringify(tokenData);
                console.log('Token string:', tokenString);
                
                const token = btoa(tokenString);
                console.log('Generated token after registration:', token);
                
                // Сохраняем токен
                localStorage.setItem('token', token);
                
                // Проверяем, что токен сохранился и может быть прочитан
                const savedToken = localStorage.getItem('token');
                console.log('Saved token:', savedToken);
                
                if (savedToken !== token) {
                    console.warn('Token was not saved correctly');
                    throw new Error('Ошибка сохранения токена');
                }
                
                // Проверяем, что токен можно декодировать
                const decodedToken = atob(savedToken);
                console.log('Decoded saved token:', decodedToken);
                
                const parsedToken = JSON.parse(decodedToken);
                console.log('Parsed saved token:', parsedToken);
                
                if (!parsedToken || !parsedToken.username) {
                    console.warn('Saved token is invalid');
                    throw new Error('Ошибка валидации токена');
                }
                
                // Добавляем токен в заголовки
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Возвращаем данные пользователя
                return tokenData;
            } catch (loginError) {
                console.error('Login error after registration:', loginError);
                throw new Error('Не удалось выполнить вход после регистрации');
            }
        }
        
        throw new Error('Регистрация не удалась: ' + (registerResponse.data.message || 'Неизвестная ошибка'));
    } catch (error) {
        console.error('Register API error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
};

export const logout = async () => {
    try {
        // Удаляем токен из localStorage
        localStorage.removeItem('token');
        
        // Очищаем заголовок Authorization
        delete api.defaults.headers.common['Authorization'];
        
        console.log('Logout successful, token removed');
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

// Добавляем функцию проверки токена
export const checkAuth = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found in localStorage');
            return null;
        }
        
        // Пробуем декодировать токен
        const decodedToken = atob(token);
        console.log('Decoded token:', decodedToken);
        
        const userData = JSON.parse(decodedToken);
        console.log('Parsed token data:', userData);
        
        if (!userData || !userData.username) {
            console.warn('Invalid token data');
            localStorage.removeItem('token');
            return null;
        }
        
        return userData;
    } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('token');
        return null;
    }
};

// Функции для работы с продуктами
export const getProducts = async (page = 1) => {
    console.log('Getting products for page:', page);
    try {
        const pageNumber = typeof page === 'object' ? 1 : page;
        const response = await api.get(`/products?page=${pageNumber}`);
        
        // Проверяем и форматируем ответ
        const data = response.data;
        console.log('Raw server response:', data);
        
        // Вычисляем hasMore на основе totalCount и pageSize
        const hasMore = data.totalCount > (data.page * data.pageSize);
        console.log('Calculating hasMore:', {
            totalCount: data.totalCount,
            currentPage: data.page,
            pageSize: data.pageSize,
            hasMore
        });
        
        const formattedData = {
            products: Array.isArray(data.products) ? data.products : [],
            hasMore,
            totalPages: Math.ceil(data.totalCount / data.pageSize),
            currentPage: data.page
        };
        
        console.log('Formatted products data:', {
            productsCount: formattedData.products.length,
            hasMore: formattedData.hasMore,
            totalPages: formattedData.totalPages,
            currentPage: formattedData.currentPage
        });
        
        return formattedData;
    } catch (error) {
        console.error('Get products error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
};

// Функции для работы с корзиной
export const getCart = async () => {
    try {
        const response = await api.get('/cart/items');
        console.log('Get cart response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Get cart error:', error);
        throw error;
    }
};

export const addToCart = async (productId, quantity = 1) => {
    try {
        console.log('Adding to cart:', { productId, quantity });
        const response = await api.post('/cart/items', { productId, quantity });
        console.log('Add to cart response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Add to cart error:', error);
        throw error;
    }
};

export const removeFromCart = async (productId) => {
    try {
        console.log('Removing from cart:', productId);
        const response = await api.delete(`/cart/items/${productId}`);
        console.log('Remove from cart response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Remove from cart error:', error);
        throw error;
    }
};

export const updateCartItem = async (productId, quantity) => {
    try {
        console.log('Updating cart item:', { productId, quantity });
        const response = await api.put(`/cart/items/${productId}`, { quantity });
        console.log('Update cart item response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Update cart item error:', error);
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