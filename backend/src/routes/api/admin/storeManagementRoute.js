//done
const express = require('express');
const router = express.Router();
const storeManagementController = require('../../../controllers/admin/storeManagementController');
const { requirePermission } = require('../../../middleware/permission');

router.get('/',
    requirePermission('/api/admin/stores', 'GET'),
    storeManagementController.getAllStores
);

router.get('/:id',
    requirePermission('/api/admin/stores/:id', 'GET'),
    storeManagementController.getStoreById
);

router.post('/', [
    requirePermission('/api/admin/stores', 'POST'),
], storeManagementController.createStore);

router.put('/:id', [
    requirePermission('/api/admin/stores/:id', 'PUT'),
], storeManagementController.updateStore);

router.patch('/:id/toggle-status',
    requirePermission('/api/admin/stores/:id/toggle-status', 'PATCH'),
    storeManagementController.toggleStoreStatus
);

router.patch('/:id/toggle-temp-closed',
    requirePermission('/api/admin/stores/:id/toggle-temp-closed', 'PATCH'),
    storeManagementController.toggleStoreTempClosed
);

module.exports = router;
