const express = require('express');
const Analytics = require('../models/Analytics');
const router = express.Router();

// Middleware to ensure admin access
const ensureAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Track user interaction
router.post('/track', async (req, res) => {
  try {
    const {
      eventType,
      details,
      location
    } = req.body;

    await Analytics.create({
      userId: req.user._id,
      eventType,
      details,
      location,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    });

    res.json({ message: 'Interaction tracked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track interaction' });
  }
});

// Get user interactions (admin only)
router.get('/interactions', ensureAdmin, async (req, res) => {
  try {
    const { startDate, endDate, eventType } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (eventType) {
      query.eventType = eventType;
    }

    const interactions = await Analytics.find(query)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(1000);

    res.json({ interactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interactions' });
  }
});

// Get download statistics (admin only)
router.get('/downloads', ensureAdmin, async (req, res) => {
  try {
    const stats = await Analytics.aggregate([
      {
        $match: { eventType: 'DOWNLOAD' }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch download statistics' });
  }
});

// Get error logs (admin only)
router.get('/errors', ensureAdmin, async (req, res) => {
  try {
    const errors = await Analytics.find({
      eventType: 'ERROR'
    })
    .populate('userId', 'name email')
    .sort({ timestamp: -1 })
    .limit(100);

    res.json({ errors });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch error logs' });
  }
});

// Get user locations (admin only)
router.get('/locations', ensureAdmin, async (req, res) => {
  try {
    const locations = await Analytics.aggregate([
      {
        $match: {
          'location.latitude': { $exists: true },
          'location.longitude': { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            latitude: '$location.latitude',
            longitude: '$location.longitude',
            country: '$location.country'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ locations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
});

// Get dashboard summary (admin only)
router.get('/dashboard-summary', ensureAdmin, async (req, res) => {
  try {
    const [
      totalDownloads,
      totalErrors,
      recentInteractions,
      userLocations
    ] = await Promise.all([
      Analytics.countDocuments({ eventType: 'DOWNLOAD' }),
      Analytics.countDocuments({ eventType: 'ERROR' }),
      Analytics.find()
        .sort({ timestamp: -1 })
        .limit(10)
        .populate('userId', 'name email'),
      Analytics.aggregate([
        {
          $match: {
            'location.country': { $exists: true }
          }
        },
        {
          $group: {
            _id: '$location.country',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ])
    ]);

    res.json({
      totalDownloads,
      totalErrors,
      recentInteractions,
      userLocations
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

module.exports = router; 