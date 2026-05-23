const express = require('express');
const auditLogController = require('../../controllers/auditLog.controller');
const { protect } = require('../../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/project/:projectId', auditLogController.getProjectAuditLogs);
router.get('/task/:taskId', auditLogController.getTaskAuditLogs);

module.exports = router;
