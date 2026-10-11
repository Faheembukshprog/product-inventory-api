/**
 * models/Product.js
 * Product schema with validation, indexes, and relationship to User.
 */
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [120, 'Product name cannot exceed 120 characters'],
      // Text index for search by name
      index: 'text',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      validate: {
        validator: function (v) {
          return v === undefined || v >= 0;
        },
        message: 'Price must be a non-negative number',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: [
        'Electronics',
        'Clothing',
        'Books',
        'Home',
        'Sports',
        'Beauty',
        'Grocery',
        'Toys',
        'Other',
      ],
      index: true, // index for fast filtering by category
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    image: {
      type: String,
      default: '', // path returned by multer, e.g. /uploads/products/abc.jpg
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Product must belong to a user'],
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index - useful for queries like "all products in a category sorted by price"
productSchema.index({ category: 1, price: 1 });
// Index on createdAt for sorting by date
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
