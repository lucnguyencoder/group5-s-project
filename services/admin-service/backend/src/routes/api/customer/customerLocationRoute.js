//done
const express = require('express');
const router = express.Router();
const customerLocationController = require('../../../controllers/customer/customerLocationController');

router.get('/', customerLocationController.getAllLocations);
router.get('/:id', customerLocationController.getLocationById);
router.post('/', customerLocationController.createLocation);
router.put('/:id', customerLocationController.updateLocation);
router.delete('/:id', customerLocationController.deleteLocation);

router.put('/:id/default', customerLocationController.setDefaultLocation);

module.exports = router;