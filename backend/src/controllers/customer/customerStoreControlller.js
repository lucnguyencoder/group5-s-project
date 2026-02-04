//done
const customerStoreService = require("../../services/customer/customerStoreService");

const customerStoreController = {
    addFavoriteStore: async (req, res) => {
        try {
            const { id } = req.params;
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Store ID is required'
                });
            }
            const response = await customerStoreService.addFavoriteStore(id, userId);
            if (response.success) {
                return res.status(200).json({
                    success: true,
                    saved: response.saved
                })
            }
            return res.status(response.status).json({
                success: false,
                message: response.message
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal Error'
            })
        }
    },

    isFollowing: async (req, res) => {
        try {
            const { storeId, userId } = req.query;
            if (!storeId || !userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Error getting following status'
                });
            }
            const response = await customerStoreService.isFollowing(storeId, userId);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                    saved: response.saved
                })
            }
            return res.status(response.status).json({
                success: false,
                message: response?.message
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server Error'
            })
        }
    },

    getAllFollowingStores: async (req, res) => {
        try {
            const { userId } = req.query;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }
            const response = await customerStoreService.getAllFollowingStore(userId);
            // console.log('Response from service:', response);
            if (response.success) {
                return res.status(200).json({
                    success: true,
                    data: response.data
                })
            }
            return res.status(response.status).json({
                success: false,
                message: response.message
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server Error'
            })
        }
    }
}

module.exports = customerStoreController;