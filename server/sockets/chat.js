const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (io) => {
  // Map to store user socket connections
  const userSockets = new Map();
  
  io.on('connection', async (socket) => {
    console.log('New client connected');
    
    // Authenticate user via token
    socket.on('authenticate', async (token) => {
      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const userId = decoded.userId;
        
        // Store user socket connection
        userSockets.set(userId, socket.id);
        
        // Update user online status
        await User.findByIdAndUpdate(userId, { isOnline: true });
        
        // Broadcast user online status
        io.emit('userStatus', { userId, isOnline: true });
        
        console.log(`User ${userId} authenticated`);
      } catch (error) {
        console.error('Socket authentication error:', error);
      }
    });
    
    // Handle new message
    socket.on('sendMessage', async (data) => {
      const { senderId, recipientId, content } = data;
      
      // Send to recipient if online
      const recipientSocketId = userSockets.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('newMessage', {
          senderId,
          content,
          createdAt: new Date()
        });
      }
    });
    
    // Handle typing indicator
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
    
    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log('Client disconnected');
      
      // Find userId by socket.id and remove from map
      let disconnectedUserId = null;
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          break;
        }
      }
      
      // Update user online status
      if (disconnectedUserId) {
        await User.findByIdAndUpdate(disconnectedUserId, { isOnline: false });
        
        // Broadcast user offline status
        io.emit('userStatus', { userId: disconnectedUserId, isOnline: false });
      }
    });
  });
};