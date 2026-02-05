//done
const express = require('express');
const router = express.Router();
const customerAuthRoutes = require('./customer/customerAuthRoute');
const publicDataRoutes = require('./publicDataRoute');

router.use('/auth', customerAuthRoutes);
router.use('/data', publicDataRoutes);

module.exports = router;
