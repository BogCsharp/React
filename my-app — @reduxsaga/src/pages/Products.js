import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { productsModule, cartModule } from '../store/modules';
import Loading from '../components/Loading';
import Error from '../components/Error';
import './Products.css';

const Products = () => {
    const dispatch = useDispatch();
    const productsState = useSelector(state => state.products);
    const { items: products = [], loading, error, hasMore, currentPage } = productsState;

    useEffect(() => {
        dispatch(productsModule.actions.getProducts(1));
        return () => {
            dispatch(productsModule.actions.clearError());
        };
    }, [dispatch]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
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

    const shouldShowLoadMore = Boolean(hasMore) && !loading && products.length > 0;

    if (error) {
        return <Error message={error} />;
    }

    if (loading && !products.length) {
        return <Loading />;
    }

    return (
        <main className="products-container" role="main" id="main-content" tabIndex="-1">
            <h1 className="visually-hidden">Список товаров</h1>
            <h2 id="products-heading">Список товаров</h2>
            
            <div 
                className="products-grid" 
                role="list" 
                aria-labelledby="products-heading"
            >
                {products.map(product => (
                    <article 
                        key={product.id} 
                        className="product-card"
                        role="listitem"
                    >
                        <h3>{product.name}</h3>
                        <p>
                            <span className="visually-hidden">Дата выпуска: </span>
                            {new Date(product.releaseDate).toLocaleDateString()}
                        </p>
                        <p>
                            <span className="visually-hidden">Цена: </span>
                            {product.price} руб.
                        </p>
                        <button 
                            onClick={() => handleAddToCart(product)}
                            aria-label={`Добавить ${product.name} в корзину`}
                        >
                            Добавить в корзину
                        </button>
                    </article>
                ))}
            </div>
            
            {loading && <Loading />}
            
            {shouldShowLoadMore && (
                <div className="load-more-container">
                    <button 
                        onClick={handleLoadMore}
                        className="load-more-button"
                        aria-label="Загрузить еще товары"
                    >
                        Загрузить еще
                    </button>
                </div>
            )}
        </main>
    );
};

export default Products;