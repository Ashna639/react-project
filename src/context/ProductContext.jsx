import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ProductContext = createContext();

// Default product list to start with if LocalStorage is empty
const DEFAULT_PRODUCTS = [
  { id: 1, name: "Premium Office Chair", price: 349.99, description: "Ergonomic chair with lumbar support.", image: "https://placehold.co/400x300/403075/ffffff?text=Chair", soldOut: false },
  { id: 2, name: "Mechanical Keyboard", price: 120.00, description: "RGB backlit, tactile switches.", image: "https://placehold.co/400x300/307550/ffffff?text=Keyboard", soldOut: false },
  { id: 3, name: "Wireless Mouse", price: 45.50, description: "Silent click, 1600 DPI.", image: "https://placehold.co/400x300/753030/ffffff?text=Mouse", soldOut: false },
];

// Helper to safely retrieve product data from LocalStorage
const getInitialProducts = () => {
  try {
    const localData = localStorage.getItem('ecomProducts');
    // If localData exists, parse it. Otherwise, use the default list.
    return localData ? JSON.parse(localData) : DEFAULT_PRODUCTS;
  } catch (error) {
    console.error("Error retrieving products from LocalStorage:", error);
    return DEFAULT_PRODUCTS;
  }
};

export const ProductProvider = ({ children }) => {
  // Initialize product list state from LocalStorage
  const [allProducts, setAllProducts] = useState(getInitialProducts);

  // UseEffect to sync state changes to LocalStorage
  useEffect(() => {
    // CRITICAL: We only save if allProducts is initialized and is an array
    if (Array.isArray(allProducts)) {
        localStorage.setItem('ecomProducts', JSON.stringify(allProducts));
    }
  }, [allProducts]);

  // --- Product Operations ---
  
  const addProduct = (product) => {
    // Generate a simple unique ID
    const newProduct = {
      ...product,
      id: Date.now(), 
      soldOut: false,
    };
    setAllProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (updatedProduct) => {
    setAllProducts(prev => prev.map(p => 
      p.id === updatedProduct.id ? { ...p, ...updatedProduct, price: parseFloat(updatedProduct.price) } : p
    ));
  };

  const deleteProduct = (productId) => {
    setAllProducts(prev => prev.filter(p => p.id !== productId));
  };

  const contextValue = {
    allProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
