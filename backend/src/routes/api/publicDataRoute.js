const express = require('express');
const router = express.Router();
const publicDataController = require('../../controllers/publicDataController');

router.get('/foods', publicDataController.getFoods);

router.get('/foods/:foodId', publicDataController.getFoodById);

router.get('/stores', publicDataController.getStoreList);
router.get('/stores/:storeId', publicDataController.getStoreInfo);
router.get('/stores/promotions/:storeId', publicDataController.getStorePromotions);

router.post('/cart/item', publicDataController.getCartItem);

router.get('/feature/:storeId', [
], publicDataController.getFeatureFood);
module.exports = router;
