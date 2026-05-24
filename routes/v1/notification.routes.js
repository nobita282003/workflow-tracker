const express = require('express');
const notificationController = require('../../controllers/notification.controller');
const { protect } = require('../../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/', notificationController.getMyNotifications);
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
