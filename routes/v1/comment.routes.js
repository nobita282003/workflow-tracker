const express = require('express');
const commentController = require('../../controllers/comment.controller');
const { protect } = require('../../middlewares/auth');

const router = express.Router();

router.use(protect);

router.post('/', commentController.createComment);
router.get('/task/:taskId', commentController.getTaskComments);

router
  .route('/:id')
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;
