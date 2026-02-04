//done
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../../middleware/jwt');
const { requirePermission } = require('../../../middleware/permission');
const customerStoreController = require('../../../controllers/customer/customerStoreControlller');

router.use(verifyToken);

router.post('/:id/follow',
    requirePermission('/api/customer/stores/:id/follow', 'POST'),
    customerStoreController.addFavoriteStore)

router.get('/check',
    requirePermission('/api/customer/stores/check', 'GET'),
    customerStoreController.isFollowing
)

router.get('/following', [
    requirePermission('/api/customer/stores/following', 'GET')
], customerStoreController.getAllFollowingStores);




module.exports = router;