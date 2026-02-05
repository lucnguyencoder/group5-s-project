//done
const express = require('express');
const router = express.Router();
const discountController = require('../../../controllers/store/storeDiscountController');
const { requirePermission } = require('../../../middleware/permission');

router.get('/',
    requirePermission('/api/store/discount', 'GET'),
    discountController.getAllDiscounts);
router.get('/:id',
    requirePermission('/api/store/discount/:id', 'GET'),
    discountController.getDiscountById);
router.post('/',
    requirePermission('/api/store/discount', 'POST'),
    discountController.createDiscount
);
router.put('/:id',
    requirePermission('/api/store/discount/:id', 'PUT'),
    discountController.updateDiscount
);
router.delete('/:id',
    requirePermission('/api/store/discount/:id', 'DELETE'),
    discountController.toggleDiscount
);

module.exports = router;