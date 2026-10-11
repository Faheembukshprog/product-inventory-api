/**
 * routes/productRoutes.js
 */
const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  createProductRules,
  updateProductRules,
} = require('../validators/productValidator');
const { validate } = require('../middleware/validateMiddleware');

// Aggregation route MUST come before "/:id" to avoid being matched as an id
router.get('/stats/summary', getProductStats);

// Public read routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected write routes
router.post('/', protect, upload.single('image'), createProductRules, validate, createProduct);
router.put('/:id', protect, upload.single('image'), updateProductRules, validate, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
