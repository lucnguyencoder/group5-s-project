//done
const express = require('express');
const router = express.Router();


const adminRoutes = require('./api/admin/adminIndex');
const storeRoutes = require('./api/store/storeIndex');
const customerRoutes = require('./api/customer/customerIndex');
const publicRoutes = require('./api/publicIndex');
const imageRoutes = require('./api/imageRoute');


router.use('/api/admin', adminRoutes);
router.use('/api/store', storeRoutes);
router.use('/api/customer', customerRoutes);
router.use('/api/images', imageRoutes);
router.use('/api', publicRoutes);

router.use('/*path', (req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = router;
