const { Coupon } = require('../schema/cuponModel.js');

const assignCouponToUser = async (req, res, next) => {
  try {
    const { sessionId, userAgent, ipAddress } = req.claimTracking;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Atomic find-and-update with cooldown check
    const availableCoupon = await Coupon.findOneAndUpdate(
      {
        status: 'Available',
        isActive: true,
        $nor: [{
          'claimedBy': {
            $elemMatch: {
              $or: [
                { sessionId, claimed: true },
                { ip: ipAddress, claimed: true }
              ],
              attemptAt: { $gt: twentyFourHoursAgo }
            }
          }
        }]
      },
      {
        $set: {
          status: 'Claimed',
          claimedAt: new Date(),
          lastSelectedAt: new Date()
        },
        $push: {
          claimedBy: {
            ip: ipAddress,
            sessionId,
            userAgent,
            claimed: true,
            attemptAt: new Date()
          }
        }
      },
      {
        sort: { lastSelectedAt: 1 },
        new: true
      }
    );

    if (!availableCoupon) {
      // Check if failure was due to cooldown
      const recentClaim = await Coupon.findOne({
        'claimedBy': {
          $elemMatch: {
            $or: [
              { sessionId, claimed: true },
              { ip: ipAddress, claimed: true }
            ],
            attemptAt: { $gt: twentyFourHoursAgo }
          }
        }
      }).sort({ 'claimedBy.attemptAt': -1 });

      if (recentClaim) {
        const claimRecord = recentClaim.claimedBy.find(claim =>
          (claim.sessionId === sessionId || claim.ip === ipAddress) &&
          claim.claimed === true &&
          new Date(claim.attemptAt) > twentyFourHoursAgo
        );

        const nextAvailableTime = new Date(new Date(claimRecord.attemptAt).getTime() + 24 * 60 * 60 * 1000);
        const remainingMs = nextAvailableTime - new Date();

        return res.status(429).json({
          status: 'fail',
          message: 'You can only claim one coupon every 24 hours',
          cooldown: {
            remaining: remainingMs, // changed to remaingMs
            humanReadable: formatCooldown(remainingMs),
            nextAvailable: nextAvailableTime.toISOString()
          }
        });
      }

      return res.status(404).json({
        status: 'fail',
        message: 'No available coupons at this time'
      });
    }

    // Success response
    res.status(200).json({
      status: 'success',
      data: {
        coupon: {
          _id: availableCoupon._id, // added to send _id
          code: availableCoupon.code,
          value: availableCoupon.value,
          type: availableCoupon.type,
          description: availableCoupon.description,
          claimedAt: availableCoupon.claimedAt,
          expiryDate: availableCoupon.expiryDate, // Added expiryDate
        },
        cooldown: {
          duration: '24 hours',
          nextEligible: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      }
    });

  } catch (err) {
    next(err);
  }
};

// Helper function
function formatCooldown(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

module.exports = { assignCouponToUser };