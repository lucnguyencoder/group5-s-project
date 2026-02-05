//done
const express = require('express');
const router = express.Router();
const adminProfileController = require('../../../controllers/admin/adminProfileController');
const { verifyToken } = require('../../../middleware/jwt');
const { requirePermission } = require('../../../middleware/permission');

router.use(verifyToken);

router.put('/',
    requirePermission('/api/admin/profile', 'PUT'),
    adminProfileController.updateProfile);

router.put('/change-password',
    requirePermission('/api/admin/profile/change-password', 'PUT'),
    adminProfileController.changePassword);

module.exports = router;