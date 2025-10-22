import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext'; // Import useAuth to scope the cart to the current user

const CartContext = createContext();

// 1. Helper to safely retrieve cart data for the current user
const getInitialCart = (userId) => {
  if (!userId) return [];
  try {
    const localData = localStorage.getItem(`ecomCartItems_${userId}`);
    return localData ? JSON.parse(localData) : [];
  } catch (error) {
    console.error("Error retrieving cart from LocalStorage:", error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth(); // Get current user (which contains the unique email/id)
  const userId = user?.email || 'guest';
  
  // Initialize cart state using the user-specific key
  const [cartItems, setCartItems] = useState(() => getInitialCart(userId));

  // UseEffect to sync state changes to LocalStorage whenever cartItems or userId changes
  useEffect(() => {
    // We only save if a user is logged in or if it's the current guest session.
    localStorage.setItem(`ecomCartItems_${userId}`, JSON.stringify(cartItems));
  }, [cartItems, userId]);

  // UseEffect to re-initialize cart when the user logs in/out
  useEffect(() => {
    setCartItems(getInitialCart(userId));
  }, [userId]);

  // --- Cart Operations ---

  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      // If product exists, increase quantity
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      // If product is new, add it with quantity 1
      setCartItems([...cartItems, { ...product, quantity: quantity }]);
    }
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const updateQuantity = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (quantity < 0) {
        toast.error("Quantity cannot be negative.");
        return;
    }
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === productId ? { ...item, quantity: quantity } : item
    ));
  };

  const removeFromCart = (productId) => {
    const itemToRemove = cartItems.find(item => item.id === productId);
    setCartItems(cartItems.filter(item => item.id !== productId));
    toast.error(`${itemToRemove?.name || 'Item'} removed.`);
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared successfully.");
  };

  // --- Calculations ---
  
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalCost = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const contextValue = {
    cartItems,
    totalQuantity,
    totalCost,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    // Note: We expose the setter only for temporary debugging or special logic if needed
    // In a final app, this would be avoided:
    setCartItems 
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to use the Cart Context
export const useCart = () => useContext(CartContext);
