import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { totalQuantity } = useCart();
  // Destructure 'user' to get the name
  const { isAuthenticated, role, logout, user } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = isAuthenticated && role === 'admin';
  
  return (
    <header className="bg-blue-800 text-white shadow-lg sticky top-0 z-10">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold hover:text-yellow-300 transition-colors">
          Star E-Com
        </Link>
        <div className="flex items-center space-x-6">
            
            {/* Display User Name/Greeting */}
            {isAuthenticated && user?.name && (
                <span className={`hidden sm:inline-block text-sm font-medium ${isAdmin ? 'text-red-300' : 'text-yellow-300'}`}>
                    Hello, {user.name.split(' ')[0]}!
                </span>
            )}
            
            {/* Shop Link (Always visible) */}
            <Link to="/" className="hover:text-yellow-300 transition-colors hidden sm:inline">Shop</Link>
            
            {/* --- Admin Links --- */}
            {isAdmin && (
                <>
                    <Link to="/admin" className="text-red-300 hover:text-red-100 transition-colors font-semibold">
                        Dashboard
                    </Link>
                    <Link to="/admin/orders" className="text-red-300 hover:text-red-100 transition-colors font-semibold">
                        Orders
                    </Link>
                </>
            )}

            {/* --- Client/Public Links (Only shown if NOT Admin) --- */}
            {!isAdmin && (
                <>
                    {/* Client Order History (Only if logged in) */}
                    {isAuthenticated && (
                        <Link to="/history" className="hover:text-yellow-300 transition-colors hidden sm:inline">Orders</Link>
                    )}
                    
                    {/* Cart Link (Visible to all non-admins) */}
                    <Link to="/cart" className="relative p-1 hover:text-yellow-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {totalQuantity > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-blue-800">
                                {totalQuantity}
                            </span>
                        )}
                    </Link>
                </>
            )}

            {/* Auth Button */}
            {isAuthenticated ? (
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm transition-colors">
                    Logout
                </button>
            ) : (
                <Link to="/login" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm transition-colors">
                    Login
                </Link>
            )}
        </div >
      </div>
    </header>
  );
};

export default Header;
