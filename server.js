/**
 * server.js - Application entry point
 * Product Inventory CRUD API
 *
 * Responsibilities:
 *  - Load environment variables
 *  - Connect to MongoDB
 *  - Configure Express middleware (helmet, cors, rate-limit, morgan)
 *  - Mount auth and product routes
 *  - Register not-found + centralized error handlers
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Connect to MongoDB Atlas (or local MongoDB) via Mongoose
connectDB();

const app = express();

// -----------------------------
// Security middleware
// -----------------------------
app.use(helmet());                       // Sets secure HTTP headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

// Rate limiter - prevents brute-force / DoS attacks
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use(limiter);

// -----------------------------
// Body parsers
// -----------------------------
app.use(express.json({ limit: '10mb' }));           // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));     // Parse URL-encoded bodies

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded product images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -----------------------------
// Routes
// -----------------------------
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Product Inventory API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// -----------------------------
// 404 + centralized error handler (must be last)
// -----------------------------
app.use(notFound);
app.use(errorHandler);

// -----------------------------
// Start the server
// -----------------------------
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n  Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`  Listening on http://localhost:${PORT}`);
  console.log(`  Health check: http://localhost:${PORT}/health\n`);
});

// Graceful shutdown on unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});
