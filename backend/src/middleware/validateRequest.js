const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Error de validación',
        details: errors.array()
      }
    });
  }
  next();
};

module.exports = validateRequest; 