const express = require('express');
const authRouter = require('./auth.routes');
const projectRouter = require('./project.routes');
const taskRouter = require('./task.routes');
const commentRouter = require('./comment.routes');
const auditLogRouter = require('./auditLog.routes');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/projects', projectRouter);
router.use('/tasks', taskRouter);
router.use('/comments', commentRouter);
router.use('/audit-logs', auditLogRouter);

module.exports = router;




