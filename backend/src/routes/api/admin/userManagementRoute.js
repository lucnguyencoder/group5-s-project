//done
const express = require('express');
const router = express.Router();
const userManagementController = require('../../../controllers/admin/userManagementController');
const { requirePermission } = require('../../../middleware/permission');
const { body } = require('express-validator');
const validate = require('../validateRes');

router.get('/',
    requirePermission('/api/admin/users', 'GET'),
    userManagementController.getAllUsers
);

router.get('/:id',
    requirePermission('/api/admin/users/:id', 'GET'),
    userManagementController.getUserById
);

router.post('/', [
    requirePermission('/api/admin/users', 'POST'),
    [body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('group_id').isInt().withMessage('Group ID must be an integer'), validate]
], userManagementController.createUser);

router.put('/:id', [
    requirePermission('/api/admin/users/:id', 'PUT'),
    [body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('group_id').optional().isInt().withMessage('Group ID must be an integer'), validate]
], userManagementController.updateUser);

router.delete('/:id',
    requirePermission('/api/admin/users/:id', 'DELETE'),
    userManagementController.toggleUser
);

module.exports = router;
