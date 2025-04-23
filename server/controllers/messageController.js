const Message = require('../models/Message');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.userId;
    
    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content
    });
    
    await message.save();
    
    return res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get chat history between two users
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;
    
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'username profilePic')
    .populate('recipient', 'username profilePic');
    
    // Mark messages as read
    await Message.updateMany(
      { sender: userId, recipient: currentUserId, read: false },
      { read: true }
    );
    
    return res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};