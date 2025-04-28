import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/actions/productsActions';
import { addToCart } from '../store/actions/cartActions';
import Loading from '../components/Loading';
import Error from '../components/Error';
import './Products.css';

const Products = () => {
    const { items, loading, error, hasMore, page } = useSelector(state => state.products);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProducts(1));
    }, [dispatch]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            dispatch(fetchProducts(page));
        }
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    if (error) return <Error message={error} />;
    
    return (
        <div className="products-container">
            <h2>Список товаров</h2>
            
            <div className="products-grid">
                {items.map(product => (
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
            
            {hasMore && !loading && (
                <button 
                    onClick={handleLoadMore}
                    className="load-more-button"
                >
                    Загрузить еще
                </button>
            )}
        </div>
    );
};

export default Products;