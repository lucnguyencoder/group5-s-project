const express = require('express');
const router = express.Router();
const multer = require('multer');
const imageController = require('../../controllers/imageController');
const imageService = require('../../services/common/imageService');
const { verifyToken } = require('../../middleware/jwt');

const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB.'
            });
        }
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

router.post('/avatar/upload',
    verifyToken,
    imageService.uploadMiddleware,
    handleMulterError,
    imageController.uploadAvatar
);

router.delete('/avatar',
    verifyToken,
    imageController.removeAvatar
);

router.get('/avatar',
    verifyToken,
    imageController.getAvatar
);

router.post("/store/avatar/upload",
    verifyToken,
    // requirePermission("/api/store/avatar/upload", "POST"),
    imageService.uploadMiddleware,
    handleMulterError,
    imageController.uploadStoreAvatar
);

router.post("/store/cover/upload",
    verifyToken,
    // requirePermission("/api/store/cover/upload", "POST"),
    imageService.uploadMiddleware,
    handleMulterError,
    imageController.uploadStoreCover
);

module.exports = router;
