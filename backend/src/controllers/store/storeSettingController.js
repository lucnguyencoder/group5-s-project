//done
const storeSettingService = require('../../services/store/StoreSettingService');
const { getCurrentStore } = require('../../services/store/StoreAuthService');

const storeSettingController = {

    updateStoreSetting: async (req, res) => {
        try {
            const { storeId, storeData } = req.body;
            if (!storeId) {
                return res.status(400).json({
                    success: false,
                    message: 'Store ID is required'
                });
            }
            if (!storeData) {
                return res.status(400).json({
                    success: false,
                    message: 'Store data is required'
                });
            }
            const response = await storeSettingService.updateStoreSetting(storeId, storeData);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                    message: response?.message || 'Update successfully'
                })
            }
            return res.status(response.status).json({
                success: false,
                message: response?.message || 'An error has occurred'
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error'
            })
        }
    },

    getStoreConfig: async (req, res) => {
        try {
            const store = await getCurrentStore(req);
            if (store.success) {
                return res.status(store.status).json({
                    success: true,
                    message: 'Store config fetched successfully',
                    data: store.data
                });
            }
            return res.status(response.status).json({
                success: false,
                message: response.message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },
    updateStoreConfig: async (req, res) => {
        try {
            const store = await getCurrentStore(req);
            const store_id = store.data.store.id;
            const configData = req.body;
            const response = await storeSettingService.updateStoreConfig(store_id, configData);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                    message: 'Store config updated successfully'
                });
            }
            return res.status(response.status).json({
                success: false,
                message: response.message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
}

module.exports = storeSettingController;
