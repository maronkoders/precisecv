const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId && !this.facebookId;
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  googleId: String,
  facebookId: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  downloads: [{
    cvId: String,
    downloadedAt: Date,
    location: {
      latitude: Number,
      longitude: Number,
      city: String,
      country: String
    }
  }],
  paymentHistory: [{
    amount: Number,
    currency: String,
    status: String,
    stripePaymentId: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 