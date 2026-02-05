//done
const express = require("express");
const router = express.Router();
const { requirePermission } = require("../../../middleware/permission");
const storeCustomizationController = require("../../../controllers/store/storeCustomizationController");

router.get("/:storeId",
    requirePermission('/api/store/custom/:storeId', 'GET'),
    storeCustomizationController.getData
)

router.delete("/:storeId",
    requirePermission('/api/store/custom/:storeId', 'DELETE'),
    storeCustomizationController.deleteAll
)

router.put("/",
    requirePermission('/api/store/custom/', 'PUT'),
    storeCustomizationController.updateData
)

router.post("/",
    requirePermission('/api/store/custom/', 'POST'),
    storeCustomizationController.createData
)

router.delete("/",
    requirePermission('/api/store/custom/', 'DELETE'),
    storeCustomizationController.deleteById
)

module.exports = router;