//done
const express = require('express');
const router = express.Router();
const adminAuthRoutes = require('./adminAuthRoute');
const userManagementRoutes = require('./userManagementRoute');
const groupManagementRoutes = require('./groupManagementRoute');
const storeManagementRoutes = require('./storeManagementRoute');
const adminProfileRoutes = require('./adminProfileRoute');
const adminTicketRoutes = require('./adminTicketRoute');
const { verifyToken } = require('../../../middleware/jwt');

router.use('/auth', adminAuthRoutes);

router.use(verifyToken);

router.use('/users', userManagementRoutes);
router.use('/groups', groupManagementRoutes);
router.use('/stores', storeManagementRoutes);
router.use('/profile', adminProfileRoutes);
router.use('/tickets', adminTicketRoutes);

module.exports = router;