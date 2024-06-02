import React, { createContext, useState, useEffect, useContext } from 'react';
import { addToCart, fetchCart, updateCartItem, removeFromCart, getEmail, getUser } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userID, setUserID] = useState(null);

  const fetchCartItems = async (userID) => {
    try {
      console.log(`Fetching cart for userID=${userID}`);
      const cartItems = await fetchCart(userID);
      console.log('Fetched cart items:', cartItems);
      setCart(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const addToCartHandler = async (userID, product, quantity) => {
    try {
      if (!product.productID || !quantity || quantity < 1) {
        throw new Error('Invalid product or quantity');
      }
      console.log(`Adding to cart: userID=${userID}, productID=${product.productID}, quantity=${quantity}`);
      await addToCart(userID, product.productID, quantity);
      await fetchCartItems(userID);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    }
  };

  const updateCartItemHandler = async (cartItemID, quantity) => {
    try {
      console.log(`Updating cart item: cartItemID=${cartItemID}, quantity=${quantity}`);
      await updateCartItem(cartItemID, quantity);
      await fetchCartItems(userID);
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeFromCartHandler = async (cartItemID) => {
    try {
      console.log(`Removing from cart: cartItemID=${cartItemID}`);
      await removeFromCart(cartItemID);
      await fetchCartItems(userID);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const email = getEmail();
        if (email) {
          const userData = await getUser(email);
          setUserID(userData.userID);
          await fetchCartItems(userData.userID);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserID();
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCartHandler, updateCartItemHandler, removeFromCartHandler, fetchCartItems, clearCart, userID }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
