//done
const express = require('express')
const router = express.Router();
const { requirePermission } = require('../../../middleware/permission');
const storeOrderController = require('../../../controllers/store/storeOrderController');

router.get('/', requirePermission('/api/store/revenue', 'GET'), storeOrderController.getOrderList);

module.exports = router;