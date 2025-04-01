const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  value: {
    type: Number,
    required: true,
    min: 1
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  claimedAt: Date,
  claimedBy: [{
    ip: String,
    sessionId: String,
    userAgent: String,
    attemptAt: { 
      type: Date, 
      default: Date.now 
    },
    claimed: {  // NEW: Track successful claims separately
      type: Boolean,
      default: false
    }
  }],
  description: String,
  status: { 
    type: String,
    enum: ['Available', 'Claimed'],
    default: 'Available'
  },
  lastSelectedAt: {
    type: Date,
    default: null
  }
});

// Add these indexes for abuse prevention
couponSchema.index({ 'claimedBy.ip': 1 });
couponSchema.index({ 'claimedBy.sessionId': 1 });
couponSchema.index({ 'claimedBy.attemptAt': 1 });
couponSchema.index({ status: 1, isActive: 1 });

const Coupon = mongoose.model('Coupon', couponSchema, 'cupon');

module.exports = { Coupon };