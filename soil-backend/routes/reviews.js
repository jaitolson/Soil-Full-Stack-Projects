const express = require('express');
const router = express.Router();
const db = require('../models');
const { PubSub } = require('graphql-subscriptions');
const { pubsub } = require('../graphql'); // Import PubSub instance from admin backend server

// Create a review
// Create a review
router.post('/', async (req, res) => {
  try {
    const { userID, productID, name, comment, rating } = req.body;
    const review = await db.Review.create({ userID, productID, comment, rating, name });
    
    // Publish the REVIEW_ADDED event with the new review data
    pubsub.publish("REVIEW_ADDED", {newReview: review });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Update a review
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;

    const review = await db.Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    review.comment = comment;
    review.rating = rating;
    await review.save();

    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const review = await db.Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all reviews for a product
router.get('/product/:productID', async (req, res) => {
  try {
    const { productID } = req.params;
    const reviews = await db.Review.findAll({ where: { productID } });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await db.Review.findByPk(req.params.id);
    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
