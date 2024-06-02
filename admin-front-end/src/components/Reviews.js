import React, { useEffect, useState } from 'react';
import '../styles/User.css';
import { getReviews, deleteReview } from '../api/api.js';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchReviews = async () => {
        try {
            const data = await getReviews();
            setReviews(data);
            setFilteredReviews(data); // Initialize filtered reviews
        } catch (error) {
            console.error('Error fetching reviews:', error.message);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const removeReview = async (reviewID) => {
        try {
            console.log("deleting review:" + reviewID);
            await deleteReview(reviewID);
            await fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error.message);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value) {
            const filtered = reviews.filter(review =>
                review.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredReviews(filtered);
        } else {
            setFilteredReviews(reviews);
        }
    };

    return (
        <div className="user-main">
            <div className="report-container">
                <div className="report-header">
                    <h1 className="recent-Articles">Reviews</h1>
                    <div className="search-add-container">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search reviews by name"
                            className="search-input"
                        />
                    </div>
                    <button className="view">View All</button>
                </div>
                <div className="report-body">
                    <div className="report-topic-heading">
                        <h3 className="t-op">ID</h3>
                        <h3 className="t-op">Name</h3>
                        <h3 className="t-op">Comment</h3>
                        <h3 className="t-op">Actions</h3>
                    </div>
                    {filteredReviews.map((review) => (
                        <div key={review.reviewID} className="items">
                            <div className="item1">
                                <h3 className="t-op-nextlvl">{review.reviewID}</h3>
                                <h3 className="t-op-nextlvl">{review.name}</h3>
                                <h3 className="t-op-nextlvl">{review.comment}</h3>
                                <button
                                    onClick={() => removeReview(review.reviewID)}
                                    className="t-op-nextlvl delete-button bg-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reviews;
