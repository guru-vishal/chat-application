💬 Chat Application

A simple full-stack chat application with real-time messaging, user authentication, and clean UI.

📁 Branch Structure

- **main** — Frontend (React Native - Mobile App)
- **master** — Backend (Node.js + MongoDB + Socket.io)

---

📱 Frontend - React Native

Branch: `main`

Go to the [main branch](https://github.com/guru-vishal/chat-application/tree/main) for instructions to run the **mobile app** using React Native and Expo.

---

🖥️ Backend - Node.js

Branch: `master`

Go to the [master branch](https://github.com/guru-vishal/chat-application/tree/master) for instructions to run the **backend server** powered by Node.js, Express, MongoDB, and Socket.io.

---

🌐 Live Backend API

Deployed on Render:  
[render](https://chat-application-pg0p.onrender.com)

---

📦 Features

- 🔐 User login and registration using MongoDB + JWT
- 💬 Real-time chat via Socket.io
- 🕒 Timestamps with each message
- 🧼 Clean and simple UI

---

🛠️ Project Setup Instructions

🚀 Project Setup Guide

This repo contains both the **mobile frontend** and **Node.js backend** of the Chat App, organized in different branches.

---

📱 Frontend (React Native + Expo)

📍 Branch: `main`

Steps to Run:
1. Clone the repository and switch to the `main` branch:
   git clone https://github.com/guru-vishal/chat-application.git
   cd chat-application
   git checkout main
   
3. Install dependencies:
   npm install

4. Start the development server:
   npx react-native start

5. Run it on your mobile device:
   
   For Android:
     npx react-native run-android

   For iOS:
     npx react-native run-ios



🖥️ Backend (Node.js + Express + MongoDB)

📍 Branch: `master`

Steps to Run:
  1. Clone the repository and switch to the master branch:
        git clone https://github.com/guru-vishal/chat-application.git
        cd chat-application
        git checkout master

  2. Install dependencies:
       npm install

  3. Create a .env file in the root of the backend directory:
       PORT=5000
       MONGO_URI=mongo_connection_string
       JWT_SECRET=your_jwt_secret_key

  4. Start the server:
       nodemon server.js

✅ Server will run on http://localhost:5000 or the port you set in .env.

---


🧪 Test the API
You can test login/register routes using Postman or curl:

POST /api/register – Create user

POST /api/login – Authenticate and get JWT


---


📄 License

MIT
