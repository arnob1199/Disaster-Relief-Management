const express = require('express');
const { body, param } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  getAllShelters,
  getShelterById,
  createShelter,
  updateShelter,
  deleteShelter
} = require('../controllers/shelterController');

const router = express.Router();

const idValidation = [
  param('id').isInt({ min: 1 }).withMessage('Shelter id must be a positive integer').toInt()
];

const shelterValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 150 }).withMessage('Name must not exceed 150 characters'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ max: 255 }).withMessage('Location must not exceed 255 characters'),
  body('contact_number')
    .trim()
    .notEmpty().withMessage('Contact number is required')
    .isLength({ max: 30 }).withMessage('Contact number must not exceed 30 characters'),
  body('capacity')
    .isInt({ min: 0 }).withMessage('Capacity must be an integer greater than or equal to 0')
    .toInt(),
  body('current_occupancy')
    .isInt({ min: 0 }).withMessage('Current occupancy must be an integer greater than or equal to 0')
    .toInt()
    .custom((value, { req }) => {
      if (value > req.body.capacity) {
        throw new Error('Current occupancy cannot exceed capacity');
      }
      return true;
    })
];

router.use(authenticate);

router.get('/', authorize('admin', 'victim'), getAllShelters);
router.get('/:id', authorize('admin', 'victim'), idValidation, getShelterById);
router.post('/', authorize('admin'), shelterValidation, createShelter);
router.put('/:id', authorize('admin'), idValidation, shelterValidation, updateShelter);
router.delete('/:id', authorize('admin'), idValidation, deleteShelter);

module.exports = router;
