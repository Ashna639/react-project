import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; 
import { CartProvider } from './context/CartContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter provides routing capability */}
    <BrowserRouter> 
      {/* 1. AuthProvider must be the highest level to manage user roles/status globally */}
      <AuthProvider>
        {/* 2. OrderProvider and ProductProvider are next, managing persisted data */}
        <OrderProvider>
          {/* ProductProvider enables Admin to update the catalog */}
          <ProductProvider> 
            {/* 3. CartProvider relies on product data for adding items */}
            <CartProvider>
              <App />
              {/* Global Toast component for all app notifications */}
              <Toaster position="bottom-right" reverseOrder={false} />
            </CartProvider>
          </ProductProvider>
        </OrderProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
