const express = require('express');
const router = express.Router();
const authController = require('../../../controllers/authController');
const { verifyToken } = require('../../../middleware/jwt');
const { requirePermission } = require('../../../middleware/permission');
const { body, validationResult } = require('express-validator');
const { User } = require('../../../models');
const validate = require('../validateRes');

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], authController.login);

router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('full_name').notEmpty().withMessage('Full name is required'),
    validate
], authController.register);


router.post('/logout', verifyToken, authController.logout);

router.get('/me', verifyToken, authController.getProfile);

router.post('/refresh', verifyToken, authController.refreshToken);

router.post('/authenticate/verify',
    authController.verify2FA);


router.post('/account-recovery/request',
    authController.requestRecoveryAccount);

router.post('/account-recovery/verifyOTP',
    authController.verifyOTP)

router.post('/account-recovery/reset-password',
    authController.resetPassword);

module.exports = router;