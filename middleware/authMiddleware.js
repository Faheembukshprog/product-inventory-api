/**
 * middleware/authMiddleware.js
 * JWT verification + route protection.
 */
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(createError(401, 'Not authorized, no token provided'));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(createError(401, 'Not authorized, user not found'));
    }
    req.user = user;
    next();
  } catch (err) {
    return next(createError(401, 'Not authorized, token failed'));
  }
};

// Optional: restrict to admin role
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return next(createError(403, 'Not authorized as admin'));
};

module.exports = { protect, admin };
