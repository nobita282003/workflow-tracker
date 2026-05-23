const socketIo = require('socket.io');

let io;
const userSockets = new Map();

// Khởi tạo Socket.io server, truyền vào HTTP server đã tạo ở server.js
const init = (server) => {
  io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Khi một client kết nối, lắng nghe sự kiện register để gắn userId với socketId
  io.on('connection', (socket) => {
    socket.on('register', (userId) => {
      if (userId) {
        userSockets.set(userId.toString(), socket.id);
      }
    });

    // Khi ngắt kết nối, xóa mapping tương ứng
    socket.on('disconnect', () => {
      for (const [uid, sid] of userSockets.entries()) {
        if (sid === socket.id) {
          userSockets.delete(uid);
          break;
        }
      }
    });
  });
};

// Gửi một event tới một user cụ thể (private notification)
const sendToUser = (userId, event, data) => {
  if (!io) return;
  const socketId = userSockets.get(userId?.toString());
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

module.exports = {
  init,
  sendToUser
};
