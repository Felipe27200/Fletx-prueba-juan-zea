const express = require('express');
const router = express.Router();
const authController = require('../controller/AuthController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/refresh-token', authController.handleRefreshToken);

module.exports = router;
