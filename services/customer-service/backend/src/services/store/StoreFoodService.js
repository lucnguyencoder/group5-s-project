const Food = require('../../models/food');
const CustomizationGroup = require('../../models/customizationGroup');
const CustomizationOption = require('../../models/customizationOption');
const { sequelize } = require('../../config/db');
const { consola } = require('consola');
const { uploadFile, deleteFile } = require('../../utils/fileUpload');
const { Op } = require('sequelize');


try {
    Food.hasMany(CustomizationGroup, {
        foreignKey: 'food_id',
        as: 'foodGroups'
    });

    CustomizationGroup.belongsTo(Food, {
        foreignKey: 'food_id',
        as: 'food'
    });

    CustomizationGroup.hasMany(CustomizationOption, {
        foreignKey: 'group_id',
        as: 'groupOptions'
    });

    CustomizationOption.belongsTo(CustomizationGroup, {
        foreignKey: 'group_id',
        as: 'group'
    });

    consola.debug('Associations set up successfully');
} catch (error) {
    consola.warn('Association setup warning:', error.message);
}


// consola.debug('Food model:', typeof Food);
// consola.debug('CustomizationGroup model:', typeof CustomizationGroup);
// consola.debug('CustomizationOption model:', typeof CustomizationOption);

const foodService = {
    createFood: async (storeId, foodData, foodImage = null) => {
        const transaction = await sequelize.transaction();

        try {

            let imageUrl = null;
            if (foodImage) {
                const uploadResult = await uploadFile(
                    foodImage,
                    'images',
                    `store-${storeId}`
                );

                if (!uploadResult.success) {
                    throw new Error('Failed to upload food image');
                }

                imageUrl = uploadResult.publicUrl;
            }


            const food = await Food.create({
                store_id: storeId,
                category_id: foodData.category_id || 1,
                food_name: foodData.food_name,
                description: foodData.description || '',
                base_price: foodData.base_price,
                is_on_sale: foodData.is_on_sale || false,
                sale_price: foodData.sale_price || null,
                image_url: imageUrl,
                is_available: foodData.is_available !== undefined ? foodData.is_available : true,
                preparation_time: foodData.preparation_time || 10,
                max_allowed_quantity: foodData.max_allowed_quantity || 10,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction });


            if (foodData.customization_groups && foodData.customization_groups.length > 0) {
                for (const groupData of foodData.customization_groups) {
                    const group = await CustomizationGroup.create({
                        food_id: food.food_id,
                        group_name: groupData.name,
                        description: groupData.description || '',
                        is_required: groupData.required || false,
                        min_selections: groupData.minOptions || 0,
                        max_selections: groupData.maxOptions || null,
                        sort_order: groupData.sort_order || 0,
                        created_at: new Date()
                    }, { transaction });


                    if (groupData.options && groupData.options.length > 0) {
                        for (const optionData of groupData.options) {
                            await CustomizationOption.create({
                                group_id: group.group_id,
                                option_name: optionData.name,
                                description: optionData.description || '',
                                additional_price: optionData.price || 0,
                                is_default: optionData.isDefault || false,
                                sort_order: optionData.sort_order || 0,
                                created_at: new Date()
                            }, { transaction });
                        }
                    }
                }
            }

            await transaction.commit();


            const createdFood = await foodService.getFoodById(food.food_id);

            return {
                success: true,
                status: 201,
                message: 'Food item created successfully',
                data: createdFood.data
            };

        } catch (error) {
            await transaction.rollback();
            consola.error('Create food error:', error);
            return {
                success: false,
                status: 500,
                message: 'Failed to create food item',
                error: error.message
            };
        }
    },

    getFoodById: async (foodId) => {
        try {

            let food;
            try {
                food = await Food.findByPk(foodId, {
                    include: [
                        {
                            model: CustomizationGroup,
                            as: 'foodGroups',
                            include: [
                                {
                                    model: CustomizationOption,
                                    as: 'groupOptions',
                                    order: [['sort_order', 'ASC']]
                                }
                            ],
                            order: [['sort_order', 'ASC']]
                        }
                    ]
                });
            } catch (associationError) {
                consola.warn('Association query failed, trying fallback:', associationError.message);


                food = await Food.findByPk(foodId);

                if (food) {

                    const groups = await CustomizationGroup.findAll({
                        where: { food_id: foodId },
                        order: [['sort_order', 'ASC']]
                    });


                    for (const group of groups) {
                        const options = await CustomizationOption.findAll({
                            where: { group_id: group.group_id },
                            order: [['sort_order', 'ASC']]
                        });
                        group.dataValues.options = options;
                    }


                    food.dataValues.customizationGroups = groups;
                }
            }

            if (!food) {
                return {
                    success: false,
                    status: 404,
                    message: 'Food item not found'
                };
            }

            return {
                success: true,
                status: 200,
                data: food
            };

        } catch (error) {
            consola.error('Get food error:', error);
            return {
                success: false,
                status: 500,
                message: 'Failed to get food item',
                error: error.message
            };
        }
    },


    getFoodsByStore: async (storeId, query = {}) => {
        try {
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const offset = (page - 1) * limit;

            const whereClause = { store_id: storeId };


            if (query.category_id) {
                whereClause.category_id = query.category_id;
            }

            if (query.onSale === 'true') {
                whereClause.is_on_sale = true;
            }
            if (query.onSale === 'false') {
                whereClause.is_on_sale = false;
            }
            if (query.status === 'available') {
                whereClause.is_available = true;
            }
            if (query.status === 'unavailable') {
                whereClause.is_available = false;
            }


            if (query.name) {
                whereClause.food_name = {
                    [Op.like]: `%${query.name}%`
                };
            }
            const { count, rows } = await Food.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                order: [
                    ['food_id', 'ASC']
                ]
            });
            return {
                success: true,
                status: 200,
                data: {
                    total: count,
                    pages: Math.ceil(count / limit),
                    current_page: page,
                    per_page: limit,
                    foods: rows
                }
            };

        } catch (error) {
            consola.error('Get foods error:', error);
            return {
                success: false,
                status: 500,
                message: 'Failed to get food items',
                error: error.message
            };
        }
    },

    updateFood: async (foodId, foodData, foodImage = null) => {
        const transaction = await sequelize.transaction();

        try {
            const food = await Food.findByPk(foodId);
            if (!food) {
                await transaction.rollback();
                return {
                    success: false,
                    status: 404,
                    message: 'Food item not found'
                };
            }
            let imageUrl = food.image_url;
            // Only upload if there's a new file, ignore blob URLs from frontend
            if (foodImage && foodImage.buffer && foodImage.mimetype) {
                try {
                    const uploadResult = await uploadFile(
                        foodImage,
                        'images',
                        `store-${food.store_id}`
                    );

                    if (uploadResult.success) {
                        imageUrl = uploadResult.publicUrl;
                    } else {
                        consola.warn('Image upload failed, keeping existing image:', uploadResult.error);
                    }
                } catch (error) {
                    consola.warn('Image upload error, keeping existing image:', error.message);
                }
            }
            // If foodData.image_url is a blob URL or localhost, keep existing image
            // Otherwise update with new URL
            else if (foodData.image_url && 
                     !foodData.image_url.startsWith('blob:') && 
                     !foodData.image_url.startsWith('http://localhost') &&
                     foodData.image_url.startsWith('http')) {
                imageUrl = foodData.image_url;
            }


            await food.update({
                category_id: foodData.category_id || food.category_id,
                food_name: foodData.food_name || food.food_name,
                description: foodData.description !== undefined ? foodData.description : food.description,
                base_price: foodData.base_price || food.base_price,
                is_on_sale: foodData.is_on_sale !== undefined ? foodData.is_on_sale : food.is_on_sale,
                sale_price: foodData.sale_price !== undefined ? foodData.sale_price : food.sale_price,
                image_url: imageUrl,
                is_available: foodData.is_available !== undefined ? foodData.is_available : food.is_available,
                preparation_time: foodData.preparation_time || food.preparation_time,
                max_allowed_quantity: foodData.max_allowed_quantity || food.max_allowed_quantity,
                updated_at: new Date()
            }, { transaction });


            if (foodData.customization_groups !== undefined) {

                const existingGroups = await CustomizationGroup.findAll({
                    where: { food_id: foodId }
                });

                for (const group of existingGroups) {
                    await CustomizationOption.destroy({
                        where: { group_id: group.group_id },
                        transaction
                    });
                }

                await CustomizationGroup.destroy({
                    where: { food_id: foodId },
                    transaction
                });


                if (Array.isArray(foodData.customization_groups) && foodData.customization_groups.length > 0) {
                    for (const groupData of foodData.customization_groups) {

                        if (!groupData.name || groupData.name.trim() === '') {
                            throw new Error('Customization group name is required');
                        }

                        consola.debug('Creating customization group:', {
                            name: groupData.name,
                            description: groupData.description,
                            required: groupData.required
                        });

                        const group = await CustomizationGroup.create({
                            food_id: foodId,
                            group_name: groupData.name.trim(),
                            description: groupData.description || '',
                            is_required: groupData.required || false,
                            min_selections: groupData.minOptions || 0,
                            max_selections: groupData.maxOptions || null,
                            sort_order: groupData.sort_order || 0,
                            created_at: new Date()
                        }, { transaction });


                        if (groupData.options && Array.isArray(groupData.options) && groupData.options.length > 0) {
                            for (const optionData of groupData.options) {

                                if (!optionData.name || optionData.name.trim() === '') {
                                    throw new Error('Customization option name is required');
                                }

                                await CustomizationOption.create({
                                    group_id: group.group_id,
                                    option_name: optionData.name.trim(),
                                    description: optionData.description || '',
                                    additional_price: optionData.price || 0,
                                    is_default: optionData.isDefault || false,
                                    sort_order: optionData.sort_order || 0,
                                    created_at: new Date()
                                }, { transaction });
                            }
                        }
                    }
                }
            }

            await transaction.commit();


            const updatedFood = await foodService.getFoodById(foodId);

            return {
                success: true,
                status: 200,
                message: 'Food item updated successfully',
                data: updatedFood.data
            };

        } catch (error) {
            await transaction.rollback();
            consola.error('Update food error:', error);
            return {
                success: false,
                status: 500,
                message: 'Failed to update food item',
                error: error.message
            };
        }
    },


    // REMOVED SOON!!!
    deleteFood: async (foodId) => {
        const transaction = await sequelize.transaction();

        try {

            const food = await Food.findByPk(foodId);
            if (!food) {
                await transaction.rollback();
                return {
                    success: false,
                    status: 404,
                    message: 'Food item not found'
                };
            }


            const groups = await CustomizationGroup.findAll({
                where: { food_id: foodId }
            });

            for (const group of groups) {
                await CustomizationOption.destroy({
                    where: { group_id: group.group_id },
                    transaction
                });
            }


            await CustomizationGroup.destroy({
                where: { food_id: foodId },
                transaction
            });


            await food.destroy({ transaction });


            if (food.image_url) {

                const urlParts = food.image_url.split('/');
                const fileName = urlParts[urlParts.length - 1];
                const filePath = `store-${food.store_id}/${fileName}`;

                await deleteFile(filePath, 'food-images');
            }

            await transaction.commit();

            return {
                success: true,
                status: 200,
                message: 'Food item deleted successfully'
            };

        } catch (error) {
            await transaction.rollback();
            consola.error('Delete food error:', error);
            return {
                success: false,
                status: 500,
                message: 'Failed to delete food item',
                error: error.message
            };
        }
    },

    getFoodsByStoreNoFilter: async (storeId) => {
        try {
            const response = await Food.findAll({ where: { store_id: storeId } });
            if (response) {
                return {
                    status: 200,
                    success: true,
                    foods: response
                }
            }
            return {
                status: 404,
                success: false,
                message: 'No food found for this store'
            }
        }
        catch (error) {
            console.error('Error fetching foods by store:', error);
            return {
                status: 500,
                success: false,
                message: 'Error fetching foods',
                error: error.message
            }
        }
    }

};

module.exports = foodService;
