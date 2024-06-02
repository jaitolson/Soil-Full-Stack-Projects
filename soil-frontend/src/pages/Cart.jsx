import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCartHandler, updateCartItemHandler } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (cartItemID, quantity) => {
    if (quantity < 1) return;
    updateCartItemHandler(cartItemID, quantity);
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => {
        if (item.Product) {
          return total + item.Product.price * item.quantity;
        }
        return total;
      }, 0)
      .toFixed(2);
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout"); // Redirect to checkout page
  };

  const handleClose = () => {
    navigate("/#top"); // Redirect to /products page
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg max-w-4xl w-full overflow-hidden relative"
        style={{ maxHeight: "90vh", animation: "fadeIn 0.5s ease-in-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-gray-800 transition duration-300"
          >
            &times;
          </button>
          <h2 className="text-2xl font-semibold text-center">Your Cart</h2>
        </div>
        {cart.length === 0 ? (
          <p className="text-center text-gray-500 p-4">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col">
            <div
              className="overflow-y-auto flex-grow p-4"
              style={{ maxHeight: "calc(90vh - 200px)" }}
            >
              <ul className="space-y-4">
                {cart.map((cartItem) => (
                  <li
                    key={cartItem.cartItemID}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex items-center"
                  >
                    {cartItem.Product && (
                      <>
                        <div className="w-32 h-32 flex-shrink-0 mr-4">
                          <img
                            src={cartItem.Product.imagePath}
                            alt={cartItem.Product.name}
                            className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-col justify-between flex-grow">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              {cartItem.Product.name}
                            </h3>
                            <p className="text-gray-600">
                              ${cartItem.Product.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  cartItem.cartItemID,
                                  cartItem.quantity - 1
                                )
                              }
                              className="px-3 py-1 bg-gray-200 rounded-l-md"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={cartItem.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  cartItem.cartItemID,
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-12 text-center border-t border-b border-gray-200"
                            />
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  cartItem.cartItemID,
                                  cartItem.quantity + 1
                                )
                              }
                              className="px-3 py-1 bg-gray-200 rounded-r-md"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCartHandler(cartItem.cartItemID)
                          }
                          className="ml-4 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-colors duration-300"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="text-right text-lg font-semibold mb-4">
                Total: ${calculateTotal()}
              </div>
              <button
                className="block bg-blue-500 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
