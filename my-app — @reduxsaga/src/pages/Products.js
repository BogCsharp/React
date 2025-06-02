import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { productsModule, cartModule } from '../store/modules';
import Loading from '../components/Loading';
import Error from '../components/Error';
import './Products.css';

const Products = () => {
    const dispatch = useDispatch();
    const productsState = useSelector(state => {
        const currentState = {
            products: state.products.items,
            loading: state.products.loading,
            hasMore: state.products.hasMore,
            currentPage: state.products.currentPage,
            error: state.products.error
        };
        console.log('Current products state:', currentState);
        return state.products;
    });
    const { items: products = [], loading, error, hasMore, currentPage } = productsState;

    useEffect(() => {
        console.log('Products component mounted');
        dispatch(productsModule.actions.getProducts(1));
        return () => {
            dispatch(productsModule.actions.clearError());
        };
    }, [dispatch]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            console.log('Loading more products, current page:', currentPage);
            dispatch(productsModule.actions.getProducts(currentPage + 1));
        }
    };

    const handleAddToCart = (product) => {
        try {
            dispatch(cartModule.actions.addToCart({ product, quantity: 1 }));
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    // Проверяем условия отображения кнопки
    const shouldShowLoadMore = Boolean(hasMore) && !loading && products.length > 0;
    console.log('Load More button conditions:', {
        hasMore,
        loading,
        productsLength: products.length,
        shouldShow: shouldShowLoadMore,
        currentPage,
        products
    });

    if (error) {
        return <Error message={error} />;
    }

    if (loading && !products.length) {
        return <Loading />;
    }

    return (
        <div className="products-container">
            <h2>Список товаров</h2>
            
            <div className="products-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <h3>{product.name}</h3>
                        <p>Дата выпуска: {new Date(product.releaseDate).toLocaleDateString()}</p>
                        <p>Цена: {product.price} руб.</p>
                        <button onClick={() => handleAddToCart(product)}>
                            Добавить в корзину
                        </button>
                    </div>
                ))}
            </div>
            
            {loading && <Loading />}
            
            {shouldShowLoadMore && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button 
                        onClick={handleLoadMore}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            marginBottom: '20px'
                        }}
                    >
                        Загрузить еще
                    </button>
                </div>
            )}
        </div>
    );
};

export default Products;