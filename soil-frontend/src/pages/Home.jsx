import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'react-lottie';
import Infographic from '../components/Infographic';
import animationData from '../animations/abstract-shapes.json';

const infographicData = [
  {
    topic: "Fuel Your Body",
    description: "Organic food is packed with more vitamins, minerals, and antioxidants for optimal health.",
  },
  {
    topic: "Zero Pesticides",
    description: "Protect yourself from harmful chemicals linked to a range of health concerns.",
  },
  {
    topic: "Healthy Soil Superstars",
    description: "Organic farming feeds the tiny organisms that power a thriving, healthy soil ecosystem.",
  },
  {
    topic: "Clean Streams and Rivers",
    description: "Choosing organic eliminates the runoff of synthetic pesticides that pollute our waterways.",
  },
  {
    topic: "Home for Bees & Butterflies",
    description: "Organic farms create diverse habitats that support pollinators vital to our food supply.",
  },
  {
    topic: "The Soil Essentials Difference",
    description: "We source from the best organic farms to ensure quality, sustainability, and your satisfaction.",
  },
  {
    topic: "Better Taste",
    description: "Organic foods often have a fresher, more robust taste due to the lack of preservatives and additives.",
  },
  {
    topic: "Environmental Sustainability",
    description: "Organic farming practices reduce pollution, conserve water, and improve soil quality for future generations.",
  }
];


const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Home = () => {
  return (
    <div className="home-page bg-gray-100 min-h-screen">
      <section className="hero-section relative text-center py-20 bg-white shadow-md overflow-hidden mt-0">
        <div className="absolute inset-0">
          <Lottie options={defaultOptions} height="100%" width="100%" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Soil Essentials</h1>
          <p className="text-gray-600 text-xl mb-8">Your source for the best organic products.</p>
        </div>
      </section>
      <Infographic data={infographicData} />
    </div>
  );
};

export default Home;
