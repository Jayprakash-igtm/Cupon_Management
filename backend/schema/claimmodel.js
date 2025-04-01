import mongoose from 'mongoose';

const claimHistorySchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  couponCode: {
    type: String,
    required: true
  },
  claimedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  sessionId: {
    type: String,
    required: true
  },
  location: {
    country: String,
    region: String,
    city: String
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'unknown']
  }
});

// Indexes for analytics and abuse prevention
claimHistorySchema.index({ ipAddress: 1, claimedAt: 1 });
claimHistorySchema.index({ sessionId: 1 });
claimHistorySchema.index({ couponCode: 1 });

module.exports =  mongoose.model('ClaimHistory', claimHistorySchema);