// import React, { useEffect } from 'react';
// import ProductCard from '../components/ProductCard';
// import { useProducts } from '../context/ProductContext';
// import toast from 'react-hot-toast';

// const Home = () => {
//   // Use the products and loading state from the ProductContext
//   const { products, loading } = useProducts();

//   // In a real application, you might use useEffect here to trigger an initial fetch
//   // if the context did not handle persistence automatically. Since ProductContext
//   // handles loading from LocalStorage automatically, we just use the data.

//   if (loading) {
//     return (
//       <div className="text-center py-20">
//         <h2 className="text-xl text-gray-600">Loading product catalog...</h2>
//         {/* Simple spinner icon */}
//         <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//         </svg>
//       </div>
//     );
//   }

//   if (products.length === 0) {
//     return (
//         <div className="text-center py-20 bg-white rounded-xl shadow-lg">
//             <h1 className="text-3xl font-bold mb-4 text-gray-800">No Products Available 😔</h1>
//             <p className="text-lg text-gray-600 mb-6">The catalog is currently empty. An Admin needs to add items.</p>
//         </div>
//     );
//   }
  
//   return (
//     <div className="py-8">
//       <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">Shop Our Latest Gear</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//         {products.map(product => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;


import React from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const Home = () => {
  // CRITICAL FIX: Use default empty array for safe access
  const { allProducts = [] } = useProducts();

  // Filter out products marked as sold out by the Admin
  const availableProducts = allProducts.filter(p => !p.soldOut);

  if (availableProducts.length === 0) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">No Products Available</h1>
        <p className="text-lg">Please check back later or contact the admin.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">Our Catalog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {availableProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
