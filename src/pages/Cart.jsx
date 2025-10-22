import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Single item component inside the cart
const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    updateQuantity(item.id, newQuantity);
  };
  
  const handleBuyNow = () => {
    // Since the item is already in the cart, clicking Buy Now simply
    // directs the user to the checkout page.
    navigate('/checkout');
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b py-4 transition hover:bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4 w-full sm:w-1/2">
        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" 
             onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/64x64/CCCCCC/333333?text=No" }}/>
        <div className='flex-grow'>
          <h4 className="font-semibold text-gray-800">{item.name}</h4>
          <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-8 w-full sm:w-1/2 mt-3 sm:mt-0">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-16 p-2 border rounded-md text-center focus:border-blue-500"
        />
        <p className="font-bold text-gray-900 w-20 text-right hidden sm:block">${(item.price * item.quantity).toFixed(2)}</p>
        
        {/* NEW BUY NOW BUTTON - Changed from rounded-full to rounded-md */}
        <button
            onClick={handleBuyNow}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-3 rounded-md text-sm transition shadow-md hidden lg:inline"
        >
            Buy Now
        </button>
        
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 hover:text-red-700 p-2 rounded-md transition"
          aria-label={`Remove ${item.name}`}
        >
          {/* Trash Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M14 2h-4"></path></svg>
        </button>
      </div>
    </div>
  );
};


const Cart = () => {
  const { cartItems, totalCost } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Helper component for displaying login prompt when not authenticated
  if (!isAuthenticated) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-lg border-t-4 border-blue-500">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Please Log In</h1>
        <p className="text-lg text-gray-600 mb-6">Log in to view and manage your persistent shopping cart.</p>
        <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition shadow-md">
          Go to Login
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Your Shopping Cart is Empty 😔</h1>
        <p className="text-lg text-gray-600 mb-6">Time to start shopping!</p>
        <Link to="/" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition shadow-md">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Shopping Cart</h1>
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        
        {/* Cart Item List */}
        <div className="divide-y divide-gray-200">
          {cartItems.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        
        {/* Cart Summary */}
        <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
          <div className="w-full sm:w-80 space-y-3">
            <div className="flex justify-between text-xl font-semibold">
              <span>Subtotal:</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 text-right">Shipping calculated at checkout.</p>
            {/* PROCEED TO CHECKOUT BUTTON - Changed from rounded-xl to rounded-md */}
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full block text-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-md transition shadow-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
