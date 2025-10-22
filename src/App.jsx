import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { ProtectedRoute } from './context/AuthContext';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header /> 
      <main className="container mx-auto p-4 flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Client Protected Routes */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/confirmation/:orderId" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />

          {/* Admin Protected Routes: Both paths render AdminDashboard, which internally checks useLocation for the view. */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          {/* Fallback route */}
          <Route path="*" element={<h1 className="text-center py-20 text-3xl font-bold text-red-500">404 - Page Not Found</h1>} />
        </Routes>
      </main>
      <footer className="bg-gray-800 text-white text-center p-3 text-sm mt-auto">
        E-Com (React Frontend Project) - Auth and Cart data persisted using LocalStorage.
      </footer>
    </div>
  );
}

export default App;
