const express = require('express');
const router = express.Router();
const db = require('../models');

// Create a new special product
router.post('/', async (req, res) => {
  try {
    const specialProduct = await db.SpecialProduct.create(req.body);
    res.status(201).json(specialProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all special products
router.get('/', async (req, res) => {
  try {
    const specialProducts = await db.SpecialProduct.findAll({
      include: [db.Product] // Include associated Product data
    });
    res.status(200).json(specialProducts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a special product by ID
router.get('/:id', async (req, res) => {
  try {
    const specialProduct = await db.SpecialProduct.findByPk(req.params.id);
    if (specialProduct) {
      res.status(200).json(specialProduct);
    } else {
      res.status(404).json({ error: 'Special product not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a special product
router.put('/:id', async (req, res) => {
  try {
    const specialProduct = await db.SpecialProduct.findByPk(req.params.id);
    if (specialProduct) {
      await specialProduct.update(req.body);
      res.status(200).json(specialProduct);
    } else {
      res.status(404).json({ error: 'Special product not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a special product
router.delete('/:id', async (req, res) => {
  try {
    const specialProduct = await db.SpecialProduct.findByPk(req.params.id);
    if (specialProduct) {
      await specialProduct.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Special product not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
