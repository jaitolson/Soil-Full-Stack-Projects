// routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../models');
// Get all products with their categories
router.get('/', async (req, res) => {
  try {
    const products = await db.Product.findAll({
      include: [{
        model: db.Category,
        through: {
          attributes: [] // exclude ProductCategory join table attributes
        }
      }]
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a product by ID with its categories
router.get('/:id', async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.id, {
      include: [{
        model: db.Category,
        through: {
          attributes: [] // exclude ProductCategory join table attributes
        }
      }]
    });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
