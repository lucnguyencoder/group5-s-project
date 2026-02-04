const publicDataService = require('../services/publicDataService');
const { consola } = require('consola');

const publicDataController = {

    getFoods: async (req, res) => {
        try {
            const query = req.query;
            const result = await publicDataService.getFoods(query);

            return res.status(result.status).json({
                success: result.success,
                message: result.message || null,
                data: result.data || null,
                error: result.error || null
            });
        } catch (error) {
            consola.error('Get foods error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },
    getStoreList: async (req, res) => {
        try {
            const result = await publicDataService.getStoreList(req.query);

            return res.status(result.status).json({
                success: result.success,
                message: result.message || null,
                data: result.data || null,
                error: result.error || null
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: err.message
            });
        }
    },

    getStoreInfo: async (req, res) => {
        try {
            const storeId = req.params.storeId;
            const result = await publicDataService.getStoreInfo(storeId);

            return res.status(result.status).json({
                success: result.success,
                message: result.message || null,
                data: result.data || null,
                error: result.error || null
            });
        } catch (error) {
            consola.error('Get store info error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    getFoodById: async (req, res) => {
        try {
            const foodId = req.params.foodId;
            const result = await publicDataService.getFoodById(foodId);
            return res.status(result.status).json({
                success: result.success,
                message: result.message || null,
                data: result.data || null,
                error: result.error || null
            });
        } catch (error) {
            consola.error('Get food by ID error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    getCartItem: async (req, res) => {
        try {
            const cartItems = req.body;
            const result = await publicDataService.getCartItem(cartItems);

            return res.status(result.status).json({
                success: result.success,
                message: result.message || null,
                data: result.data || null,
                error: result.error || null
            });
        } catch (error) {
            consola.error('Get cart items error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    getStorePromotions: async (req, res) => {
        try {
            const storeId = req.params.storeId;
            const result = await publicDataService.getStorePromotions(storeId);

            return res.status(result.status).json({
                success: result.success,
                message: result.message || null,
                data: result.data || null
            });
        } catch (error) {
            consola.error('Get store promotions error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    getFeatureFood: async (req, res) => {
        try {
            const { storeId } = req.params
            const response = await publicDataService.getFeatureFood(storeId);
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
    }
};

module.exports = publicDataController;
