const express = require('express');
const router = express.Router();
const storeAuthRoutes = require('./storeAuthRoute');
const storeBasicServiceRoutes = require('./storeBasicService');
const storeSettingRoutes = require('./storeSettingRoute');
const storeStaffRoutes = require('./storeStaffRoute');
const storeCategory = require('./storeCategoryRoute')
const storeFoodRoutes = require('./storeFoodRoute');
const storeDiscountRoutes = require('./storeDiscountRoute');
const storeTicketRoutes = require('./storeTicketRoute');
const storeOrderRoutes = require('./storeOrderRoute');
const storeCustomizationRoutes = require('./storeCustomizationRoute');
const storeMetricRoutes = require('./storeMetricRoute');
const storeRevenueRoute = require('./storeRevenueRoute');
const { verifyToken } = require('../../../middleware/jwt');

router.use('/auth', storeAuthRoutes);

router.use(verifyToken);

router.use('/', storeBasicServiceRoutes);
router.use('/profile', storeSettingRoutes);
router.use('/staff', storeStaffRoutes);
router.use('/categories', storeCategory);
router.use('/foods', storeFoodRoutes);
router.use('/discount', storeDiscountRoutes);
router.use('/tickets', storeTicketRoutes);
router.use('/order', storeOrderRoutes);
router.use('/orders', storeOrderRoutes);
router.use('/revenue', storeRevenueRoute);
router.use('/custom', storeCustomizationRoutes);
router.use('/metric', storeMetricRoutes);

module.exports = router;
