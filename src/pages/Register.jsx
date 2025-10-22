import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password.length < 5) {
            toast.error('Password must be at least 5 characters long.');
            return;
        }

        if (register(name, email, password)) {
            // Success! Navigate to the homepage
            navigate('/');
        }
    };

    return (
        <div className="py-12 max-w-md mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-2xl border-t-4 border-green-500">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Account</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password (Min 5 chars)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition duration-300 shadow-md"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account? 
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium ml-1">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
