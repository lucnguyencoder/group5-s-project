const express = require('express');
const router = express.Router();
const { requirePermission } = require('../../../middleware/permission');
const { verifyToken } = require('../../../middleware/jwt');
const { User, StoreProfile, Store } = require('../../../models');
const { consola } = require('consola');


router.get('/me', verifyToken, requirePermission(), async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            include: [{
                model: StoreProfile,
                as: 'storeProfile',
                include: [{
                    model: Store,
                    as: 'store'
                }]
            }]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.storeProfile || !user.storeProfile.store) {
            return res.status(404).json({
                success: false,
                message: 'No store associated with this user'
            });
        }

        const storeData = {
            id: user.storeProfile.store.id,
            name: user.storeProfile.store.name,
            description: user.storeProfile.store.description,
            avatar_url: user.storeProfile.store.avatar_url,
            cover_image_url: user.storeProfile.store.cover_image_url,
            address: user.storeProfile.store.address,
            latitude: user.storeProfile.store.latitude,
            longitude: user.storeProfile.store.longitude,
            phone: user.storeProfile.store.phone,
            email: user.storeProfile.store.email,
            opening_time: user.storeProfile.store.opening_time,
            closing_time: user.storeProfile.store.closing_time,
            status: user.storeProfile.store.status,
            isActive: user.storeProfile.store.isActive,
            isTempClosed: user.storeProfile.store.isTempClosed,
            rating: user.storeProfile.store.rating,
            total_reviews: user.storeProfile.store.total_reviews,
            userRole: {
                store_id: user.storeProfile.store_id,
                username: user.storeProfile.username,
                full_name: user.storeProfile.full_name,
                phone: user.storeProfile.phone,
                is_available: user.storeProfile.is_available,
                is_courier_active: user.storeProfile.is_courier_active
            }
        };

        return res.status(200).json({
            success: true,
            message: 'Store information retrieved successfully',
            data: storeData
        });

    } catch (error) {
        consola.error('Error getting current store information:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while retrieving store information'
        });
    }
});

module.exports = router;
