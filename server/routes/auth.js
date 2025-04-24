import express from 'express';
import {register, login, getUsers, logout} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/users', authMiddleware, getUsers);
router.post('/logout', authMiddleware, logout);

export default router;