import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCartItems, addToCart as addToCartAPI, updateCartItem, removeFromCart as removeFromCartAPI } from '../APIs/cartAPI';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { products, loadData: refreshProducts } = useProducts();
  const [cartRows, setCartRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cartItems = cartRows.map((row) => {
    const product = products.find((p) => p.id === row.productId);
    return {
      id: row.id,
      productId: row.productId,
      name: product?.name ?? `Product #${row.productId}`,
      category: product?.categoryName ?? '',
      price: product ? Number(product.price) : 0,
      quantity: row.quantity,
      totalPrice: row.totalPrice,
    };
  });

  const fetchCartItems = useCallback(async () => {
    if (!user || !user.accessToken) return;
    setLoading(true);
    try {
      const data = await getCartItems(user.accessToken);
      setCartRows(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.message);
      setCartRows([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.accessToken) {
      fetchCartItems();
    }
  }, [user, fetchCartItems]);

  const addToCart = async (product, quantity) => {
    if (!user || !user.accessToken) {
      setError('User not authenticated');
      return;
    }
    try {
      setError('');
      const existing = cartRows.find((row) => row.productId === product.id);
      if (existing) {
        await updateCartItem(existing.id, product.id, existing.quantity + quantity, user.accessToken);
      } else {
        await addToCartAPI(product.id, quantity, user.accessToken);
      }
      await fetchCartItems();
      await refreshProducts();
    } catch (err) {
      setError(err.message);
      console.error('Error adding to cart:', err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!user || !user.accessToken) {
      setError('User not authenticated');
      return;
    }
    try {
      await removeFromCartAPI(cartItemId, user.accessToken);
      await fetchCartItems();
      await refreshProducts();
    } catch (err) {
      setError(err.message);
      console.error('Error removing from cart:', err);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (!user || !user.accessToken) {
      setError('User not authenticated');
      return;
    }
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }
    try {
      const row = cartRows.find((r) => r.id === cartItemId);
      await updateCartItem(cartItemId, row.productId, quantity, user.accessToken);
      await fetchCartItems();
      await refreshProducts();
    } catch (err) {
      setError(err.message);
      console.error('Error updating cart quantity:', err);
    }
  };

  const clearCart = async () => {
    if (!user || !user.accessToken) {
      setError('User not authenticated');
      return;
    }
    try {
      await Promise.all(cartRows.map((row) => removeFromCartAPI(row.id, user.accessToken)));
      setCartRows([]);
      await refreshProducts();
    } catch (err) {
      setError(err.message);
      console.error('Error clearing cart:', err);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        loading,
        error,
        fetchCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
