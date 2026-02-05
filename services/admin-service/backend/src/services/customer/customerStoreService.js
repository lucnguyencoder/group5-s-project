//done
const { Store, UserFollowStore } = require("../../models");

const customerStoreService = {
    addFavoriteStore: async (storeId, userId) => {
        try {
            const check = await Store.findByPk(storeId);
            if (!check) {
                return {
                    status: 404,
                    success: false,
                    message: 'Store not found'
                }
            }
            const isSaved = await UserFollowStore.findOne({ where: { user_id: userId, store_id: storeId } });
            if (isSaved) {
                const removed = await UserFollowStore.destroy({ where: { user_id: userId, store_id: storeId } });
                if (removed) {
                    return {
                        status: 200,
                        success: true,
                        saved: false,
                    }
                }
                return {
                    status: 500,
                    success: false,
                    message: 'Remove Failed'
                }
            }
            const added = await UserFollowStore.create({ user_id: userId, store_id: storeId });
            if (added) {
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
                message: 'Server Error:' + error
            }
        }
    },

    isFollowing: async (storeId, userId) => {
        try {
            const check = await UserFollowStore.findOne({
                where: {
                    store_id: storeId,
                    user_id: userId
                }
            });
            if (check) {
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
                message: 'Error checking following status'
            }
        }
    },

    getAllFollowingStore: async (userId) => {
        try {
            const followingStores = await UserFollowStore.findAll({
                where: { user_id: userId },
                include: {
                    model: Store,
                    as: 'store',
                }
            });
            return {
                status: 200,
                success: true,
                data: followingStores
            }
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Error getting following stores'
            }
        }
    }
}

module.exports = customerStoreService;