const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

const registerValidation = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ max: 150 }).withMessage('Full name must not exceed 150 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('A valid email address is required')
    .normalizeEmail(),
  body('password')
    .isString().withMessage('Password must be a string')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .isLength({ max: 30 }).withMessage('Phone must not exceed 30 characters'),
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ max: 500 }).withMessage('Address must not exceed 500 characters')
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('A valid email address is required')
    .normalizeEmail(),
  body('password')
    .isString().withMessage('Password must be a string')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

module.exports = router;
