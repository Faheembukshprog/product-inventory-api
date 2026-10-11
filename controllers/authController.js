/**
 * controllers/authController.js
 * User registration + login using bcryptjs and JWT.
 */
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/User');

// Generate JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Reject if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return next(createError(409, 'Email is already registered'));
    }

    const user = await User.create({ name, email, password, role });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Login existing user
// @route  POST /api/auth/login
// @access Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(400, 'Email and password are required'));
    }

    // Need to explicitly select password because schema sets select:false
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(createError(401, 'Invalid credentials'));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(createError(401, 'Invalid credentials'));
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Return current logged-in user
// @route  GET /api/auth/me
// @access Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
