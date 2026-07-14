const express = require('express');
const { body, param } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  getAllDistributions,
  getDistributionById,
  createDistribution,
  deleteDistribution
} = require('../controllers/distributionController');

const router = express.Router();

const idValidation = [
  param('id').isInt({ min: 1 }).withMessage('Distribution id must be a positive integer').toInt()
];

const createDistributionValidation = [
  body('request_id')
    .isInt({ min: 1 }).withMessage('Request id must be a positive integer')
    .toInt(),
  body('items')
    .isArray({ min: 1 }).withMessage('At least one distribution item is required'),
  body('items.*.supply_id')
    .isInt({ min: 1 }).withMessage('Each supply id must be a positive integer')
    .toInt(),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Each quantity must be a positive integer')
    .toInt(),
  body('notes')
    .optional({ nullable: true })
    .isString().withMessage('Notes must be a string')
    .isLength({ max: 65535 }).withMessage('Notes are too long')
];

router.use(authenticate, authorize('admin'));

router.get('/', getAllDistributions);
router.get('/:id', idValidation, getDistributionById);
router.post('/', createDistributionValidation, createDistribution);
router.delete('/:id', idValidation, deleteDistribution);

module.exports = router;
