//done
const express = require('express');
const router = express.Router();
const categoryController = require('../../../controllers/store/categoryController');
const { requirePermission } = require('../../../middleware/permission');

router.get('/', [
    requirePermission('/api/store/categories', 'GET'),
], categoryController.getAllCategories);

router.post('/',
    requirePermission('/api/store/categories', 'POST'),
    categoryController.createCategory);

router.get('/:id',
    requirePermission('/api/store/categories/:id', 'GET'),
    categoryController.getCategoryById);

router.put('/:id',
    requirePermission('/api/store/categories/:id', 'PUT'),
    categoryController.updateCategory);

router.delete('/:id',
    requirePermission('/api/store/categories/:id', 'DELETE'),
    categoryController.deleteCategory);

router.delete('/categoryFood/:id',
    requirePermission('/api/store/categories/:id', 'DELETE'),
    categoryController.removeCategoryFood);

router.post('/:id/add-food',
    requirePermission('/api/store/categories/:id/add-food', 'POST'),
    categoryController.addCategoryFood);

module.exports = router