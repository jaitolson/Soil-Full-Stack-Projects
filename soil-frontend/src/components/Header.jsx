import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import Lottie from 'react-lottie';
import backgroundAnimationData from '../animations/header-background.json';

const Header = ({ isLoggedIn }) => {
  console.log(isLoggedIn);

  const backgroundOptions = {
    loop: true,
    autoplay: true,
    animationData: backgroundAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <header className="relative bg-white shadow-md py-8">
      <div className="absolute inset-0 z-0">
        <Lottie options={backgroundOptions} height="100%" width="100%" />
      </div>
      <div className="container mx-auto flex justify-between items-center px-6 relative z-10">
        <div className="flex items-center">
          <div className="text-4xl font-bold ml-4">
            <NavLink to="/" className="text-gray-800 hover:text-green-600 transition duration-300">Soil Essentials</NavLink>
          </div>
        </div>
        <nav className="flex space-x-8 text-2xl">
          <NavLink to="/specials" className="text-gray-800 hover:text-green-600 transition duration-300">Specials</NavLink>
          <NavLink to="/cart" className="text-gray-800 hover:text-green-600 transition duration-300">
            <FaShoppingCart className="inline-block" size={28} />
          </NavLink>
          {!isLoggedIn ? (
            <>
              <NavLink to="/signin" className="text-gray-800 hover:text-green-600 transition duration-300">Login</NavLink>
              <NavLink to="/signup" className="text-gray-800 hover:text-green-600 transition duration-300">Sign Up</NavLink>
            </>
          ) : (
            <NavLink to="/profile" className="text-gray-800 hover:text-green-600 transition duration-300">
              <FaUserCircle className="inline-block" size={28} />
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
