import React, { useState, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import Lottie from 'react-lottie';
import successAnimation from '../animations/success.json';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, clearCart, userID } = useCart();
  const [cardDetails, setCardDetails] = useState({
    number: '',
    cardName: '',
    expiry: '',
    cvc: ''
  });
  const [focused, setFocused] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = useCallback((e, setFieldValue) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    setFieldValue(name, value);
  }, []);

  // Luhn Algorithm for card validation
  const luhnCheck = (val) => {
    let sum = 0;
    for (let i = 0; i < val.length; i++) {
      let intVal = parseInt(val.substr(i, 1), 10);
      if (i % 2 === 0) {
        intVal *= 2;
        if (intVal > 9) {
          intVal = 1 + (intVal % 10);
        }
      }
      sum += intVal;
    }
    return (sum % 10) === 0;
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string().required('Postal code is required'),
    number: Yup.string()
      .test('test-number', 'Invalid Card Number', value => luhnCheck(value.replace(/\s+/g, '')))
      .required('Card number is required'),
    expiry: Yup.string().required('Expiry date is required').matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Invalid expiry date'),
    cvc: Yup.string().required('CVC is required').matches(/^[0-9]{3,4}$/, 'Invalid CVC')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const total = cart.reduce((sum, item) => sum + item.Product.price * item.quantity, 0).toFixed(2);
    const shippingAddress = `${values.address}, ${values.city}, ${values.postalCode}`;

    const order = {
      items: cart,
      userID: userID,
      total: total,
      shippingAddress: shippingAddress,
      cardDetails: {
        number: cardDetails.number.replace(/\s+/g, ''),
        cardName: cardDetails.cardName,
        expiry: cardDetails.expiry,
        cvc: cardDetails.cvc
      }
    };

    try {
      await createOrder(order);
      clearCart();
      setOrderSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 5000); // Redirect to home page after 5 seconds
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order, please try again.');
    }
    setSubmitting(false);
  };

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const handleClose = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 overflow-y-auto flex flex-col md:flex-row relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-gray-800 transition duration-300"
        >
          &times;
        </button>
        {orderSuccess ? (
          <div className="flex flex-col items-center justify-center w-full">
            <Lottie options={defaultOptions} height={200} width={200} />
            <h2 className="text-3xl font-bold mt-4">Thank You for Your Order!</h2>
            <p className="text-lg mt-2">Your order has been placed successfully. You will be redirected to the home page shortly.</p>
          </div>
        ) : (
          <>
            <div className="w-full md:w-1/2 p-4">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <ul className="space-y-4">
                {cart.map((cartItem) => (
                  <li key={cartItem.cartItemID} className="border-b pb-4">
                    <div className="flex items-center">
                      <div className="w-24 h-24 flex-shrink-0 mr-4">
                        <img
                          src={cartItem.Product.imagePath}
                          alt={cartItem.Product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold">{cartItem.Product.name}</h3>
                        <p className="text-gray-600">${cartItem.Product.price.toFixed(2)}</p>
                        <p className="text-gray-600">Quantity: {cartItem.quantity}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="text-right text-lg font-semibold mt-4">
                Total: ${cart.reduce((total, item) => total + item.Product.price * item.quantity, 0).toFixed(2)}
              </div>
            </div>
            <div className="w-full md:w-1/2 p-4">
              <h2 className="text-2xl font-bold mb-4">Checkout</h2>
              <Formik
                initialValues={{ name: '', email: '', address: '', city: '', postalCode: '', number: '', cardName: '', expiry: '', cvc: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name on Order</label>
                      <Field name="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <Field name="email" type="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                      <Field name="address" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                      <Field name="city" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                      <Field name="postalCode" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      <ErrorMessage name="postalCode" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="number" className="block text-sm font-medium text-gray-700">Card Number</label>
                      <Field
                        name="number"
                        value={cardDetails.number}
                        onChange={(e) => handleInputChange(e, setFieldValue)}
                        className={`mt-1 block w-full border ${cardDetails.number && !luhnCheck(cardDetails.number.replace(/\s+/g, '')) ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        onFocus={() => setFocused('number')}
                      />
                      <ErrorMessage name="number" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">Card Name</label>
                      <Field
                        name="cardName"
                        value={cardDetails.cardName}
                        onChange={(e) => handleInputChange(e, setFieldValue)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onFocus={() => setFocused('cardName')}
                      />
                      <ErrorMessage name="cardName" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Expiry</label>
                      <Field
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={(e) => handleInputChange(e, setFieldValue)}
                        className={`mt-1 block w-full border ${cardDetails.expiry && !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardDetails.expiry) ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        onFocus={() => setFocused('expiry')}
                      />
                      <ErrorMessage name="expiry" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                      <Field
                        name="cvc"
                        value={cardDetails.cvc}
                        onChange={(e) => handleInputChange(e, setFieldValue)}
                        className={`mt-1 block w-full border ${cardDetails.cvc && !/^[0-9]{3,4}$/.test(cardDetails.cvc) ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        onFocus={() => setFocused('cvc')}
                      />
                      <ErrorMessage name="cvc" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <Cards
                      number={cardDetails.number}
                      name={cardDetails.cardName}
                      expiry={cardDetails.expiry}
                      cvc={cardDetails.cvc}
                      focused={focused}
                    />
                    <div className="mt-4">
                      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-300">Submit Order</button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
