const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['PAGE_VIEW', 'SECTION_INTERACTION', 'FORM_SUBMISSION', 'ERROR', 'DOWNLOAD']
  },
  details: {
    section: String,
    action: String,
    errorMessage: String,
    stackTrace: String,
    formData: Object
  },
  userAgent: String,
  ipAddress: String,
  location: {
    latitude: Number,
    longitude: Number,
    city: String,
    country: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
analyticsSchema.index({ userId: 1, eventType: 1, timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema); 