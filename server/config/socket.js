import { Server } from 'socket.io';

let io = null;
const userSocketMap = new Map(); // userId -> Set of socketIds

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    // console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('register_user', (userId) => {
      if (!userId) return;
      if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, new Set());
      }
      userSocketMap.get(userId).add(socket.id);
      socket.userId = userId;
      // Join individual user room
      socket.join(`user_${userId}`);
    });

    socket.on('disconnect', () => {
      if (socket.userId && userSocketMap.has(socket.userId)) {
        const userSockets = userSocketMap.get(socket.userId);
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          userSocketMap.delete(socket.userId);
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};

export const emitToUser = (userId, eventName, data) => {
  if (!io) return;
  io.to(`user_${userId}`).emit(eventName, data);
};

export const emitToAll = (eventName, data) => {
  if (!io) return;
  io.emit(eventName, data);
};
