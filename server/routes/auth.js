const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/users', authMiddleware, authController.getUsers);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;