const express = require('express');
const taskController = require('../../controllers/task.controller');
const { protect } = require('../../middlewares/auth');
const { restrictTo, canManageTask } = require('../../middlewares/authorize');

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('Admin', 'Manager'), taskController.createTask);
router.get('/project/:projectId', taskController.getProjectTasks);

router
  .route('/:id')
  .get(taskController.getTask)
  .patch(restrictTo('Admin', 'Manager'), canManageTask, taskController.updateTask)
  .delete(restrictTo('Admin', 'Manager'), canManageTask, taskController.deleteTask);

router.patch('/:id/status', taskController.updateTaskStatus);

module.exports = router;
