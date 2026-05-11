const router = require('express').Router();
const { register, login, refreshToken, logout, getProfile, updateProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth.middleware');
const { validateRegister, validateLogin } = require('../middleware/validator');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfile);

module.exports = router;
