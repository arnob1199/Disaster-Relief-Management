const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { getAdminDashboard, getVictimDashboard } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/admin', authenticate, authorize('admin'), getAdminDashboard);
router.get('/victim', authenticate, authorize('victim'), getVictimDashboard);

module.exports = router;
