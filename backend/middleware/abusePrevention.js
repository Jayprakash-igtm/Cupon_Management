const { Coupon } = require('../schema/cuponModel.js');

const preventCouponAbuse = (req, res, next) => {
  const sessionId = req.sessionID || req.cookies?.sessionId;
  if (!sessionId) return res.status(401).json({ message: "Session required" });

  req.claimTracking = {
    sessionId,
    userAgent: req.get('User-Agent'),
    ipAddress: req.ip,
  };
  next();
};

module.exports = { preventCouponAbuse };

//It retrieves the session ID.
//It creates the req.claimTracking object with the user's session ID, user agent, and IP address.
//It calls next() to pass control to the next middleware or route handler.

