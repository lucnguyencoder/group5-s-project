//done
const { Food, UserSavedProduct, Store, UserFollowStore, storeFeatureItems, Category } = require("../../models");
const storeMetricService = require("../store/storeMetricService");

const customerFoodService = {
    addFavoriteFood: async (foodId, userId) => {
        try {
            const check = await Food.findByPk(foodId);
            if (!check) {
                return {
                    status: 404,
                    success: false,
                    message: 'Food not found'
                }
            }
            const isSaved = await UserSavedProduct.findOne({ where: { user_id: userId, food_id: foodId } });
            if (isSaved) {
                const removed = await UserSavedProduct.destroy({ where: { user_id: userId, food_id: foodId } });
                if (removed) {
                    await storeMetricService.updateMetricService({ foodId, updateType: 'favorite' });
                    return {
                        status: 200,
                        success: true,
                        saved: false,
                    }
                }
                return {
                    status: 500,
                    success: false,
                    message: 'Unsave Failed'
                }
            }
            const added = await UserSavedProduct.create({ user_id: userId, food_id: foodId });
            if (added) {
                await storeMetricService.updateMetricService({ foodId, updateType: 'favorite' });
                return {
                    status: 200,
                    success: true,
                    saved: true
                }
            }
            return {
                status: 500,
                success: false,
                message: 'Save Failed'
            }
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Add Favorite Food Error'
            }
        }
    },

    isSaved: async (foodId, userId) => {
        try {
            const saved = await UserSavedProduct.findOne({
                where: {
                    food_id: foodId,
                    user_id: userId
                }
            })
            if (saved) {
                return {
                    status: 200,
                    success: true,
                    saved: true
                }
            }
            return {
                status: 200,
                success: true,
                saved: false
            }
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Get food saved status error'
            }
        }
    },

    getAllSavedFood: async (userId) => {
        try {
            const getFood = await UserSavedProduct.findAll({
                where: { user_id: userId },
                include: {
                    model: Food,
                    as: 'food',
                    include: [
                        {
                            model: Store,
                            as: 'store',
                            attributes: ['store_name', 'rating']
                        }
                    ]
                }
            })
            return {
                status: 200,
                success: true,
                data: getFood
            }
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Get all saved food error'
            }
        }
    },



}

module.exports = customerFoodService;