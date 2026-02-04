const foodService = require('../../services/store/StoreFoodService');
const { User, StoreProfile } = require('../../models');
const { consola } = require('consola');

const foodController = {
    /**
     * Create a new food item
     */
    createFood: async (req, res) => {
        try {
            const userId = req.user.id;

            const user = await User.findByPk(userId, {
                include: [{
                    model: StoreProfile,
                    as: 'storeProfile',
                }]
            });

            if (!user || !user.storeProfile || !user.storeProfile.store_id) {
                return res.status(403).json({
                    success: false,
                    message: 'No store associated with this account'
                });
            }

            const storeId = user.storeProfile.store_id;
            const foodData = req.body;
            const foodImage = req.file;

            if (foodData.customization_groups && typeof foodData.customization_groups === 'string') {
                try {
                    foodData.customization_groups = JSON.parse(foodData.customization_groups);
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid customization groups format. Must be valid JSON.'
                    });
                }
            }

            if (foodData.customization_groups && Array.isArray(foodData.customization_groups)) {
                for (const group of foodData.customization_groups) {
                    if (!group.name) {
                        return res.status(400).json({
                            success: false,
                            message: 'Each customization group must have a name'
                        });
                    }
                }
            }

            consola.debug('Processed food data:', {
                ...foodData,
                customization_groups: foodData.customization_groups ?
                    foodData.customization_groups.map(g => ({ name: g.name })) : []
            });

            const result = await foodService.createFood(storeId, foodData, foodImage);

            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                data: result.data || null,
                error: result.error || null
            });
        } catch (error) {
            consola.error('Create food controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    /**
     * Get food by ID
     */
    getFoodById: async (req, res) => {
        try {
            const foodId = req.params.foodId;

            const result = await foodService.getFoodById(foodId);

            return res.status(result.status).json({
                success: result.success,
                message: result.message || null,
                data: result.data || null,
                error: result.error || null
            });
        } catch (error) {
            consola.error('Get food controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    /**
     * Get all foods for a store
     */
    getFoodsByStore: async (req, res) => {
        try {

            const userId = req.user.id;
            const userParams = req.params.userId;
            if (userParams) {
                const user = await User.findByPk(userParams, {
                    include: [{
                        model: StoreProfile,
                        as: 'storeProfile',
                    }]
                });

                if (!user || !user.storeProfile || !user.storeProfile.store_id) {
                    return res.status(403).json({
                        success: false,
                        message: 'No store associated with this account'
                    });
                }
                const storeId = user.storeProfile.store_id;
                const result = await foodService.getFoodsByStoreNoFilter(storeId);
                return res.status(result.status).json({
                    success: result.success,
                    message: result.message || null,
                    foods: result.foods || null,
                    error: result.error || null
                });
            }
            const user = await User.findByPk(userId, {
                include: [{
                    model: StoreProfile,
                    as: 'storeProfile',
                }]
            });

            if (!user || !user.storeProfile || !user.storeProfile.store_id) {
                return res.status(403).json({
                    success: false,
                    message: 'No store associated with this account'
                });
            }
            const storeId = user.storeProfile.store_id;
            const query = req.query;
            const result = await foodService.getFoodsByStore(storeId, query);
            return res.status(result.status).json({
                success: result.success,
                message: result.message || null,
                data: result.data || null,
                error: result.error || null
            });
        } catch (error) {
            consola.error('Get foods controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    /**
     * Update a food item
     */
    updateFood: async (req, res) => {
        try {
            const userId = req.user.id;


            const user = await User.findByPk(userId, {
                include: [{
                    model: StoreProfile,
                    as: 'storeProfile',
                }]
            });

            if (!user || !user.storeProfile || !user.storeProfile.store_id) {
                return res.status(403).json({
                    success: false,
                    message: 'No store associated with this account'
                });
            }

            const storeId = user.storeProfile.store_id;
            const foodId = req.params.foodId;
            const foodData = req.body;
            const foodImage = req.file;

            if (foodData.sale_price === '') {
                foodData.sale_price = null;
            }
            if (foodData.customization_groups && typeof foodData.customization_groups === 'string') {
                try {
                    foodData.customization_groups = JSON.parse(foodData.customization_groups);
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid customization groups format. Must be valid JSON.'
                    });
                }
            }


            if (foodData.customization_groups && Array.isArray(foodData.customization_groups)) {
                for (const group of foodData.customization_groups) {
                    if (!group.name) {
                        return res.status(400).json({
                            success: false,
                            message: 'Each customization group must have a name'
                        });
                    }
                }
            }


            const foodDetails = await foodService.getFoodById(foodId);
            if (!foodDetails.success) {
                return res.status(foodDetails.status).json({
                    success: false,
                    message: foodDetails.message
                });
            }

            if (foodDetails.data.store_id !== storeId) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to update this food item'
                });
            }

            consola.debug('Update food data:', {
                ...foodData,
                customization_groups: foodData.customization_groups ?
                    foodData.customization_groups.map(g => ({ name: g.name })) : 'not provided'
            });
            console.log(foodData)
            const result = await foodService.updateFood(foodId, foodData, foodImage);

            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                data: result.data || null,
                error: result.error || null
            });
        } catch (error) {
            consola.error('Update food controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    /**
     * Delete a food item
     */
    deleteFood: async (req, res) => {
        try {
            const userId = req.user.id;


            const user = await User.findByPk(userId, {
                include: [{
                    model: StoreProfile,
                    as: 'storeProfile',
                }]
            });

            if (!user || !user.storeProfile || !user.storeProfile.store_id) {
                return res.status(403).json({
                    success: false,
                    message: 'No store associated with this account'
                });
            }

            const storeId = user.storeProfile.store_id;
            const foodId = req.params.foodId;


            const foodDetails = await foodService.getFoodById(foodId);
            if (!foodDetails.success) {
                return res.status(foodDetails.status).json({
                    success: false,
                    message: foodDetails.message
                });
            }

            if (foodDetails.data.store_id !== storeId) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to delete this food item'
                });
            }

            const result = await foodService.deleteFood(foodId);

            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                error: result.error || null
            });
        } catch (error) {
            consola.error('Delete food controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};

module.exports = foodController;
