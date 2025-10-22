import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext'; // CRITICAL: Import useAuth

const OrderContext = createContext();

// Helper function to get initial state from LocalStorage for a specific user or key
const getOrdersByUserId = (userId) => {
  if (!userId) return [];
  try {
    const localData = localStorage.getItem(`ecomOrderHistory_${userId}`);
    return localData ? JSON.parse(localData) : [];
  } catch (error) {
    console.error(`Error retrieving orders for ${userId} from LocalStorage:`, error);
    return [];
  }
};

// Helper function to save orders for a specific user
const saveOrdersByUserId = (userId, orders) => {
  if (!userId) return;
  try {
    localStorage.setItem(`ecomOrderHistory_${userId}`, JSON.stringify(orders));
  } catch (error) {
    console.error(`Error saving orders for ${userId} to LocalStorage:`, error);
  }
};

export const OrderProvider = ({ children }) => {
  const { user } = useAuth(); // Get current user
  const currentUserId = user?.email || 'guest';
  
  // 1. New State: This will hold the orders only for the current client
  const [clientOrderHistory, setClientOrderHistory] = useState([]);
  
  // 2. Load Client Orders on User Change
  useEffect(() => {
    // When the user changes (login/logout), reload the orders specific to that user
    const orders = getOrdersByUserId(currentUserId);
    setClientOrderHistory(orders);
  }, [currentUserId]); 

  // --- Admin/Global Functions ---

  const getAllOrders = () => {
    let allOrders = [];
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ecomOrderHistory_')) {
            const userId = key.replace('ecomOrderHistory_', '');
            try {
                const userOrders = JSON.parse(localStorage.getItem(key));
                allOrders = allOrders.concat(userOrders.map(order => ({
                    ...order, 
                    orderUserId: userId 
                })));
            } catch (error) {
                console.error(`Failed to parse orders for key ${key}`, error);
            }
        }
    }
    return allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
  };


  // --- Client Functions ---

  const placeOrder = (items, shippingDetails, total, userId = currentUserId) => {
    const existingOrders = getOrdersByUserId(userId);

    const newOrder = {
      orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: new Date().toISOString(),
      items: items,
      total: total,
      shippingDetails: shippingDetails,
    };
    
    const updatedOrders = [newOrder, ...existingOrders];
    saveOrdersByUserId(userId, updatedOrders);
    
    // CRITICAL: Update the client's visible state immediately
    if (userId === currentUserId) {
        setClientOrderHistory(updatedOrders);
    }
    
    toast.success(`Order ${newOrder.orderId} saved!`);
    return newOrder.orderId;
  };
  
  const getOrderById = (orderId, userId = currentUserId) => {
    const history = getOrdersByUserId(userId);
    return history.find(order => order.orderId === orderId);
  }

  const deleteOrder = (orderId, orderUserId) => {
    if (!orderUserId) {
        toast.error("Error: Cannot delete order without User ID.");
        return false;
    }
    
    const userOrders = getOrdersByUserId(orderUserId);
    const updatedOrders = userOrders.filter(order => order.orderId !== orderId);

    saveOrdersByUserId(orderUserId, updatedOrders);
    
    // CRITICAL: Update the client's visible state immediately
    if (orderUserId === currentUserId) {
        setClientOrderHistory(updatedOrders);
    }
    
    // If it was an admin action, we need to refresh the admin view
    if (user?.role === 'admin') {
         // This is handled by AdminDashboard's useEffect listening to internal state changes
    }
    
    toast.success(`Order ${orderId} successfully cancelled/deleted.`);
    return true;
  };

  const contextValue = {
    orderHistory: clientOrderHistory, // Expose the current client's orders
    getAllOrders, 
    placeOrder,
    getOrderById,
    deleteOrder, 
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
