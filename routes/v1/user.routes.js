const express = require('express');
const userController = require('../../controllers/user.controller');
const { protect } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', protect, userController.getAllUsers);

module.exports = router;
