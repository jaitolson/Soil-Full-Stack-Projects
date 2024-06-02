const express = require('express');
const router = express.Router();
const db = require('../models');

// Follow a user
router.post('/', async (req, res) => {
  try {
    const { name, userID } = req.body;

    // Find the user by name
    const user = await db.User.findOne({ where: { name } });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followingID = user.userID; // ID of the user being followed
    const followerID = userID; // ID of the follower

    // Create the user follow entry
    const userFollow = await db.UserFollow.create({ followerID, followingID });

    res.status(201).json(userFollow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unfollow a user
router.delete('/', async (req, res) => {
  try {
    const { followerID, followingID } = req.body;
    const userFollow = await db.UserFollow.findOne({ where: { followerID, followingID } });
    if (userFollow) {
      await userFollow.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Follow relationship not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post('/checkFollow', async (req, res) => {
  try {
    const { followerID, followingID } = req.body;
    const follow = await db.UserFollow.findOne({ where: { followerID, followingID } });
    res.status(200).json({ isFollowing: !!follow });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;
