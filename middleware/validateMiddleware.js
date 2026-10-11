/**
 * middleware/validateMiddleware.js
 * Collects express-validator results and returns 422 on failure.
 */
const { validationResult } = require('express-validator');
const createError = require('http-errors');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(createError(422, `Validation failed: ${messages.join(', ')}`));
  }
  next();
};

module.exports = { validate };
