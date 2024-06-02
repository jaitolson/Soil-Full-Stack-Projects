import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { fetchProducts, fetchCategories } from "../services/api";
import ProductDetail from "./ProductDetail";
import '../styles/animations.css';  // Importing the animations CSS file
import Lottie from "react-lottie";
import loadingAnimation from "../animations/loading.json";  // Importing a loading animation

const ProductList = ({ userData, isAuthenticated, userBlock }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [setTotalProducts] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(true);

  const PRODUCTS_PER_PAGE = 10;

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setTotalProducts(data.length);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getProducts();
    getCategories();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCategoryChange = (categoryID) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(categoryID)
        ? prevSelectedCategories.filter((id) => id !== categoryID)
        : [...prevSelectedCategories, categoryID]
    );
    setCurrentPage(1);
  };

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
  };

  const closeProductDetail = () => {
    setSelectedProductId(null);
  };

  const filteredProducts = selectedCategories.length
    ? products.filter((product) =>
        product.Categories?.some((category) =>
          selectedCategories.includes(category.categoryID)
        )
      )
    : products;

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="bg-white p-6 font-sans">
      <h1 className="text-4xl font-bold mb-6 text-center">Our Products</h1>
      <div className="mb-6 flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category.categoryID}
            onClick={() => handleCategoryChange(category.categoryID)}
            className={`px-4 py-2 rounded-full transition ${
              selectedCategories.includes(category.categoryID)
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="flex flex-col justify-center items-center mb-4">
        <div className="text-sm text-gray-600 mb-4">
          {`Showing ${Math.min(
            (currentPage - 1) * PRODUCTS_PER_PAGE + 1,
            filteredProducts.length
          )}-${Math.min(
            currentPage * PRODUCTS_PER_PAGE,
            filteredProducts.length
          )} of ${filteredProducts.length} products`}
        </div>
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
          >
            &lt;
          </button>
          <div className="mx-2 flex">
            {[
              ...Array(
                Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
              ).keys(),
            ].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded mx-1 ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={
              currentPage ===
              Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
            }
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
          >
            &gt;
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Lottie options={loadingOptions} height={150} width={150} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {paginatedProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No products available.
            </p>
          ) : (
            paginatedProducts.map((product) => (
              <div
                key={product.productID}
                onClick={() => handleProductClick(product.productID)}
                className="cursor-pointer h-full transform transition duration-300 hover:scale-105"
              >
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      )}
      {selectedProductId && (
        <div className="animated-modal fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <ProductDetail
            productID={selectedProductId}
            onClose={closeProductDetail}
            userID={userData.userID}
            name={userData.name}
            isAuthenticated={isAuthenticated}
            userBlock={userData.userBlock}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
