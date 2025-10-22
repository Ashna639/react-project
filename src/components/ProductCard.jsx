// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useCart } from '../context/CartContext';
// import { useProducts } from '../context/ProductContext'; // To check for soldOut status

// const ProductCard = ({ product }) => {
//   const { addToCart } = useCart();
//   const { products } = useProducts();
//   const navigate = useNavigate();

//   const { id, name, price, description, image } = product;
  
//   // Find the most current product data (Admin updates may change soldOut status)
//   const currentProduct = products.find(p => p.id === id);
//   const isSoldOut = currentProduct?.soldOut || false;

//   const handleAddToCart = () => {
//     if (isSoldOut) {
//       toast.error(`${name} is currently sold out!`);
//       return;
//     }
//     // Adds to the user's persistent cart (quantity 1)
//     addToCart(product, 1);
//   };

//   const handleBuyNow = () => {
//     if (isSoldOut) {
//       toast.error(`${name} is currently sold out!`);
//       return;
//     }
    
//     // 1. Prepare the single item for instant purchase
//     const itemToBuy = { ...product, quantity: 1 };
    
//     // 2. Clear any existing Buy Now item and set the new one in session storage
//     // NOTE: The Checkout page is configured to prioritize this session storage key.
//     sessionStorage.removeItem('instantBuyItem');
//     sessionStorage.setItem('instantBuyItem', JSON.stringify(itemToBuy));
    
//     // 3. Notify and navigate instantly to checkout
//     toast.success(`Proceeding to instant checkout with ${name}.`, { icon: '⚡' });
//     navigate('/checkout');
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1">
//       <img 
//         src={image} 
//         alt={name} 
//         className="w-full h-48 object-cover object-center" 
//         onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/CCCCCC/333333?text=No+Image" }}
//       /> 
      
//       <div className="p-5 flex flex-col flex-grow">
//         <h3 className="text-xl font-semibold mb-1 text-gray-900">{name}</h3>
//         <p className="text-sm text-gray-500 mb-3 flex-grow line-clamp-3">{description}</p>
        
//         <div className="flex justify-between items-center mt-auto mb-3">
//             <p className="text-2xl font-bold text-green-600">${price.toFixed(2)}</p>
//             {isSoldOut && (
//               <span className="text-sm font-bold text-red-500 bg-red-100 px-3 py-1 rounded-full">SOLD OUT</span>
//             )}
//         </div>

//         <div className="flex space-x-2">
//             <button 
//               onClick={handleAddToCart}
//               disabled={isSoldOut}
//               className={`flex-1 font-bold py-2 px-3 rounded-md transition duration-300 shadow-md ${
//                 isSoldOut 
//                   ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
//                   : 'bg-blue-600 hover:bg-blue-700 text-white'
//               }`}
//             >
//               Add to Cart
//             </button>
//             <button 
//               onClick={handleBuyNow}
//               disabled={isSoldOut}
//               className={`flex-1 font-bold py-2 px-3 rounded-md transition duration-300 shadow-md ${
//                 isSoldOut 
//                   ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
//                   : 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
//               }`}
//             >
//               Buy Now
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems = [], clearCart, setCartItems } = useCart(); // CRITICAL FIX: Add = [] default
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const { id, name, price, description, image } = product;

  // Check if the item is already in the cart (for UI purposes, though not used here)
  const itemInCart = cartItems.find(item => item.id === id); // This line is now safe

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your cart.");
      navigate('/login');
      return;
    }
    addToCart(product, 1);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to proceed with Buy Now.");
      navigate('/login');
      return;
    }

    // Prepare single item for checkout:
    const itemToPurchase = { ...product, quantity: 1 };
    const userId = user?.email || 'guest';
    const storageKey = `originalCartBackup_${userId}`;

    try {
        // 1. Back up current cart to session storage
        sessionStorage.setItem(storageKey, JSON.stringify(cartItems));

        // 2. Temporarily replace the cart state with ONLY the item being purchased
        // This is done via setCartItems (exposed by CartContext)
        setCartItems([itemToPurchase]);
        
        // 3. Navigate to checkout
        toast.success(`Redirecting to checkout with ${product.name}.`, { duration: 1500 });
        navigate('/checkout');
        
    } catch (e) {
        console.error("Buy Now failed during storage operation:", e);
        toast.error("Could not start checkout process.");
    }
  };


  return (
    <div className="border border-gray-200 p-4 shadow-md rounded-lg flex flex-col items-center justify-between transition-shadow hover:shadow-xl">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-48 object-contain mb-4 rounded" 
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/CCCCCC/333333?text=No+Image" }}
      /> 
      <h3 className="text-xl font-semibold mb-1 text-center">{name}</h3>
      <p className="text-gray-700 mb-3 font-mono text-lg">${price.toFixed(2)}</p>
      <p className="text-sm text-gray-500 text-center mb-4 flex-grow line-clamp-3">{description}</p>
      
      <div className="flex space-x-2 w-full mt-auto">
        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md transition duration-300"
        >
          Add to Cart
        </button>
        
        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-md transition duration-300"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
