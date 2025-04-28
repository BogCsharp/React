export const fetchProducts = (page = 1, pageSize = 10) => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_PRODUCTS_START' });
        
        const normalizedPage = Number(page) || 1;
        const normalizedPageSize = Number(pageSize) || 10;

        if (isNaN(normalizedPage) || isNaN(normalizedPageSize)) {
            throw new Error("Некорректные параметры запроса");
        }

        const apiUrl = `http://localhost:5112/api/products?page=${normalizedPage}&pageSize=${normalizedPageSize}`;
        const response = await fetch(apiUrl, {
            headers: { 'Accept': 'application/json' },
            credentials: 'omit'
        });

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Ожидался JSON, но получен: ${text.slice(0, 100)}...`);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        dispatch({
            type: 'FETCH_PRODUCTS_SUCCESS',
            payload: {
                products: result.products,
                page: normalizedPage
            }
        });
    } catch (error) {
        dispatch({
            type: 'FETCH_PRODUCTS_ERROR',
            payload: error.message
        });
    }
}; 