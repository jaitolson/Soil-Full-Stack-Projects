import React from 'react';
import Lottie from 'react-lottie';
import facebookAnimation from '../animations/facebook.json';
import twitterAnimation from '../animations/twitter.json';
import instagramAnimation from '../animations/instagram.json';
import linkedinAnimation from '../animations/linkedin.json';

const Footer = () => {
  const socialMediaOptions = (animationData) => ({
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  });

  return (
    <footer className="bg-white py-10 border-t border-gray-200 mt-20">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-gray-800 px-4">
        <div className="mb-6 md:mb-0">
          <h3 className="text-lg font-semibold mb-2">Soil Essentials</h3>
          <p>&copy; {new Date().getFullYear()} Soil Essentials. All rights reserved.</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center mb-6 md:mb-0">
          <nav className="flex flex-col md:flex-row md:space-x-6 mb-4 md:mb-0">
            <a href="/about" className="hover:text-green-600 transition duration-300">About Us</a>
            <a href="/contact" className="hover:text-green-600 transition duration-300">Contact</a>
            <a href="/privacy" className="hover:text-green-600 transition duration-300">Privacy Policy</a>
            <a href="/terms" className="hover:text-green-600 transition duration-300">Terms of Service</a>
          </nav>
        </div>
        <div className="flex space-x-4 mb-6 md:mb-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10">
            <Lottie options={socialMediaOptions(facebookAnimation)} height={40} width={40} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10">
            <Lottie options={socialMediaOptions(twitterAnimation)} height={40} width={40} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10">
            <Lottie options={socialMediaOptions(instagramAnimation)} height={40} width={40} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10">
            <Lottie options={socialMediaOptions(linkedinAnimation)} height={40} width={40} />
          </a>
        </div>
        <div>
          <a href="#top" className="hover:text-green-600 transition duration-300">Back to top</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
