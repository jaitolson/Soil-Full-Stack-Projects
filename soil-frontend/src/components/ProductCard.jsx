import React from "react";
import PropTypes from "prop-types";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 flex flex-col h-full">
      <img src={product.imagePath} alt={product.name} className="w-full h-50 object-cover transition-transform duration-300 ease-in-out transform hover:scale-110" />
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold mb-2">{product.name}</h3>
          <p className="text-gray-700 mb-4">${product.price.toFixed(2)}</p>
        </div>
        <p className="text-gray-600 text-sm">{product.description}</p>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    productID: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    imagePath: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductCard;
