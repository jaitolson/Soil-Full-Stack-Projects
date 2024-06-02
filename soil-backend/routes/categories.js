const express = require('express');
const router = express.Router();
const db = require('../models');

// Create a new category
router.post('/', async (req, res) => {
  try {
    const category = await db.Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await db.Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await db.Category.findByPk(req.params.id);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  try {
    const category = await db.Category.findByPk(req.params.id);
    if (category) {
      await category.update(req.body);
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const category = await db.Category.findByPk(req.params.id);
    if (category) {
      await category.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
