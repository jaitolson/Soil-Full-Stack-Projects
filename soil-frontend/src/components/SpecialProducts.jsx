import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../styles/SpecialProducts.css'; 

const API_URL = 'http://localhost:4000/api';

const SpecialProducts = () => {
  const [specialProducts, setSpecialProducts] = useState([]);
  const { addToCartHandler, userID } = useCart();

  useEffect(() => {
    const fetchSpecialProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/specialProducts`);
        setSpecialProducts(response.data);
      } catch (error) {
        console.error('Error fetching special products:', error);
      }
    };

    fetchSpecialProducts();
  }, []);

  const handleAddToCart = async (productID) => {
    const quantity = 1;
    try {
      if (!userID) {
        notifyError("Please log in to add items to your cart.");
        return;
      }
      const product = specialProducts.find(item => item.Product.productID === productID);
      if (product) {
        await addToCartHandler(userID, product.Product, quantity);
        notifySuccess("Item added to cart successfully!");
      } else {
        console.error('Product not found for ID:', productID);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="special-products-container">
      <h2 className="special-products-header">Special Products</h2>
      <div className="product-grid">
        {specialProducts.map((item) => (
          item.Product && (
            <div key={item.specialProductID} className="product-card">
              <span className="sale-badge">On Sale</span>
              <img src={item.Product.imagePath} alt={item.Product.name} className="product-image" />
              <div className="product-details">
                <h3 className="product-name">{item.Product.name}</h3>
                <p className="product-description">{item.Product.description}</p>
                <div className="product-price">
                  ${(item.Product.price * (1 - item.discountPercent / 100)).toFixed(2)}
                  <span className="product-price-original">${item.Product.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => handleAddToCart(item.Product.productID)}
                  className="add-to-cart-button"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          )
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SpecialProducts;
