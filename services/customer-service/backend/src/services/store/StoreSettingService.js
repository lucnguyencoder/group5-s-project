//done
const { default: consola } = require('consola');
const {
    Store,
    StoreSettings
} = require('../../models');
const storeSettingService = {
    updateStoreSetting: async (storeId, storeData) => {
        try {
            const openingTime = storeData.opening_time.split(":");
            const closeTime = storeData.closing_time.split(":");
            if (openingTime[0] >= closeTime[0]) {
                return {
                    status: 400,
                    success: false,
                    message: "Opening time must be before closing time"
                }
            }
            const store = await Store.findByPk(storeId);
            if (!store) {
                return {
                    status: 404,
                    success: false,
                    message: 'Store is not exist'
                }
            }
            await store.update({ ...storeData, updated_at: new Date() });
            return {
                status: 200,
                success: true,
            }
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: "Internal Error"
            }
        }
    },

    getStoreConfig: async (store_id) => {
        try {
            const res = await StoreSettings.findOne({
                where: { store_id }
            });
            return res;
        } catch (error) {
            consola.error('Error fetching store config:', error);
            throw error;
        }
    },

    updateStoreConfig: async (store_id, configData) => {
        try {
            const storeSettings = await StoreSettings.findOne({ where: { store_id } });
            if (!storeSettings) {
                throw new Error('Store settings not found');
            }
            await storeSettings.update(configData);
            return {
                status: 200,
                success: true,
                message: 'Store settings updated successfully'
            };
        } catch (error) {
            throw error;
        }
    },



}

module.exports = storeSettingService;
