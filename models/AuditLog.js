const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      required: true
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
