import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Hardcoded default admin/client users for simulation
const SIMULATED_DEFAULT_USERS = [
    { email: 'admin@shop.com', password: 'admin', role: 'admin', name: 'Admin User' },
    { email: 'client@shop.com', password: 'client', role: 'client', name: 'Client Shopper' },
];

// Helper function to get the persistent user database
const getInitialUserState = (key) => {
    try {
        const data = localStorage.getItem(key);
        // If local data exists, use it. Otherwise, use the defaults.
        return data ? JSON.parse(data) : SIMULATED_DEFAULT_USERS;
    } catch (error) {
        console.error("Error retrieving users from LocalStorage:", error);
        return SIMULATED_DEFAULT_USERS;
    }
};

const getInitialAuth = () => {
    try {
        const token = localStorage.getItem('ecomAuthToken');
        const role = localStorage.getItem('ecomUserRole');
        const user = localStorage.getItem('ecomUser');
        return { 
            isAuthenticated: !!token, 
            role: role || 'client', 
            user: user ? JSON.parse(user) : null
        };
    } catch (error) {
        console.error("Error retrieving auth from LocalStorage:", error);
        return { isAuthenticated: false, role: 'client', user: null };
    }
};

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(getInitialAuth);
    // State to hold all simulated users, including registered ones
    const [users, setUsers] = useState(() => getInitialUserState('ecomUserDatabase'));

    // Sync auth state changes to LocalStorage
    useEffect(() => {
        if (authState.isAuthenticated) {
            localStorage.setItem('ecomAuthToken', 'simulated_token_123');
            localStorage.setItem('ecomUserRole', authState.role);
            localStorage.setItem('ecomUser', JSON.stringify(authState.user));
        } else {
            localStorage.removeItem('ecomAuthToken');
            localStorage.removeItem('ecomUserRole');
            localStorage.removeItem('ecomUser');
        }
    }, [authState]);

    // CRITICAL FIX: Sync user database changes to LocalStorage
    useEffect(() => {
        localStorage.setItem('ecomUserDatabase', JSON.stringify(users));
    }, [users]);


    const login = (email, password) => {
        // CRITICAL FIX: Check against the dynamic 'users' state
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            setAuthState({ 
                isAuthenticated: true, 
                role: user.role, 
                user: { email: user.email, name: user.name, role: user.role } 
            });
            toast.success(`Welcome back, ${user.name}! (${user.role})`);
            return true;
        } else {
            toast.error('Invalid email or password.');
            return false;
        }
    };
    
    const register = (name, email, password) => {
        if (users.some(u => u.email === email)) {
            toast.error('This email is already registered.');
            return false;
        }

        const newUser = { email, password, role: 'client', name };
        
        // CRITICAL FIX: Add new user to the persistent 'users' database
        setUsers(prevUsers => [...prevUsers, newUser]);

        // Log the new user in immediately
        setAuthState({ 
            isAuthenticated: true, 
            role: 'client', 
            user: { email, name, role: 'client' } 
        });
        toast.success(`Account created! Welcome, ${name}!`);
        return true;
    };

    const logout = () => {
        setAuthState({ isAuthenticated: false, role: 'client', user: null });
        toast('Logged out successfully.', { icon: '👋' });
    };

    const contextValue = {
        ...authState,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// ---------------------------------------------------
// ProtectedRoute Component
// ---------------------------------------------------
export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role } = useAuth();
    
    // 1. Check Authentication Status
    if (!isAuthenticated) {
        toast.error('You must log in to view this page.', { id: 'auth-error', duration: 3000 });
        return <Navigate to="/login" replace />;
    }
    
    // 2. Check Authorization Role
    if (allowedRoles && !allowedRoles.includes(role)) {
        toast.error('Access denied. You do not have permission.', { id: 'auth-error', duration: 3000 });
        return <Navigate to="/" replace />;
    }
    
    // If authenticated and authorized, render the children
    return children;
};
