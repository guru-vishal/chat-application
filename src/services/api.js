import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://chat-application-pg0p.onrender.com/',
  timeout: 10000,
});

export default instance;
