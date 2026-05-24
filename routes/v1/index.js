const express = require('express');
const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');
const projectRouter = require('./project.routes');
const taskRouter = require('./task.routes');
const commentRouter = require('./comment.routes');
const auditLogRouter = require('./auditLog.routes');
const notificationRouter = require('./notification.routes');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/projects', projectRouter);
router.use('/tasks', taskRouter);
router.use('/comments', commentRouter);
router.use('/audit-logs', auditLogRouter);
router.use('/notifications', notificationRouter);

module.exports = router;




