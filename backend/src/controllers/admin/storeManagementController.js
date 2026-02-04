const storeManagementService = require('../../services/admin/storeManagementService');
const { consola } = require('consola');
const { validationResult } = require('express-validator');

class StoreManagementController {
    async getAllStores(req, res) {
        try {
            const filters = {
                name: req.query.name,
                address: req.query.address,
                status: req.query.status,
                isActive: req.query.isActive !== undefined ?
                    (req.query.isActive === 'true') : undefined,
                isTempClosed: req.query.isTempClosed !== undefined ?
                    (req.query.isTempClosed === 'true') : undefined
            };

            const itemPerPage = parseInt(req.query.itemPerPage) || 20;
            const page = parseInt(req.query.page) || 1;

            const result = await storeManagementService.getAllStores(filters, itemPerPage, page);

            return res.status(200).json({
                success: true,
                count: result.totalCount,
                data: result.stores,
                pagination: {
                    currentPage: result.currentPage,
                    itemPerPage: result.itemPerPage,
                    totalPages: result.totalPages,
                    totalCount: result.totalCount
                }
            });
        } catch (error) {
            consola.error('Get stores error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error fetching stores'
            });
        }
    }

    async getStoreById(req, res) {
        try {
            const store = await storeManagementService.getStoreById(req.params.id);

            if (!store) {
                return res.status(404).json({
                    success: false,
                    message: 'Store not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: store
            });
        } catch (error) {
            consola.error('Get store error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error fetching store'
            });
        }
    }

    async createStore(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        try {
            const { storeData, merchant } = req.body;

            if (!merchant) {
                return res.status(400).json({
                    success: false,
                    message: 'Merchant information is required'
                });
            }

            const members = [merchant];
            const newStore = await storeManagementService.createStore(storeData, members);

            return res.status(201).json({
                success: true,
                message: 'Store created successfully',
                data: newStore
            });
        } catch (error) {
            consola.error('Create store error:', error);

            if (error.message.includes('already exists')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('Invalid role')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Server error creating store'
            });
        }
    }

    async updateStore(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        try {
            const updatedStore = await storeManagementService.updateStore(req.params.id, req.body);

            return res.status(200).json({
                success: true,
                message: 'Store updated successfully',
                data: updatedStore
            });
        } catch (error) {
            consola.error('Update store error:', error);

            if (error.message === 'Store not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Server error updating store'
            });
        }
    }

    async toggleStoreStatus(req, res) {
        try {
            const result = await storeManagementService.toggleStoreStatus(req.params.id);

            const message = result.isActive
                ? 'Store has been activated successfully'
                : 'Store has been deactivated successfully';

            return res.status(200).json({
                success: true,
                message,
                isActive: result.isActive
            });
        } catch (error) {
            consola.error('Toggle store status error:', error);

            if (error.message === 'Store not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Server error updating store status'
            });
        }
    }

    async toggleStoreTempClosed(req, res) {
        try {
            const result = await storeManagementService.toggleStoreTempClosed(req.params.id);

            const message = result.isTempClosed
                ? 'Store has been temporarily closed'
                : 'Store has been reopened';

            return res.status(200).json({
                success: true,
                message,
                isTempClosed: result.isTempClosed
            });
        } catch (error) {
            consola.error('Toggle store temporary closure error:', error);

            if (error.message === 'Store not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Server error updating store temporary closure status'
            });
        }
    }

}

module.exports = new StoreManagementController();
