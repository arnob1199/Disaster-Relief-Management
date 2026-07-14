const express = require('express');
const { body, param } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  deleteRequest
} = require('../controllers/reliefRequestController');

const router = express.Router();

const idValidation = [
  param('id').isInt({ min: 1 }).withMessage('Request id must be a positive integer').toInt()
];

const createRequestValidation = [
  body('shelter_id')
    .isInt({ min: 1 }).withMessage('Shelter id must be a positive integer')
    .toInt(),
  body('priority')
    .isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('remarks')
    .optional({ nullable: true })
    .isString().withMessage('Remarks must be a string')
    .isLength({ max: 65535 }).withMessage('Remarks are too long')
];

const statusValidation = [
  body('status')
  .isIn(['Pending', 'Approved', 'Rejected', 'Distributed'])
  .withMessage('Status must be Pending, Approved, Rejected, or Distributed')
];

router.use(authenticate);

router.get('/', authorize('admin', 'victim'), getAllRequests);
router.get('/:id', authorize('admin', 'victim'), idValidation, getRequestById);
router.post('/', authorize('victim'), createRequestValidation, createRequest);
router.put('/:id/status', authorize('admin'), idValidation, statusValidation, updateRequestStatus);
router.delete('/:id', authorize('admin'), idValidation, deleteRequest);

module.exports = router;
