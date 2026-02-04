//done
const express = require('express');
const router = express.Router();
const { requirePermission } = require('../../../middleware/permission');
const { body } = require('express-validator');
const storeSettingController = require('../../../controllers/store/storeSettingController');
const validate = require('../validateRes');

router.put("/update",
    requirePermission("/api/store/profile/update", "PUT"),
    storeSettingController.updateStoreSetting)

router.get("/config",
    requirePermission("/api/store/profile/config", "GET"),
    storeSettingController.getStoreConfig);

router.post("/config",
    requirePermission("/api/store/profile/config", "POST"),
    storeSettingController.updateStoreConfig);

module.exports = router;