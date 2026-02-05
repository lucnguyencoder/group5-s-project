//done
const express = require('express');
const router = express.Router();
const { requirePermission } = require('../../../middleware/permission');
const storeStaffController = require('../../../controllers/store/storeStaffController');


router.get('/', [
    requirePermission('/api/store/staff', 'GET'),
], storeStaffController.getAllStaff)

router.get('/:staffId', [
    requirePermission('/api/store/staff/:staffId', 'GET'),
], storeStaffController.getStaffById)

router.put('/',
    requirePermission('/api/store/staff/:staffId', 'PUT'),
    storeStaffController.updateStaff)

router.post('/', requirePermission('/api/store/staff', 'POST'),
    storeStaffController.createStaff)

router.put('/:staffId',
    requirePermission('/api/store/staff/:staffId', 'DELETE'),
    storeStaffController.disableStaff
)

router.put('/change-role/:staffId',
    requirePermission('/api/store/staff/change-role/:staffId', 'PUT'),
    storeStaffController.changeRole
)

router.put('/checkIn/:staffId',
    requirePermission('/api/store/staff/checkIn/:staffId', 'PUT'),
    storeStaffController.setCheckInOut
)


module.exports = router;