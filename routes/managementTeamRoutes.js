const express = require('express');
const router = express.Router();
const managementTeamController = require('../controllers/managementTeamController');

// Management Team CRUD
router.get('/team', managementTeamController.getAll);
router.get('/team/:id', managementTeamController.getById);
router.post('/team', managementTeamController.create);
router.put('/team/:id', managementTeamController.update);
router.delete('/team/:id', managementTeamController.delete);

// Profile and Password
router.get('/profile/:userId', managementTeamController.getProfile);
router.put('/update-password', managementTeamController.updatePassword);

module.exports = router;