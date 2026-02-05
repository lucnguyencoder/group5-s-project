const express = require('express');
const router = express.Router();
const customerProfileController = require('../../../controllers/customer/customerProfileController');
const { verifyToken } = require('../../../middleware/jwt');
const { requirePermission } = require('../../../middleware/permission');
const { body, validationResult } = require('express-validator');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    }
});

// Middleware for validation
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};


router.post('/toggle2fa', [
    verifyToken,
    body('userId').notEmpty().withMessage('Please enter an valid email')
], customerProfileController.toggle2Fa)


router.put('/change-password', [
    verifyToken,
    requirePermission(),
    body('current_password').notEmpty().withMessage('Current password is required'),
    body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    validate
], customerProfileController.changePassword);

router.get('/', [
    verifyToken,
], customerProfileController.getProfile);


router.put('/', [
    verifyToken,
    requirePermission(),
    body('full_name').optional().notEmpty().withMessage('Full name cannot be empty'),
    body('date_of_birth').optional().isISO8601().withMessage('Please enter a valid date'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
    validate
], customerProfileController.updateProfile);

router.post('/avatar', [
    verifyToken,
    requirePermission(),
    upload.single('avatar')
], customerProfileController.uploadAvatar);

module.exports = router;