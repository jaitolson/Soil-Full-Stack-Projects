const express = require('express');
const router = express.Router();
const db = require('../models');

// Add item to cart
router.post('/', async (req, res) => {
  try {
    const cartItem = await db.CartItem.create(req.body);
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all cart items for a user
router.get('/:userId', async (req, res) => {
  try {
    const cartItems = await db.CartItem.findAll({
      where: { userID: req.params.userId },
      include: [db.Product] // Include associated Product data
    });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a cart item by ID
router.get('/:id', async (req, res) => {
  try {
    const cartItem = await db.CartItem.findByPk(req.params.id);
    if (cartItem) {
      res.status(200).json(cartItem);
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a cart item
router.put('/:id', async (req, res) => {
  try {
    const cartItem = await db.CartItem.findByPk(req.params.id);
    if (cartItem) {
      await cartItem.update(req.body);
      res.status(200).json(cartItem);
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a cart item
router.delete('/:id', async (req, res) => {
  try {
    const cartItem = await db.CartItem.findByPk(req.params.id);
    if (cartItem) {
      await cartItem.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
