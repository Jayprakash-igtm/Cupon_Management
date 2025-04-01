const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Middleware to verify JWT token from cookie
const verifyAdmin = (req, res, next) => {
    const token = req.cookies.adminToken;
  const secretKey= process.env.JWT_SECRET;

    if (token) {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid token' });
        }
  
        req.adminId = decoded.adminId; // Store admin ID in request object
        next(); // Proceed to the next middleware/route handler
      });
    } else {
      res.status(401).json({ message: 'Authentication required' });
    }
  };

  module.exports = {verifyAdmin};