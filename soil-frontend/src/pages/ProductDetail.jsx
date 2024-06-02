import React, { useEffect, useState } from "react";
import {
  fetchProductById,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  followUser,
  checkFollowStatus,
  unfollowUser,
} from "../services/api";
import { useCart } from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lottie from "lottie-react";
import successAnimation from "../animations/cart_success.json";

const ProductDetail = ({
  productID,
  onClose,
  userID,
  name,
  isAuthenticated,
  userBlock,
}) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const { addToCartHandler, userID: contextUserID } = useCart();
  const [newReview, setNewReview] = useState({ comment: "", rating: 1 });
  const [editingReview, setEditingReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [followStatus, setFollowStatus] = useState({});

  const fetchReviews = async () => {
    const reviews = await getReviews(productID);
    setReviews(reviews);
  };

  const checkFollowStatusForReviewers = async () => {
    const statuses = {};
    for (let review of reviews) {
      const status = await checkFollowStatus(userID, review.userID);
      statuses[review.userID] = status.isFollowing;
    }
    setFollowStatus(statuses);
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProductById(productID);
        setProduct(data);
      } catch (error) {
        setError("Error fetching product details.");
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productID) {
      getProduct();
      fetchReviews();
    }
  }, [productID]);

  useEffect(() => {
    if (reviews.length > 0) {
      checkFollowStatusForReviewers();
    }
  }, [reviews]);

  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
  };

  const handleAddToCart = () => {
    if (!contextUserID) {
      console.error("No user ID found in context");
      return;
    }

    if (!product || !product.productID) {
      console.error("Invalid product:", product);
      return;
    }

    if (!quantity || quantity < 1) {
      console.error("Invalid quantity:", quantity);
      return;
    }

    console.log("Adding to cart:", {
      contextUserID,
      productID: product.productID,
      quantity,
    });
    addToCartHandler(contextUserID, product, quantity);
    notifySuccess("Item added to cart successfully!");
    onClose();
  };

  const notifySuccess = (message) => {
    toast(
      <div className="flex items-center">
        <Lottie
          animationData={successAnimation}
          style={{ height: 50, width: 50 }}
        />
        <span>{message}</span>
      </div>,
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  const handleSubmitReview = async () => {
    if (editingReview) {
      await updateReview(editingReview.reviewID, newReview);
    } else {
      await createReview({ ...newReview, productID, userID, name });
    }
    fetchReviews();
    setShowReviewForm(false);
    setNewReview({ comment: "", rating: 1 });
    setEditingReview(null);
  };

  const handleEditReview = (review) => {
    setShowReviewForm(true);
    setNewReview({ comment: review.comment, rating: review.rating });
    setEditingReview(review);
  };

  const handleDeleteReview = async (reviewID) => {
    await deleteReview(reviewID);
    fetchReviews();
  };

  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={i <= rating ? "text-orange-500" : "text-gray-300"}
        />
      );
    }
    return stars;
  };

  const handleFollowToggle = async (reviewUserID, reviewName) => {
    if (followStatus[reviewUserID]) {
      await unfollowUser(userID, reviewUserID);
    } else {
      await followUser(userID, reviewName);
    }
    checkFollowStatusForReviewers();
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 overflow-y-auto transform transition-all duration-300 ease-in-out scale-95 hover:scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row">
          <img
            src={product.imagePath}
            alt={product.name}
            className="w-full md:w-1/3 rounded-lg mb-4 md:mb-0 md:mr-6 transition-transform duration-300 ease-in-out transform hover:scale-105"
          />
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl text-gray-600 mb-2">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <div className="flex items-center mb-4">
              <label htmlFor="quantity" className="mr-2">
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                className="border border-gray-300 rounded p-2 w-16"
              />
            </div>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 w-full md:w-auto transition-colors duration-300 ease-in-out"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <ul className="review-list space-y-4">
            {reviews.map((review) => (
              <li key={review.reviewID} className="border-b pb-4">
                <div className="review-content flex justify-between items-start">
                  <div className="review-info">
                    <p className="review-name font-bold flex items-center">
                      {review.name}
                      {isAuthenticated && review.userID !== userID && (
                        <button
                          className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-full transition-colors duration-300 ease-in-out"
                          onClick={() =>
                            handleFollowToggle(review.userID, review.name)
                          }
                        >
                          {followStatus[review.userID] ? "Unfollow" : "Follow"}
                        </button>
                      )}
                    </p>
                    <p className="review-rating">
                      {renderStarRating(review.rating)}
                    </p>
                    <p className="review-comment text-gray-700">
                      {review.comment}
                    </p>
                  </div>
                  {review.userID === userID && (
                    <div className="flex space-x-2">
                      <button
                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out"
                        onClick={() => handleEditReview(review)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out"
                        onClick={() => handleDeleteReview(review.reviewID)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {showReviewForm && (
            <div className="review-form mt-4">
              <textarea
                className="border border-gray-300 rounded p-2 w-full mb-2"
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                placeholder="Your review"
              />
              <select
                className="border border-gray-300 rounded p-2 w-full mb-2"
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: e.target.value })
                }
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>
                    {star} {star === 1 ? "star" : "stars"}
                  </option>
                ))}
              </select>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 transition-colors duration-300 ease-in-out"
                onClick={handleSubmitReview}
              >
                {editingReview ? "Update" : "Submit"}
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </button>
            </div>
          )}
          {!showReviewForm && isAuthenticated && userBlock !== true && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 transition-colors duration-300 ease-in-out"
              onClick={() => setShowReviewForm(true)}
            >
              Add Review
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductDetail;
