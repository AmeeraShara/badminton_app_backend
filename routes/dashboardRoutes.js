const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');

router.get('/', DashboardController.getCounts);
router.get('/detailed', DashboardController.getDetailedStats);

module.exports = router;