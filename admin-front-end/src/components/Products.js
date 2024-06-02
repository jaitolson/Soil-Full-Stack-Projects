import React, { useEffect, useState } from 'react';
import '../styles/Product.css'; // Using the same styles as User component
import { addProduct, deleteProduct, editProduct, getProducts } from '../api/api.js';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editProductID, setEditProductID] = useState(null);
    const [editFormData, setEditFormData] = useState({
        productID: '',
        name: '',
        price: '',
        description: ''
    });
    const [addFormData, setAddFormData] = useState({
        name: '',
        price: '',
        description: ''
    });
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            if (Array.isArray(data)) {
                setProducts(data);
                setFilteredProducts(data);
                setError(null);
            } else {
                setError('Fetched data is not an array');
            }
        } catch (error) {
            setError('Error fetching products: ' + error.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEditClick = (product) => {
        setEditProductID(product.productID);
        setEditFormData({
            productID: product.productID,
            name: product.name,
            price: product.price,
            description: product.description
        });
    };

    const handleDelete = async (product) => {
        try {
            await deleteProduct(product.productID);
            await fetchProducts();
        } catch (error) {
            setError('Error deleting product: ' + error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (isAdding) {
            setAddFormData({
                ...addFormData,
                [name]: value
            });
        } else {
            setEditFormData({
                ...editFormData,
                [name]: value
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            if (isAdding) {
                const parsedPrice = parseFloat(addFormData.price);
                await addProduct({
                    name: addFormData.name,
                    price: parsedPrice,
                    description: addFormData.description
                });
            } else {
                const parsedProductID = parseInt(editFormData.productID, 10);
                await editProduct(parsedProductID, {
                    name: editFormData.name,
                    price: parseFloat(editFormData.price),
                    description: editFormData.description
                });
            }
            await fetchProducts();
            setIsAdding(false);
            setEditProductID(null);
            setEditFormData({
                productID: '',
                name: '',
                price: '',
                description: ''
            });
        } catch (error) {
            setError('Error saving product: ' + error.message);
        }
    };

    const handleCancelClick = () => {
        setEditProductID(null);
        setIsAdding(false);
        setEditFormData({
            productID: '',
            name: '',
            price: '',
            description: ''
        });
    };

    const handleAddClick = () => {
        setIsAdding(true);
        setEditProductID(null);
        setAddFormData({
            name: '',
            price: '',
            description: ''
        });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    };

    return (
        <div className="user-main">
            <div className="report-container">
                <div className="report-header">
                    <h1 className="recent-Articles">Products</h1>
                    <div className="search-add-container">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search products by name"
                        className="search-input"
                    />
                    <button onClick={handleAddClick} className="product-button">Add Product</button>
                </div>
            </div>
                <div className="report-body">
                    <div className="report-topic-heading">
                        <h3 className="t-op">ID</h3>
                        <h3 className="t-op">Name</h3>
                        <h3 className="t-op">Cost</h3>
                        <h3 className="t-op">Description</h3>
                        <h3 className="t-op">Actions</h3>
                    </div>
                    {isAdding && (
                        <div className="items">
                            <input
                                type="text"
                                name="name"
                                value={addFormData.name}
                                onChange={handleInputChange}
                                placeholder="Name"
                                className="t-op-nextlvl"
                            />
                            <input
                                type="text"
                                name="price"
                                value={addFormData.price}
                                onChange={handleInputChange}
                                placeholder="Cost"
                                className="t-op-nextlvl"
                            />
                            <input
                                type="text"
                                name="description"
                                value={addFormData.description}
                                onChange={handleInputChange}
                                placeholder="Description"
                                className="t-op-nextlvl"
                            />
                            <button onClick={handleSaveClick} className="button-block">
                                Save
                            </button>
                            <button onClick={handleCancelClick} className="button-block">
                                Cancel
                            </button>
                        </div>
                    )}
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product.productID} className="items">
                                {editProductID === product.productID ? (
                                    <>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editFormData.name}
                                            onChange={handleInputChange}
                                            className="t-op-nextlvl"
                                        />
                                        <input
                                            type="text"
                                            name="price"
                                            value={editFormData.price}
                                            onChange={handleInputChange}
                                            className="t-op-nextlvl"
                                        />
                                        <input
                                            type="text"
                                            name="description"
                                            value={editFormData.description}
                                            onChange={handleInputChange}
                                            className="t-op-nextlvl"
                                        />
                                        <button onClick={handleSaveClick} className="button-block">
                                            Save
                                        </button>
                                        <button onClick={handleCancelClick} className="button-block">
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="t-op-nextlvl">{product.productID}</h3>
                                        <h3 className="t-op-nextlvl">{product.name}</h3>
                                        <h3 className="t-op-nextlvl">{product.price}</h3>
                                        <h3 className="t-op-nextlvl">{product.description}</h3>
                                        <button
                                            onClick={() => handleEditClick(product)}
                                            className="button-block"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product)}
                                            className="delete-button"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <div>No products available.</div>
                    )}
                </div>
            </div>
        </div>
        
   
        );
    };
    
    export default Products;