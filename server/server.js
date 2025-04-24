import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import {Server} from "socket.io";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messages.js";
import http from "http";
import env from "dotenv";
import chatSocket from "./sockets/chat.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

env.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chatapp').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.use('/api', authRoutes);
app.use('/api', messageRoutes);

chatSocket(io);

app.get('/', (req, res) => {
  res.send('Chat Application API');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});