// import React, { useState, useEffect } from 'react';
// import { useNavigate, Navigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useCart } from '../context/CartContext';
// import { useOrders } from '../context/OrderContext';
// import { useAuth } from '../context/AuthContext'; // Needed for user scoping

// const Checkout = () => {
//   // --- Context Hooks ---
//   const { cartItems, totalCost, clearCart, setCartItems } = useCart();
//   const { placeOrder } = useOrders();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   // --- State for Shipping Details ---
//   const [shippingDetails, setShippingDetails] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     address: '',
//     city: '',
//     zip: '',
//   });
//   const [isProcessing, setIsProcessing] = useState(false);
  
//   // --- Cart Backup/Restore State ---
//   const [originalCart, setOriginalCart] = useState(null);
//   const userId = user?.email || 'guest';
//   const backupKey = `originalCartBackup_${userId}`;

//   // 1. Check for Cart Backup on Load
//   useEffect(() => {
//     const backupData = sessionStorage.getItem(backupKey);
//     if (backupData) {
//         // If a backup exists, we are in a 'Buy Now' flow, save the backup locally
//         setOriginalCart(JSON.parse(backupData));
//     }
//     // Cleanup: Remove backup from session storage when leaving checkout
//     return () => {
//         sessionStorage.removeItem(backupKey);
//     };
//   }, [backupKey]);


//   // --- Redirect if cart is empty ---
//   if (cartItems.length === 0 && !originalCart) {
//     return <Navigate to="/cart" replace />;
//   }
  
//   // Determine which items and total to show: current cart or the single item from backup
//   const itemsToPurchase = cartItems.length > 0 ? cartItems : (originalCart || []);
//   const purchaseTotal = itemsToPurchase.reduce((total, item) => total + (item.price * item.quantity), 0);

//   // --- Handlers ---
  
//   const handleChange = (e) => {
//     setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
//   };
  
//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Simple validation
//     if (Object.values(shippingDetails).some(val => !val)) {
//       toast.error('Please fill in all shipping fields.');
//       return;
//     }
    
//     setIsProcessing(true);
//     toast.loading('Processing order...', { id: 'checkout' });

//     // Simulate 2-second payment delay
//     setTimeout(() => {
//       // 1. Place the order
//       const orderId = placeOrder(itemsToPurchase, shippingDetails, purchaseTotal);
      
//       // 2. Clear the cart (This clears the current state, which might be the single 'Buy Now' item)
//       clearCart();
      
//       // 3. Restore the original cart if it was a 'Buy Now' purchase
//       if (originalCart) {
//         // We use setCartItems directly to restore the state from the backup
//         setCartItems(originalCart);
//         // Clear the session storage backup
//         sessionStorage.removeItem(backupKey);
//       }
      
//       // 4. Show success and navigate to confirmation page
//       toast.dismiss('checkout'); // Dismiss the loading toast
//       toast.success('Order placed successfully! 🎉', { duration: 3000 });
//       navigate(`/confirmation/${orderId}`);
//       setIsProcessing(false);
      
//     }, 2000);
//   };

//   // --- Helper Component ---

//   const InputField = ({ label, name, type = 'text', value, onChange }) => (
//     <div>
//       <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
//       <input
//         type={type}
//         id={name}
//         name={name}
//         value={value}
//         onChange={onChange}
//         required
//         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
//         disabled={isProcessing}
//       />
//     </div>
//   );

//   return (
//     <div className="py-8 max-w-4xl mx-auto">
//       <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Checkout</h1>
//       <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* Shipping Form (Left/Top) */}
//         <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
//           <h2 className="text-2xl font-semibold border-b pb-2 text-blue-600">Shipping Details</h2>
          
//           <InputField label="Full Name" name="name" value={shippingDetails.name} onChange={handleChange} />
//           <InputField label="Email Address" name="email" type="email" value={shippingDetails.email} onChange={handleChange} />
//           <InputField label="Street Address" name="address" value={shippingDetails.address} onChange={handleChange} />
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <InputField label="City / Town" name="city" value={shippingDetails.city} onChange={handleChange} />
//             <InputField label="ZIP / Postal Code" name="zip" value={shippingDetails.zip} onChange={handleChange} />
//           </div>

//           <h2 className="text-2xl font-semibold border-b pb-2 pt-4 text-blue-600">Payment</h2>
//           <div className="p-4 bg-yellow-100 rounded-lg text-yellow-800">
//             Payment is simulated. Click 'Place Order' to complete the transaction.
//           </div>
//         </form>

//         {/* Order Summary (Right/Bottom) */}
//         <div className="lg:col-span-1 bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
//             <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
//             <div className="space-y-2 text-gray-700 max-h-48 overflow-y-auto">
//                 {itemsToPurchase.map(item => (
//                     <div key={item.id} className="flex justify-between text-sm">
//                         <span>{item.name} x {item.quantity}</span>
//                         <span>${(item.price * item.quantity).toFixed(2)}</span>
//                     </div>
//                 ))}
//             </div>
            
//             <div className="mt-4 pt-4 border-t border-gray-300 space-y-2">
//                 <div className="flex justify-between">
//                     <span className="font-semibold">Subtotal ({itemsToPurchase.length} item{itemsToPurchase.length !== 1 && 's'}):</span>
//                     <span className="font-semibold">${purchaseTotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-2xl font-bold text-green-600">
//                     <span>Order Total:</span>
//                     <span>${purchaseTotal.toFixed(2)}</span>
//                 </div>
//             </div>
            
//             <button
//                 type="submit"
//                 onClick={handleSubmit}
//                 disabled={isProcessing}
//                 className={`w-full mt-6 py-3 rounded-md font-bold text-white transition duration-300 ${
//                     isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg'
//                 }`}
//             >
//                 {isProcessing ? 'Processing...' : `Place Order`}
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;









import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext'; // Needed for user scoping

// --- Helper Component ---
const InputField = ({ label, name, type = 'text', value, onChange, isProcessing }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
      disabled={isProcessing}
    />
  </div>
);

const Checkout = () => {
  // --- Context Hooks ---
  const { cartItems, totalCost, clearCart, setCartItems } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- State for Shipping Details ---
  const [shippingDetails, setShippingDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Cart Backup/Restore State ---
  const [originalCart, setOriginalCart] = useState(null);
  const userId = user?.email || 'guest';
  const backupKey = `originalCartBackup_${userId}`;

  // 1. Check for Cart Backup on Load
  useEffect(() => {
    const backupData = sessionStorage.getItem(backupKey);
    if (backupData) {
      // If a backup exists, we are in a 'Buy Now' flow, save the backup locally
      setOriginalCart(JSON.parse(backupData));
    }
    // Cleanup: Remove backup from session storage when leaving checkout
    return () => {
      sessionStorage.removeItem(backupKey);
    };
  }, [backupKey]);

  // --- Redirect if cart is empty ---
  if (cartItems.length === 0 && !originalCart) {
    return <Navigate to="/cart" replace />;
  }

  // Determine which items and total to show: current cart or the single item from backup
  const itemsToPurchase = cartItems.length > 0 ? cartItems : (originalCart || []);
  const purchaseTotal = itemsToPurchase.reduce((total, item) => total + (item.price * item.quantity), 0);

  // --- Handlers ---

  const handleChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (Object.values(shippingDetails).some(val => !val)) {
      toast.error('Please fill in all shipping fields.');
      return;
    }

    setIsProcessing(true);
    toast.loading('Processing order...', { id: 'checkout' });

    // Simulate 2-second payment delay
    setTimeout(() => {
      // 1. Place the order
      const orderId = placeOrder(itemsToPurchase, shippingDetails, purchaseTotal);

      // 2. Clear the cart (This clears the current state, which might be the single 'Buy Now' item)
      clearCart();

      // 3. Restore the original cart if it was a 'Buy Now' purchase
      if (originalCart) {
        // We use setCartItems directly to restore the state from the backup
        setCartItems(originalCart);
        // Clear the session storage backup
        sessionStorage.removeItem(backupKey);
      }

      // 4. Show success and navigate to confirmation page
      toast.dismiss('checkout'); // Dismiss the loading toast
      toast.success('Order placed successfully! 🎉', { duration: 3000 });
      navigate(`/confirmation/${orderId}`);
      setIsProcessing(false);

    }, 2000);
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Checkout</h1>
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Shipping Form (Left/Top) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2 text-blue-600">Shipping Details</h2>

          <InputField label="Full Name" name="name" value={shippingDetails.name} onChange={handleChange} isProcessing={isProcessing} />
          <InputField label="Email Address" name="email" type="email" value={shippingDetails.email} onChange={handleChange} isProcessing={isProcessing} />
          <InputField label="Street Address" name="address" value={shippingDetails.address} onChange={handleChange} isProcessing={isProcessing} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="City / Town" name="city" value={shippingDetails.city} onChange={handleChange} isProcessing={isProcessing} />
            <InputField label="ZIP / Postal Code" name="zip" value={shippingDetails.zip} onChange={handleChange} isProcessing={isProcessing} />
          </div>

          <h2 className="text-2xl font-semibold border-b pb-2 pt-4 text-blue-600">Payment</h2>
          <div className="p-4 bg-yellow-100 rounded-lg text-yellow-800">
            Payment is simulated. Click 'Place Order' to complete the transaction.
          </div>
        </form>

        {/* Order Summary (Right/Bottom) */}
        <div className="lg:col-span-1 bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
          <div className="space-y-2 text-gray-700 max-h-48 overflow-y-auto">
            {itemsToPurchase.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-300 space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Subtotal ({itemsToPurchase.length} item{itemsToPurchase.length !== 1 && 's'}):</span>
              <span className="font-semibold">${purchaseTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-green-600">
              <span>Order Total:</span>
              <span>${purchaseTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isProcessing}
            className={`w-full mt-6 py-3 rounded-md font-bold text-white transition duration-300 ${
              isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg'
            }`}
          >
            {isProcessing ? 'Processing...' : `Place Order`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
