//done
const storeCustomizationService = require("../../services/store/storeCustomizationService");

const storeCustomizationController = {
    getData: async (req, res) => {
        try {
            const storeId = req.params.storeId;
            if (!storeId) {
                return res.status(400).json({
                    success: false,
                    message: 'Store ID is required'
                });
            }
            const response = await storeCustomizationService.getData(storeId);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                    data: response.data || null
                });
            }
            return res.status(response.status).json({
                success: false,
                message: response.message || 'Unexpected Error'
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error while getting data'
            });
        }
    },

    updateData: async (req, res) => {
        try {
            const updateData = req.body.updateData;
            const response = await storeCustomizationService.updateData(updateData);
            if (response.success) {
                return res.status(response.status).json({
                    success: true
                });
            }
            return res.status(response.status).json({
                success: false,
                message: response.message || 'Unexpected Error'
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error while updating'
            });
        }
    },
    createData: async (req, res) => {
        try {
            const data = req.body.customizationData;
            const response = await storeCustomizationService.createData(data);
            if (response.success) {
                return res.status(response.status).json({
                    success: true
                });
            }
            return res.status(response.status).json({
                success: false,
                message: response.message || 'Unexpected Error'
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error while creating data'
            });
        }
    },
    deleteById: async (req, res) => {
        try {
            const customizationData = req.body;
            const response = await storeCustomizationService.deleteById(customizationData);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                });
            }
            return res.status(response.status).json({
                success: false,
                message: response.message || 'Unexpected Error'
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error while deleting'
            });
        }
    },
    deleteAll: async (req, res) => {
        try {
            const storeId = req.params.storeId;
            if (!storeId) {
                return {
                    status: 400,
                    success: false,
                    message: 'Missing required data'
                };
            }
            const response = await storeCustomizationService.deleteAll(storeId);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                });
            }
            return res.status(response.status).json({
                success: false,
                message: response.message || 'Unexpected Error'
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error while deleting'
            });
        }
    }
}

module.exports = storeCustomizationController;