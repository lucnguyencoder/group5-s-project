//done
const CategoryService = require('../../services/store/CategoryService')

const categoryController = {
    createCategory: async (req, res) => {
        try {
            const { data } = req.body;
            const response = await CategoryService.createNewCategory(data);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                    message: response.message
                })
            }
            return res.status(response.status).json({
                success: response.success,
                message: response.message
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error during create category'
            });
        }
    },

    getAllCategories: async (req, res) => {
        try {
            const filters = req.query.category_name;
            const page = parseInt(req.query.page);
            const itemPerPage = parseInt(req.query.itemPerPage);
            const storeId = req.query.storeId;
            if (!storeId) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing store ID'
                });
            }
            const response = await CategoryService.getAllCategories(storeId, filters, itemPerPage, page);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                    categories: response.categories,
                    currentPage: response.currentPage,
                    totalPage: response.totalPage,
                    totalCount: response.totalCount,
                    itemPerPage: response.itemPerPage,
                    message: 'Categories fetched successfully'
                });
            }
            return res.status(response.status).json({
                success: response.success,
                message: response.message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error during fetching categories'
            });
        }
    },

    getCategoryById: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing category ID'
                });
            }
            const response = await CategoryService.getCategoryById(id);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                    category: response.category
                });
            }
            return res.status(response.status).json({
                success: response.success,
                message: response.message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error during fetching category by ID'
            });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body.updateData;
            if (!id || !updateData) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing category ID or update data'
                });
            }
            const response = await CategoryService.updateCategory(id, updateData);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                    message: 'Category updated successfully'
                });
            }
            return res.status(response.status).json({
                success: response.success,
                message: response.message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error during updating category'
            });
        }
    },

    removeCategoryFood: async (req, res) => {
        try {
            const { id } = req.params;
            const food_id = req.body.food_id;
            if (!id || !food_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing category ID or food ID'
                });
            }
            const response = await CategoryService.removeCategoryFood(id, food_id);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                    message: 'Category food removed successfully'
                });
            }
            return res.status(response.status).json({
                success: response.success,
                message: response.message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error during removing category food'
            });
        }
    },

    addCategoryFood: async (req, res) => {
        try {
            const { id } = req.params;
            const food_id = req.body.food_id;
            if (!id || !food_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing category ID or food ID'
                });
            }
            const response = await CategoryService.addCategoryFood(id, food_id);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                    message: 'Category food added successfully'
                });
            }
            return res.status(response.status).json({
                success: response.success,
                message: response.message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error during adding category food'
            });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing category ID'
                });
            }
            const response = await CategoryService.deleteCategory(id);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                    message: 'Category deleted successfully'
                });
            }
            return res.status(response.status).json({
                success: response.success,
                message: response.message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error during deleting category'
            });
        }
    }
}

module.exports = categoryController;