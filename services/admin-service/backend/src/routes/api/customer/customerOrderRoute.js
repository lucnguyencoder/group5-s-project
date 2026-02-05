//done
const express = require('express');
const router = express.Router();
const customerOrderController = require('../../../controllers/customer/customerOrderController');
const { requirePermission } = require('../../../middleware/permission');

router.get('/', requirePermission('/api/customer/order', 'GET'), customerOrderController.getAllOrders);
router.get('/:id', requirePermission('/api/customer/order/:id', 'GET'), customerOrderController.getOrderById);
router.post('/', requirePermission('/api/customer/order', 'POST'), customerOrderController.createOrder);

module.exports = router;