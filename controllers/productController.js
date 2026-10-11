/**
 * controllers/productController.js
 * CRUD operations + filtering + pagination + aggregation for products.
 */
const mongoose = require('mongoose');
const createError = require('http-errors');
const Product = require('../models/Product');

// @desc   Create a new product
// @route  POST /api/products
// @access Private
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Image path returned by multer (if uploaded)
    const imagePath = req.file ? `/uploads/products/${req.file.filename}` : '';

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      image: imagePath,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get all products with filtering, search, sorting, pagination
// @route  GET /api/products
// @access Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      search,
      sort,
      page = 1,
      limit = 10,
      minPrice,
      maxPrice,
    } = req.query;

    // 1. Build the query filter
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' }; // search by name
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // 2. Sorting
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    // 3. Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('createdBy', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get a single product by id
// @route  GET /api/products/:id
// @access Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );
    if (!product) return next(createError(404, 'Product not found'));
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc   Update a product
// @route  PUT /api/products/:id
// @access Private
exports.updateProduct = async (req, res, next) => {
  try {
    let updates = { ...req.body };
    if (req.file) {
      updates.image = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) return next(createError(404, 'Product not found'));

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access Private
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return next(createError(404, 'Product not found'));

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: { _id: product._id },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Aggregation: product count + average price grouped by category
// @route  GET /api/products/stats/summary
// @access Public
exports.getProductStats = async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          productCount: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          totalStock: { $sum: '$stock' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { productCount: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id',
          productCount: 1,
          averagePrice: { $round: ['$averagePrice', 2] },
          totalStock: 1,
          minPrice: 1,
          maxPrice: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: stats.length,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};
