const express = require('express');
const { registerUser, loginUser, getProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes
router.get('/profile', protect, getProfile);

module.exports = router;
