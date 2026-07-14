const express = require('express');
const { body, param } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  getAllSupplies,
  getSupplyById,
  createSupply,
  updateSupply,
  deleteSupply
} = require('../controllers/supplyController');

const router = express.Router();

const idValidation = [
  param('id').isInt({ min: 1 }).withMessage('Supply id must be a positive integer').toInt()
];

const supplyValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 150 }).withMessage('Name must not exceed 150 characters'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isLength({ max: 100 }).withMessage('Category must not exceed 100 characters'),
  body('description')
    .optional({ nullable: true })
    .isString().withMessage('Description must be a string')
    .isLength({ max: 65535 }).withMessage('Description is too long'),
  body('quantity')
    .isInt({ min: 0 }).withMessage('Quantity must be an integer greater than or equal to 0')
    .toInt(),
  body('unit')
    .trim()
    .notEmpty().withMessage('Unit is required')
    .isLength({ max: 50 }).withMessage('Unit must not exceed 50 characters')
];

router.use(authenticate);

router.get('/', authorize('admin', 'victim'), getAllSupplies);
router.get('/:id', authorize('admin', 'victim'), idValidation, getSupplyById);
router.post('/', authorize('admin'), supplyValidation, createSupply);
router.put('/:id', authorize('admin'), idValidation, supplyValidation, updateSupply);
router.delete('/:id', authorize('admin'), idValidation, deleteSupply);

module.exports = router;
