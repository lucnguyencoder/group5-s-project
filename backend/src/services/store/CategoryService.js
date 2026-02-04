const { Store, Category, Food, categoryFood, sequelize } = require('../../models');
const { Op } = require('sequelize');

const CategoryService = {
    createNewCategory: async (data) => {
        const t = await sequelize.transaction();
        try {

            const { categoryData, foodData } = data;
            if (!categoryData || !foodData) {
                return {
                    status: 400,
                    success: false,
                    message: 'Missing category data or food data'
                };
            }
            const checkName = await Category.findOne(
                {
                    where: { category_name: categoryData.category_name }
                });
            if (checkName) {
                return {
                    status: 409,
                    success: false,
                    message: 'Category name already existed'
                }
            }
            const createCategory = await Category.create(categoryData, { transaction: t });
            let createCateFood;
            foodData.category_id = createCategory.id;
            if (foodData.food_id.length > 0) {
                for (let i = 0; i < foodData.food_id.length; i++) {
                    createCateFood = await categoryFood.create({ category_id: foodData.category_id, food_id: foodData.food_id[i] }, { transaction: t });
                }
            }
            await t.commit();
            if (createCategory) {
                return {
                    status: 200,
                    success: true,
                    message: 'Create new category successfully',
                    categoryId: createCategory.id
                }
            }
            return {
                status: 500,
                success: false,
                message: 'Unknown error'
            }
        }
        catch (error) {
            await t.rollback();
            return {
                status: 500,
                success: false,
                message: 'Error creating category',
                error: error.message
            }
        }
    },

    getAllCategories: async (storeId, filters, itemPerPage, page) => {
        try {
            const categoryFilters = {};
            const offset = (page - 1) * itemPerPage;

            if (filters) {
                categoryFilters.category_name = {
                    [Op.like]: `%${filters}%`
                };
            }
            const totalCount = await Category.count({
                where: {
                    store_id: storeId,
                    ...categoryFilters
                }
            });
            const categories = await Category.findAll({
                where: {
                    store_id: storeId,
                    ...categoryFilters
                },
                include: [
                    {
                        model: Food,
                        as: 'foods',
                        through: { attributes: [] } // Exclude the join table attributes
                    }
                ],
                offset: offset,
                limit: itemPerPage
            });
            return {
                status: 200,
                success: true,
                categories: categories,
                currentPage: page,
                totalPage: Math.ceil(totalCount / itemPerPage),
                itemPerPage: itemPerPage,
                totalCount: totalCount,
                message: 'Categories fetched successfully'
            };
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Error fetching categories',
                error: error.message,
                totalCount: 0
            };
        }
    },

    getCategoryById: async (id) => {
        try {
            const category = await Category.findByPk(id, {
                include: [
                    {
                        model: Food,
                        as: 'foods',
                        through: { attributes: [] }
                    }
                ]
            });
            if (!category) {
                return {
                    status: 404,
                    success: false,
                    message: 'Category not found'
                };
            }
            return {
                status: 200,
                success: true,
                category: category
            };
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Error fetching category by ID',
                error: error.message
            };
        }
    },

    updateCategory: async (id, updateData) => {
        const t = await sequelize.transaction();
        try {
            const { categoryData } = updateData;
            const checkCategoryId = await Category.findByPk(id);
            if (!checkCategoryId) {
                return {
                    status: 404,
                    success: false,
                    message: 'Category ID not found'
                }
            }
            await Category.update(categoryData, { where: { id } }, { transaction: t });
            await t.commit();
            return {
                status: 200,
                success: true,
                message: 'Update Category Successfully'
            }
        }
        catch (error) {
            await t.rollback();
            return {
                status: 500,
                success: false,
                message: 'Error updating category',
                error: error.message
            };
        }
    },

    addCategoryFood: async (category_id, food_id) => {
        try {
            await categoryFood.create({
                category_id: category_id,
                food_id: food_id
            });
            return {
                status: 200,
                success: true,
                message: 'Food added to category successfully'
            };
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Error adding food to category',
                error: error.message
            };
        }
    },

    removeCategoryFood: async (category_id, food_id) => {
        try {
            const deletedRows = await categoryFood.destroy({
                where: {
                    category_id: category_id,
                    food_id: food_id
                }
            });
            if (deletedRows > 0) {
                return {
                    status: 200,
                    success: true,
                    message: 'Food removed from category successfully'
                };
            } else {
                return {
                    status: 404,
                    success: false,
                    message: 'Food not found in category'
                };
            }
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Error removing food from category',
                error: error.message
            };
        }
    },

    deleteCategory: async (id) => {
        const t = await sequelize.transaction();
        try {
            const checkCategoryId = await Category.findByPk(id);
            if (!checkCategoryId) {
                return {
                    status: 404,
                    success: false,
                    message: 'Category ID not found'
                }
            }
            const deleteCategoryFood = await categoryFood.destroy({ where: { category_id: id } }, { transaction: t });
            if (deleteCategoryFood < 0) {
                return {
                    status: 500,
                    success: false,
                    message: 'Delete Category Food Failed'
                }
            }
            const deleteCategory = await Category.destroy({ where: { id } }, { transaction: t });
            if (deleteCategory <= 0) {
                return {
                    status: 500,
                    success: false,
                    message: 'Delete Category Failed'
                }
            }
            await t.commit();
            return {
                status: 200,
                success: true,
                message: 'Delete Category Successfully'
            }
        }
        catch (error) {
            await t.rollback();
            return {
                status: 500,
                success: false,
                message: 'Error deleting category',
                error: error.message
            };
        }
    }
}

module.exports = CategoryService;