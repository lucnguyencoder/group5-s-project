//done
const express = require('express')
const router = express.Router();
const { requirePermission } = require('../../../middleware/permission');
const storeOrderController = require('../../../controllers/store/storeOrderController');

router.get('/', requirePermission('/api/store/order', 'GET'), storeOrderController.getOrderList);
// router.get('/:id', requirePermission('/api/store/order/:id', 'GET'), storeOrderController.getOrderById);
router.put('/:id', requirePermission('/api/store/order/:id', 'PUT'), storeOrderController.updateOrder);
router.get('/courier', requirePermission('/api/store/order/courier', 'GET'), storeOrderController.getCourierList);


module.exports = router;