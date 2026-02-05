//done
const { Store, Category, sequelize, Food } = require("../../models");
const storeFeatureItems = require("../../models/storeFeaturedItems");

const storeCustomizationService = {
    getData: async (storeId) => {
        try {
            const checkStore = await Store.findByPk(storeId);
            if (!checkStore) {
                return {
                    status: 404,
                    success: false,
                    message: 'Can not find your store'
                }
            }
            const data = await storeFeatureItems.findAll({
                where: { store_id: storeId },
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'category_name', 'description'],
                        include: {
                            model: Food,
                            as: 'foods',
                            attributes: ['food_id', 'food_name', 'base_price', 'image_url', 'sale_price', 'description'],
                        }
                    },
                    {
                        model: Store,
                        as: 'store',
                        attributes: ['id', 'name']
                    }
                ],
                order: [['position', 'ASC']]
            });
            return {
                status: 200,
                success: true,
                data: data
            }
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Server Error: ' + error
            }
        }
    },

    updateData: async (updateData) => {
        try {
            if (!updateData.store_id || !updateData.category_id || updateData.position === undefined) {
                return {
                    status: 400,
                    success: false,
                    message: 'Missing required data'
                };
            }
            const checkStore = await Store.findByPk(updateData.store_id);
            if (!checkStore) {
                return {
                    status: 404,
                    success: false,
                    message: 'Can not find your store'
                }
            }
            const checkCategory = await Category.findByPk(updateData.category_id);
            if (!checkCategory) {
                return {
                    status: 404,
                    success: false,
                    message: 'Can not find your category'
                }
            }
            await storeFeatureItems.update(
                { position: updateData.position },
                {
                    where: { store_id: updateData.store_id, category_id: updateData.category_id }
                });
            return {
                status: 200,
                success: true,
            }
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Server error while updating'
            }
        }
    },
    createData: async (data) => {
        try {
            if (!data.store_id || !data.category_id || data.position === undefined) {
                return {
                    status: 400,
                    success: false,
                    message: 'Missing required data'
                };
            }
            const checkStore = await Store.findByPk(data.store_id);
            if (!checkStore) {
                return {
                    status: 404,
                    success: false,
                    message: 'Can not find your store'
                }
            }
            const checkCategory = await Category.findByPk(data.category_id);
            if (!checkCategory) {
                return {
                    status: 404,
                    success: false,
                    message: 'Can not find your category'
                }
            }
            const created = await storeFeatureItems.create(data);
            if (created) {
                return {
                    status: 200,
                    success: true,
                }
            }
            return {
                status: 500,
                success: false,
                message: 'Unexpected Error'
            }
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Server error while creating data'
            }
        }
    },
    deleteById: async (customizationData) => {
        try {
            const { store_id, category_id } = customizationData;
            if (!store_id || !category_id) {
                return {
                    status: 400,
                    success: false,
                    message: 'Missing required data'
                };
            }
            const check = await storeFeatureItems.findOne({
                where: { store_id, category_id }
            });
            if (!check) {
                return {
                    status: 404,
                    success: false,
                    message: 'Customization not found'
                }
            }
            const data = await storeFeatureItems.findAll({ where: { store_id: store_id }, order: [['position', 'ASC']] });
            const idx = data.findIndex((d) => d.category_id === category_id && d.store_id === store_id);
            await check.destroy();
            for (let i = idx; i < data.length; i++) {
                await storeFeatureItems.update(
                    { position: i },
                    {
                        where: { store_id: data[i].store_id, category_id: data[i].category_id }
                    });
            }
            return {
                status: 200,
                success: true,
            };
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Server error while deleting'
            }
        }
    },

    deleteAll: async (storeId) => {
        try {
            const checkStore = await Store.findByPk(storeId);
            if (!checkStore) {
                return {
                    status: 404,
                    success: false,
                    message: 'Can not find your store'
                }
            }
            const checkIfStoreHasCustomization = await storeFeatureItems.findOne({ where: { store_id: storeId } });
            if (!checkIfStoreHasCustomization) {
                return {
                    status: 404,
                    success: false,
                    message: 'Store has no customization'
                }
            }
            await storeFeatureItems.destroy({ where: { store_id: storeId } });
            return {
                status: 200,
                success: true
            }
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Server error while deleting'
            }
        }
    }

}

module.exports = storeCustomizationService;