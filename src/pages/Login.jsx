import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login(email, password)) {
            // Success! Navigate to the homepage
            navigate('/');
        }
    };

    return (
        <div className="py-12 max-w-md mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-2xl border-t-4 border-blue-500">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h1>
                <p className="text-sm text-gray-500 mb-6 text-center">
                    **Simulated Logins:** Use `admin@shop.com / admin` or `client@shop.com / client`
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition duration-300 shadow-md"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account? 
                    <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium ml-1">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
