/**
 * config/db.js
 * MongoDB Atlas connection helper using Mongoose.
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true,
    });
    console.log(`\n  MongoDB connected: ${conn.connection.host}`);
    console.log(`  Database: ${conn.connection.name}\n`);
  } catch (error) {
    console.error(`\n  MongoDB connection error: ${error.message}\n`);
    process.exit(1);
  }
};

module.exports = connectDB;
