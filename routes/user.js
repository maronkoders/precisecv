const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    ).select('-password');

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Get user's download history
router.get('/downloads', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ downloads: user.downloads });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch download history' });
  }
});

// Get user's subscription status
router.get('/subscription', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ hasActiveSubscription: user.hasActiveSubscription });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
});

// Update user's location
router.post('/location', async (req, res) => {
  try {
    const { latitude, longitude, city, country } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, {
      $set: {
        'lastKnownLocation': {
          latitude,
          longitude,
          city,
          country
        }
      }
    });

    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Delete user account
router.delete('/account', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    req.logout();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Get user's activity summary
router.get('/activity', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const downloadCount = user.downloads.length;
    const lastDownload = user.downloads[downloadCount - 1];
    const paymentCount = user.paymentHistory.length;
    const lastPayment = user.paymentHistory[paymentCount - 1];

    res.json({
      totalDownloads: downloadCount,
      lastDownload,
      totalPayments: paymentCount,
      lastPayment,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity summary' });
  }
});

module.exports = router; 