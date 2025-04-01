const { Coupon } = require('../schema/cuponModel.js');

const getClaimedcouponforUser = async (req, res) => {
  try {
    const sessionId = req.sessionID || req.cookies?.sessionId;
    const ipAddress = req.ip; // Get the user's IP

    if (!sessionId && !ipAddress) {
      return res.status(404).json({
        status: 'fail',
        message: 'No session or IP address found.',
      }); // Respond with 404 if no session or IP
    }

    const claimedCoupon = await Coupon.findOne({
      'claimedBy': {
        $elemMatch: {
          $or: [
            { sessionId, claimed: true },
            { ip: ipAddress, claimed: true },
          ],
        },
      },
    });

    if (claimedCoupon) {
      res.status(200).json({
        status: 'success',
        data: {
          coupon: claimedCoupon,
        },
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'No claimed coupon found for this session or IP.',
      }); // Respond with 404 if no coupon found
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Internal Server Error',
    }); // Respond with 500 for server errors
  }
};

module.exports = { getClaimedcouponforUser }; // Renamed export