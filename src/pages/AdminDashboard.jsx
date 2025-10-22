import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth, ProtectedRoute } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';

// Helper component for the Edit Modal
const EditProductModal = ({ product, onClose, onSave }) => {
    // Combine product state into one object
    const [localProduct, setLocalProduct] = useState({
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        soldOut: product.soldOut || false,
    });

    // New unified handler function
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLocalProduct(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ 
            id: product.id,
            ...localProduct,
            price: parseFloat(localProduct.price), // Ensure price is parsed as float
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
                <h3 className="text-2xl font-bold mb-4 border-b pb-2">Edit Product: {product.name}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <ModalInputField label="Name" name="name" value={localProduct.name} onChange={handleInputChange} />
                    <ModalInputField label="Price ($)" name="price" type="number" value={localProduct.price} onChange={handleInputChange} />
                    <ModalInputField label="Image URL" name="image" value={localProduct.image} onChange={handleInputChange} />
                    
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                        name="description" 
                        value={localProduct.description} 
                        onChange={handleInputChange} 
                        rows="3" 
                        className="w-full border border-gray-300 rounded-md p-2" 
                        required 
                    />
                    
                    <div className="flex items-center space-x-2">
                        <input 
                            type="checkbox" 
                            id="soldOut" 
                            name="soldOut"
                            checked={localProduct.soldOut} 
                            onChange={handleInputChange} 
                            className="h-4 w-4 text-red-600 border-gray-300 rounded" 
                        />
                        <label htmlFor="soldOut" className="text-sm font-medium text-gray-900">Mark as Sold Out</label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition">
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// New Helper component for modal inputs (Standard controlled component setup)
const ModalInputField = ({ label, name, type = 'text', value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange} // Pass the event object directly to the unified handler
            step={type === 'number' ? "0.01" : undefined}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            required
        />
    </div>
);


// --- NEW COMPONENT: Add New Product Form (Isolated State) ---
const AddNewProductForm = ({ addProduct }) => {
    const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: '' });

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevProduct => ({
            ...prevProduct,
            [name]: value 
        }));
    };

    const handleAddProduct = (e) => {
        e.preventDefault();
        const productData = { ...newProduct, price: parseFloat(newProduct.price) };
        addProduct(productData);
        setNewProduct({ name: '', price: '', description: '', image: '' }); // Clear form
        toast.success(`Product '${newProduct.name}' added!`);
    };

    return (
        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 h-fit">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-blue-600">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
                
                {/* Inputs now manage state within this isolated component */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="name" value={newProduct.name} onChange={handleProductChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                    <input type="number" name="price" value={newProduct.price} onChange={handleProductChange} step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input type="text" name="image" value={newProduct.image} onChange={handleProductChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                </div>
                
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={newProduct.description} onChange={handleProductChange} rows="3" className="w-full border border-gray-300 rounded-md p-2" required />
                
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-md transition shadow-md">
                    Create Product
                </button>
            </form>
        </div>
    );
};
// --- END NEW COMPONENT ---


const AdminDashboard = () => {
    // --- Contexts ---
    const { addProduct, allProducts = [], deleteProduct, updateProduct } = useProducts();
    const { getAllOrders, deleteOrder } = useOrders(); 
    
    // --- State and Routing ---
    const location = useLocation(); // To check current URL
    const isOrdersView = location.pathname === '/admin/orders';
    
    // REMOVED: newProduct state and handleProductChange handler are now inside AddNewProductForm
    const [orders, setOrders] = useState([]); 
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Function to fetch all orders from local storage
    const fetchOrders = () => {
        setOrders(getAllOrders());
    };

    useEffect(() => {
        // Fetch orders on initial mount AND whenever the view switches to Orders
        if (isOrdersView || location.pathname === '/admin') {
            fetchOrders();
        }
    }, [location.pathname]); // Depend on route change


    // --- Product Handlers (for Dashboard View) ---
    
    const handleDeleteProduct = (productId, productName) => {
        if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
            deleteProduct(productId);
            toast.error(`${productName} deleted.`);
        }
    };

    const handleEditProductSave = (updatedData) => {
        updateProduct(updatedData);
        setEditingProduct(null);
        toast.success(`Product '${updatedData.name}' updated.`);
    };

    // --- Order Handlers (for Orders View) ---

    const handleCancelOrder = (orderId, orderUserId) => {
        // Custom Confirmation Toast (replacing window.confirm)
        toast((t) => (
            <div className="flex flex-col space-y-2">
                <p className="font-semibold text-gray-800">
                    Confirm Cancellation of Order ID: <span className="text-red-600">{orderId}</span>
                </p>
                <p className="text-sm text-gray-600">This will permanently delete the order record.</p>
                <div className="flex justify-end space-x-2">
                    <button 
                        onClick={() => toast.dismiss(t.id)} 
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm transition"
                    >
                        Keep Order
                    </button>
                    <button 
                        onClick={() => {
                            if (deleteOrder(orderId, orderUserId)) {
                                fetchOrders(); // CRITICAL: Re-run fetch function to update list
                            }
                            toast.dismiss(t.id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                    >
                        Cancel Permanently
                    </button>
                </div>
            </div>
        ), { duration: 10000, id: `confirm-admin-${orderId}` });
    };
    
    // --- Render Components ---

    const ProductManagementView = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* 1. NEW COMPONENT: Add New Product Form */}
            <AddNewProductForm addProduct={addProduct} />

            {/* 2. Existing Product List */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
                <h3 className="text-xl font-bold mb-4 border-b pb-2 text-blue-600">Manage Products ({allProducts.length})</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left text-sm font-semibold">Name</th>
                                <th className="p-3 text-left text-sm font-semibold">Price</th>
                                <th className="p-3 text-left text-sm font-semibold">Status</th>
                                <th className="p-3 text-right text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Ensure allProducts is an array before mapping */}
                            {Array.isArray(allProducts) && allProducts.length > 0 ? (
                                allProducts.map(p => (
                                    <tr key={p.id} className="border-t hover:bg-gray-50">
                                        <td className="p-3 text-sm font-medium">{p.name}</td>
                                        <td className="p-3 text-sm">${p.price.toFixed(2)}</td>
                                        <td className="p-3 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.soldOut ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {p.soldOut ? 'Sold Out' : 'Available'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right space-x-2">
                                            <button onClick={() => { setEditingProduct(p); setIsEditModalOpen(true); }} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                                            <button onClick={() => handleDeleteProduct(p.id, p.name)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-3 text-center text-gray-500 text-sm">
                                        No products found. Add a new product above!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const OrderManagementView = () => (
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-500">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-red-600">All Customer Orders ({orders.length})</h3>
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                {orders.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No customer orders found.</p>
                ) : (
                    orders.map(order => (
                        <div key={order.orderId} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start">
                                <p className="font-bold text-gray-900">Order ID: {order.orderId}</p>
                                <p className="font-extrabold text-lg text-green-600">${order.total.toFixed(2)}</p>
                            </div>
                            <p className="text-sm text-gray-600">User: {order.orderUserId}</p>
                            <p className="text-xs text-gray-500 mb-2">Date: {new Date(order.date).toLocaleString()}</p>
                            
                            <ul className="list-disc list-inside text-xs text-gray-700 mb-3 ml-2">
                                {order.items.map(item => (
                                    <li key={item.id}>{item.name} x {item.quantity}</li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => handleCancelOrder(order.orderId, order.orderUserId)}
                                className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1.5 rounded-md transition mt-2"
                            >
                                Cancel/Delete Order
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    // --- Main Admin Dashboard View ---
    return (
        <div className="py-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-red-600 text-center mb-4">
                Admin Control Panel: {isOrdersView ? 'Order Management' : 'Product Dashboard'}
            </h1>
            <div className="flex justify-center space-x-4 mb-8">
                <Link to="/admin" className={`py-2 px-4 rounded-md font-semibold transition ${isOrdersView ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                    Product Dashboard
                </Link>
                <Link to="/admin/orders" className={`py-2 px-4 rounded-md font-semibold transition ${!isOrdersView ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                    Order Management
                </Link>
            </div>
            
            {isOrdersView ? <OrderManagementView /> : <ProductManagementView />}

            {/* Edit Modal */}
            {isEditModalOpen && editingProduct && (
                <EditProductModal product={editingProduct} onClose={() => setIsEditModalOpen(false)} onSave={handleEditProductSave} />
            )}
        </div>
    );
};

// Wrapper to enforce the Admin role check
const AdminDashboardWrapper = () => (
    <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
    </ProtectedRoute>
);

export default AdminDashboardWrapper;
