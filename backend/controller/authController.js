const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Admin } = require('../schema/adminModel.js');


const secretKey = process.env.JWT_SECRET;

const getLoggedin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const lowercaseEmail = email.trim().toLowerCase(); // Trim and lowercase
    
    const admin = await Admin.findOne({ email: lowercaseEmail });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ adminId: admin._id }, secretKey, { expiresIn: '1h' });

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:86400000 ,
    });

    res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getLoggedin };

