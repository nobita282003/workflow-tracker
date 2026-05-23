require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const AppError = require('./utils/appError');
const errorHandler = require('./middlewares/errorHandler');
const v1Router = require('./routes/v1');
const http = require('http');
const socketService = require('./utils/socketService');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workflow-tracker';

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/v1', v1Router);

app.all('*', (req, res, next) => {
  next(new AppError(`Khong tim thay duong dan ${req.originalUrl} tren he thong!`, 404));
});

app.use(errorHandler);

// Create HTTP server and initialise Socket.io service
const server = http.createServer(app);
socketService.init(server);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
