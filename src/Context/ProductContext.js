import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProducts } from '../APIs/productAPI';
import { fetchCategories } from '../APIs/CategoriesAPI';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);

      // Map product quantity to stock property
      const mergedProducts = Array.isArray(productsData)
        ? productsData.map((product) => {
            console.log('Product from API:', product);
            console.log('Product keys:', Object.keys(product));
            console.log('Image field value:', product.imageUrl);
            return {
              ...product,
              stock: product.quantity || 0,
            };
          })
        : [];

      console.log('Merged products with stock:', mergedProducts);
      setProducts(mergedProducts);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setError(null);
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch data';
      console.error('Data loading error:', errorMsg);
      setError(errorMsg);
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const removeProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  return (
    <ProductContext.Provider value={{ products, categories, loading, error, loadData, removeProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
}
