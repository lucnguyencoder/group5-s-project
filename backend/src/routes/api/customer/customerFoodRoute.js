//done
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../../middleware/jwt');
const { body } = require('express-validator');
const { requirePermission } = require('../../../middleware/permission');
const customerFoodController = require('../../../controllers/customer/customerFoodController')

router.use(verifyToken);

router.post('/:id/save',
    requirePermission('/api/customer/products/:id/save', 'POST'),
    customerFoodController.addFavoriteFood);

router.get('/check',
    requirePermission('/api/customer/products/check', 'GET'),
    customerFoodController.isSave
)

router.get('/saved',
    requirePermission('/api/customer/products/saved', 'GET'),
    customerFoodController.getAllSavedFoods);



module.exports = router