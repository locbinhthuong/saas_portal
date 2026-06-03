import React, { createContext, useState, useContext, useEffect } from 'react';
import { products as initialMockProducts } from './mockProducts';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      } else {
        // Fallback to initial if error (maybe not seeded yet)
        setProducts(initialMockProducts);
      }
    } catch (err) {
      console.error(err);
      setProducts(initialMockProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        fetchProducts(); // refresh
      }
    } catch(e) {}
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(p => p._id === id || p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p._id !== id && p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
