import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default (io) => {
  const userSockets = new Map();
  
  io.on('connection', async (socket) => {
    console.log('New client connected');
    
    socket.on('authenticate', async (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const userId = decoded.userId;
        
        userSockets.set(userId, socket.id);
        
        await User.findByIdAndUpdate(userId, { isOnline: true });
        
        io.emit('userStatus', { userId, isOnline: true });
        
        console.log(`User ${userId} authenticated`);
      } catch (error) {
        console.error('Socket authentication error:', error);
      }
    });
    
    socket.on('sendMessage', async (data) => {
      const { senderId, recipientId, content } = data;
      
      const recipientSocketId = userSockets.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('newMessage', {
          senderId,
          content,
          createdAt: new Date()
        });
      }
    });
    
    socket.on('typing', (data) => {
      const { senderId, recipientId, isTyping } = data;
      
      const recipientSocketId = userSockets.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('userTyping', {
          senderId,
          isTyping
        });
      }
    });
    

    socket.on('disconnect', async () => {
      console.log('Client disconnected');
      
      let disconnectedUserId = null;
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          break;
        }
      }
      
      if (disconnectedUserId) {
        await User.findByIdAndUpdate(disconnectedUserId, { isOnline: false });

        io.emit('userStatus', { userId: disconnectedUserId, isOnline: false });
      }
    });
  });
};