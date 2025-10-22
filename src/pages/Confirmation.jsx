import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';

const Confirmation = () => {
  const { orderId } = useParams(); // Get the orderId from the URL
  const { getOrderById } = useOrders();
  const order = getOrderById(orderId);

  // Redirect to history if order ID is invalid or not found (safety check)
  if (!order) {
    return <Navigate to="/history" replace />;
  }

  const { items, total, shippingDetails, date } = order;

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <div className="bg-white shadow-2xl rounded-xl p-8 text-center border-t-8 border-green-500">
        
        <h1 className="text-4xl font-extrabold text-green-600 mb-2">Order Success! 🎉</h1>
        <p className="text-xl text-gray-700 mb-6">Thank you for your purchase.</p>
        
        {/* Order Details Summary */}
        <div className="text-left space-y-3 mb-8 p-4 bg-gray-50 rounded-lg border">
          <p className="text-lg font-bold">Order ID: <span className="font-normal text-blue-600">{orderId}</span></p>
          <p className="text-lg font-bold">Total Charged: <span className="font-normal text-green-600">${total.toFixed(2)}</span></p>
          <p className="text-lg font-bold">Order Date: <span className="font-normal">{new Date(date).toLocaleDateString()}</span></p>
        </div>
        
        {/* Shipping Information */}
        <div className="text-left mb-8">
          <h2 className="text-2xl font-bold mb-3 border-b pb-1 text-blue-500">Shipping To</h2>
          <p><strong>Name:</strong> {shippingDetails.name}</p>
          <p><strong>Address:</strong> {shippingDetails.address}, {shippingDetails.city}, {shippingDetails.zip}</p>
        </div>
        
        {/* Items Summary */}
        <div className="text-left mb-8">
          <h2 className="text-2xl font-bold mb-3 border-b pb-1 text-blue-500">Items Ordered ({items.length})</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700 max-h-32 overflow-y-auto">
            {items.map(item => (
              <li key={item.id} className="text-sm">
                {item.name} x {item.quantity} (${(item.price * item.quantity).toFixed(2)})
              </li>
            ))}
          </ul>
        </div>
        
        <Link to="/" className="text-blue-600 hover:text-blue-800 transition font-medium mt-4 inline-block mr-4">
          Continue Shopping
        </Link>
        <Link to="/history" className="text-blue-600 hover:text-blue-800 transition font-medium mt-4 inline-block">
          View Order History
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;
