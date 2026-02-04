//done
const express = require('express');
const router = express.Router();
const multer = require('multer');
const foodController = require('../../../controllers/store/StoreFoodController');
const { requirePermission } = require('../../../middleware/permission');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'), false);
        }
    }
});

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


router.get('/',
    requirePermission('/api/store/foods', 'GET'),
    foodController.getFoodsByStore
);

router.get('/forCategory/:userId',
    foodController.getFoodsByStore
);

router.post('/',
    requirePermission('/api/store/foods', 'POST'),
    upload.single('food_image'),
    handleMulterError,
    foodController.createFood
);

router.get('/:foodId',
    requirePermission('/api/store/foods/:foodId', 'GET'),
    foodController.getFoodById
);

router.put('/:foodId',
    requirePermission('/api/store/foods/:foodId', 'PUT'),
    upload.single('food_image'),
    handleMulterError,
    foodController.updateFood
);

router.delete('/:foodId',
    requirePermission('/api/store/foods/:foodId', 'DELETE'),
    foodController.deleteFood
);

module.exports = router;
