import React, { useState, useEffect } from 'react';
import { useQuery, useSubscription, gql } from '@apollo/client';
import { Pie, Line } from 'react-chartjs-2';
import client from '../apollo/apolloClient';
import '../styles/Main.css';
import 'chart.js/auto';

const GET_LATEST_REVIEWS = gql`
  query GetLatestReviews {
    latestReviews {
      name
      reviewID
      productID
      userID
      rating
      comment
      createdAt
    }
  }
`;

const REVIEW_SUBSCRIPTION = gql`
  subscription OnNewReview {
    newReview {
      name
      reviewID
      productID
      userID
      rating
      comment
      createdAt
    }
  }
`;

const GET_REVIEW_METRICS = gql`
  query GetReviewMetrics {
    reviewMetrics {
      averageRating
      reviewsPerProduct {
        productID
        count
      }
    }
  }
`;

const Main = () => {
  const { data: reviewData, error: reviewError, refetch: refetchReviews } = useQuery(GET_LATEST_REVIEWS, { client });
  const { data: metricsData, error: metricsError, refetch: refetchMetrics } = useQuery(GET_REVIEW_METRICS, { client });
  const { data: subscriptionData, error: subscriptionError } = useSubscription(REVIEW_SUBSCRIPTION, { client });

  const [latestReviews, setLatestReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewsPerProduct, setReviewsPerProduct] = useState([]);

  useEffect(() => {
    if (reviewData) setLatestReviews(reviewData.latestReviews);
    if (metricsData) {
      setAverageRating(metricsData.reviewMetrics.averageRating);
      setReviewsPerProduct(metricsData.reviewMetrics.reviewsPerProduct);
    }
  }, [reviewData, metricsData]);

  useEffect(() => {
    if (subscriptionData) {
      refetchReviews();
      refetchMetrics();
    }
  }, [subscriptionData, refetchReviews, refetchMetrics]);

  const latestReviewsList = latestReviews.map((review, index) => (
    <div key={index}>
      <p>by {review.name}</p>
      <p>{review.comment}</p>
    </div>
  ));

  const averageRatingData = {
    labels: ['Average Rating', 'Remaining'],
    datasets: [{
      data: [averageRating, 5 - averageRating],
      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(211, 211, 211, 0.6)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(211, 211, 211, 1)'],
      borderWidth: 1
    }]
  };

  const reviewsPerProductData = {
    labels: reviewsPerProduct.map(product => `Product ${product.productID}`),
    datasets: [{
      label: 'Reviews per Product',
      data: reviewsPerProduct.map(product => product.count),
      fill: false,
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      tension: 0.1
    }]
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Latest Reviews</h2>
        {latestReviewsList}
      </div>
      <div className="dashboard-card">
        <h2>Average Rating</h2>
        <Pie data={averageRatingData} />
      </div>
      <div className="dashboard-card">
        <h2>Reviews per Product</h2>
        <Line data={reviewsPerProductData} />
      </div>
    </div>
  );
};

export default Main;
