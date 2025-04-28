import { useState, useEffect } from 'react';

export const useServerGoods = (page = 1, pageSize = 10) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const normalizedPage = Number(page) || 1;
          const normalizedPageSize = Number(pageSize) || 10;
  
          if (isNaN(normalizedPage) || isNaN(normalizedPageSize)) {
            throw new Error("Некорректные параметры запроса");
          }
  
          setLoading(true);
          setError(null);
          
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
          setData(prev => normalizedPage === 1 ? result.products : [...prev, ...result.products]);
          setHasMore(result.products.length === normalizedPageSize);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [page, pageSize]);
  
    return { data, loading, error, hasMore };
  };