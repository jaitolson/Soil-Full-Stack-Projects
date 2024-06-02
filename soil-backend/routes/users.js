require('dotenv').config();
const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const db = require('../models');


// Secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET;

// Sign up a new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Validate strong password
    const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number' });
    }

    // Create the user
    const user = await db.User.create({ name, email, password });

    // Generate a token
    const token = jwt.sign({ userId: user.userID }, SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Sign in an existing user
router.post('/signin', async (req, res) => {
  try {
    const {email, password} = req.body;
    console.log("test" + email)

    // Find the user by email
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Check the password
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate a token
    const token = jwt.sign({ userId: user.userID }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Delete related rows in the CartItems table
    await db.Order.destroy({ where: { userID: userId } });
    await db.CartItem.destroy({ where: { userID: userId } });
    await db.Review.destroy({ where: { userID: userId } });

    // Delete the user
    await user.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/select', async (req, res) => {
  try {
    const email  = req.query.email; // Retrieve email from query string
    const user = await db.User.findOne({
      where: {
        email: email
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put("/:id", async (req, res) => {
  try {
    // Find the user by ID
    const userId = req.params.id; 
    console.log("User ID:", userId);

    // Find the user by userid
    const user = await db.User.findByPk(userId);

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user data with the received updates
    if (req.body.name !== undefined) {
      user.name = req.body.name;
    }
    if (req.body.email !== undefined) {
      user.email = req.body.email;
    }

    // Save the updated user data to the database
    await user.save();

    // Return the updated user data as a response
    res.json(user);
  } catch (error) {
    // If an error occurs, return a 500 error with the error message
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router; 