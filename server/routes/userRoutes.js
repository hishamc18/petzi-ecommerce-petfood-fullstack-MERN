
const express = require('express');
const { registerUser, loginUser, logoutUser, refreshToken, getLoggedInUser } = require('../controllers/userController');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware')

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getLoggedInUser);
router.post('/refresh-token', refreshToken);

module.exports = router;