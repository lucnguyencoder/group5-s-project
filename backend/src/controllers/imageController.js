const imageService = require('../services/common/imageService');
const { consola } = require('consola');

const imageController = {

    uploadAvatar: async (req, res) => {
        try {
            const userId = req.user.id;
            const file = req.file;
            const result = await imageService.uploadAvatar(userId, file);
            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                data: result.data || null,
                error: result.error || null
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },


    removeAvatar: async (req, res) => {
        try {
            const userId = req.user.id;
            const result = await imageService.removeAvatar(userId);
            return res.status(result.status).json({
                success: result.success,
                message: result.message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },


    getAvatar: async (req, res) => {
        try {
            const userId = req.user.id;
            const result = await imageService.getAvatar(userId);
            return res.status(result.status).json({
                success: result.success,
                message: result.message || null,
                data: result.data || null
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    uploadStoreAvatar: async (req, res) => {
        try {
            const storeId = req.body.StoreId;
            const file = req.file;
            const result = await imageService.uploadStoreAvatar(storeId, file);
            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                data: result.data || null,
                error: result.error || null
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    uploadStoreCover: async (req, res) => {
        try {
            const storeId = req.body.StoreId;
            const file = req.file;
            const result = await imageService.uploadStoreCover(storeId, file);
            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                data: result.data || null,
                error: result.error || null
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};

module.exports = imageController;
