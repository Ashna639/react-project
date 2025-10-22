// 





import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const History = () => {
    const { orderHistory, deleteOrder } = useOrders();
    const { user } = useAuth();
    const navigate = useNavigate();

    // The orderHistory provided by context is already scoped to the current user (client).
    const clientHistory = orderHistory;
    
    const [orders, setOrders] = useState(clientHistory);

    useEffect(() => {
        setOrders(clientHistory);
    }, [clientHistory]); // Depend on the history from context

    // --- Handler for Client Deletion ---
    const handleCancelOrder = (orderId, total) => {
        // Custom Confirmation Toast (replacing window.confirm)
        toast((t) => (
            <div className="flex flex-col space-y-2">
                <p className="font-semibold text-gray-800">
                    Confirm Cancellation of Order ID: <span className="text-red-600">{orderId}</span> (Total ${total.toFixed(2)})
                </p>
                <p className="text-sm text-gray-600">This action cannot be reversed.</p>
                <div className="flex justify-end space-x-2">
                    <button 
                        onClick={() => toast.dismiss(t.id)} 
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm transition"
                    >
                        Keep Order
                    </button>
                    <button 
                        onClick={() => {
                            const orderUserId = user?.email || 'guest';
                            if (deleteOrder(orderId, orderUserId)) {
                                setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
                                toast.dismiss(t.id);
                            }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                    >
                        Cancel Permanently
                    </button>
                </div>
            </div>
        ), { duration: 10000, id: `confirm-${orderId}` });
    };


    if (!user) {
        return (
            <div className="text-center py-20 bg-white rounded-xl shadow-lg border-t-4 border-blue-500">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Access Denied</h1>
                <p className="text-lg text-gray-600 mb-6">Please log in to view your order history.</p>
                <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition shadow-md">
                    Go to Login
                </Link>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="py-20 text-center bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">No Orders Placed Yet 📜</h1>
                <p className="text-lg text-gray-600 mb-6">Your history will show up here after checkout.</p>
                <Link to="/" className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition shadow-md">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="py-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Your Order History</h1>
            <p className="text-sm text-gray-500 mb-6">Viewing orders for user: <span className="font-mono font-semibold text-gray-700">{user.email}</span></p>

            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.orderId} className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-purple-500 transition-shadow hover:shadow-xl">
                        <div className="flex justify-between items-start mb-3 border-b pb-2">
                            <div>
                                <p className="text-xl font-bold text-gray-800">Order ID: <span className="text-purple-600">{order.orderId}</span></p>
                                {/* CRITICAL FIX: Use toLocaleString for clearer date/time display */}
                                <p className="text-sm text-gray-500">Date: {new Date(order.date).toLocaleString()}</p>
                            </div>
                            <p className="text-2xl font-extrabold text-green-600">${order.total.toFixed(2)}</p>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3 line-clamp-1">
                            **Items:** {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                        </p>
                        
                        <div className="flex justify-end space-x-3">
                            <Link to={`/confirmation/${order.orderId}`} className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition py-1 px-3 border border-blue-100 rounded-md">
                                View Details
                            </Link>
                            <button 
                                onClick={() => handleCancelOrder(order.orderId, order.total)}
                                className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded-md transition shadow-sm"
                            >
                                Cancel Order
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;
