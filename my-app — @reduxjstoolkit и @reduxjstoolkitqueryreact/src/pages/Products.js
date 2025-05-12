import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { useGetProductsQuery } from '../store/api/apiSlice';
import { useAuth } from '../hooks/UseAuth';
import Loading from '../components/Loading';
import Error from '../components/Error';
import './Products.css';

const Products = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [page, setPage] = React.useState(1);
    const { data, isLoading, error, isFetching } = useGetProductsQuery({ page, userId: user?.id });
    
    console.log('API Response:', data);
    console.log('Loading state:', isLoading);
    console.log('Error state:', error);
    
    const products = data?.products || [];
    console.log('Products array:', products);
    console.log('Has more:', data?.hasMore);
    console.log('Current page:', page);

    const handleLoadMore = () => {
        if (!isFetching) {
            setPage(prev => prev + 1);
        }
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    if (error) {
        console.error('API Error:', error);
        return <Error message={error.data || 'Failed to load products'} />;
    }
    
    return (
        <div className="products-container">
            <h2>Список товаров</h2>
            
            <div className="products-grid">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product.id} className="product-card">
                            <h3>{product.name}</h3>
                            <p>Дата выпуска: {new Date(product.releaseDate).toLocaleDateString()}</p>
                            <p>Цена: {product.price} руб.</p>
                            <button onClick={() => handleAddToCart(product)}>
                                Добавить в корзину
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Товары не найдены</p>
                )}
            </div>
            
            {isLoading && page === 1 && <Loading />}
            
            {!isLoading && data?.hasMore && (
                <div className="load-more-container">
                    <button 
                        onClick={handleLoadMore}
                        className="load-more-button"
                        disabled={isFetching}
                    >
                        {isFetching ? 'Загрузка...' : 'Загрузить еще'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Products;