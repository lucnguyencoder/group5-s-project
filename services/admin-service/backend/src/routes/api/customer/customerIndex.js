const express = require('express');
const router = express.Router();
const customerProfileRoutes = require('./customerProfileRoute');
const customerLocationRoutes = require('./customerLocationRoute');

const customerTicketRoutes = require('./customerTicketRoute');
const customerFoodRoutes = require('./customerFoodRoute');
const customerStoreRoutes = require('./customerStoreRoute');
const customerOrderRoutes = require('./customerOrderRoute');
const { verifyToken } = require('../../../middleware/jwt');

router.use(verifyToken);

router.use('/profile', customerProfileRoutes);
router.use('/locations', customerLocationRoutes);
router.use('/tickets', customerTicketRoutes);
router.use('/products', customerFoodRoutes);
router.use('/stores', customerStoreRoutes);
router.use('/order', customerOrderRoutes);

module.exports = router;
