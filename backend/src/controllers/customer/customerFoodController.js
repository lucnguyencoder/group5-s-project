//done
const customerFoodService = require('../../services/customer/customerFoodService');
const customerFoodController = {
    addFavoriteFood: async (req, res) => {
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
                    message: 'Food ID is required'
                });
            }
            const response = await customerFoodService.addFavoriteFood(id, userId);
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
                message: "Server Error"
            })
        }
    },

    isSave: async (req, res) => {
        try {
            const { foodId, userId } = req.query;
            if (!foodId || !userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Error getting saved status'
                });
            }
            const response = await customerFoodService.isSaved(foodId, userId);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                    saved: response.saved
                })
            }
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server Error"
            })
        }
    },

    getAllSavedFoods: async (req, res) => {
        try {
            const { userId } = req.query;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }
            const response = await customerFoodService.getAllSavedFood(userId);
            if (response.success) {
                return res.status(200).json({
                    success: true,
                    data: response.data
                });
            }
            return res.status(response.status).json({
                success: false,
                message: response.message
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server Error"
            });
        }
    },



}

module.exports = customerFoodController