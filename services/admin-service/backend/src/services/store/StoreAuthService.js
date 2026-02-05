const {
    User,
    UserGroup,
    StoreProfile,
    Store,
    StoreSettings
} = require('../../models');
const { generateToken } = require('../../middleware/jwt');
const { consola } = require('consola');
const userService = require('../userService');

const storeAuthService = {
    login: async (email, password) => {
        return await userService.login(email, password, 'store');
    },

    //COMMON FUNCTIONS
    getCurrentStore: async (req) => {
        const userId = req.user.id;
        // console.log("UID", userId);
        try {
            let storeProfile = await StoreProfile.findOne({
                where: { user_id: userId },
                include: [
                    {
                        model: Store,
                        as: 'store'
                    }
                ]
            });

            let staffInfo = await User.findOne({
                where: { id: userId },
                attributes: ['email', 'is_active'],
                include: [
                    {
                        model: UserGroup,
                        as: 'group',
                        attributes: ['name']
                    }
                ]
            });

            if (!storeProfile) {
                return {
                    status: 404,
                    success: false,
                    message: 'Store not found'
                };
            }

            // remove storeProfile.store
            delete storeProfile.toJSON().store;

            const storeId = storeProfile.store_id;

            let storeSettings = await StoreSettings.findOne({ where: { store_id: storeId } });
            if (!storeSettings) {
                storeSettings = await StoreSettings.create({ store_id: storeId });
                console.log("Default StoreSettings created:", storeSettings);
            }

            return {
                status: 200,
                success: true,
                data: {
                    store: storeProfile.store,
                    storeProfile: storeProfile,
                    storeSettings: storeSettings,
                    staffInfo
                }
            };
        } catch (error) {
            consola.error('Error fetching current store:', error);
            return {
                status: 500,
                success: false,
                message: 'Internal server error'
            };
        }
    }
};

module.exports = storeAuthService;
