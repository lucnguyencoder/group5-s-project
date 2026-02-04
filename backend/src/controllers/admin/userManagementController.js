//done
const userManagementService = require('../../services/admin/userManagementService');
const { consola } = require('consola');
const { validationResult } = require('express-validator');

class UserManagementController {
    async getAllUsers(req, res) {
        try {
            const filters = {
                email: req.query.email,
                user_type: req.query.user_type,
                is_active: req.query.is_active !== undefined ?
                    (req.query.is_active === 'true') : undefined
            };

            const itemPerPage = parseInt(req.query.itemPerPage) || 20;
            const page = parseInt(req.query.page) || 1;

            const result = await userManagementService.getAllUsers(filters, itemPerPage, page);

            return res.status(200).json({
                success: true,
                count: result.totalCount,
                data: result.users,
                pagination: {
                    currentPage: result.currentPage,
                    itemPerPage: result.itemPerPage,
                    totalPages: result.totalPages,
                    totalCount: result.totalCount
                }
            });
        } catch (error) {
            consola.error('Get users error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error fetching users'
            });
        }
    }

    async getUserById(req, res) {
        try {
            // console.log('Fetching user by ID:', req.params.id);
            const user = await userManagementService.getUserById(req.params.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            consola.error('Get user error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error fetching user'
            });
        }
    }

    async createUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        try {
            const userData = await userManagementService.createUser(req.body);

            return res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: userData
            });
        } catch (error) {

            if (error.message === 'User with this email already exists') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('User group with ID')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Server error creating user'
            });
        }
    }

    async updateUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        try {
            const result = await userManagementService.updateUser(req.params.id, req.body);

            return res.status(200).json({
                success: true,
                message: 'User updated successfully'
            });
        } catch (error) {
            consola.error('Update user error:', error);

            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('User group with ID')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Server error updating user'
            });
        }
    }

    async toggleUser(req, res) {
        try {
            const result = await userManagementService.toggleUser(req.params.id, req.user.id);

            const message = result.is_active
                ? 'User has been activated successfully'
                : 'User has been deactivated successfully';

            return res.status(200).json({
                success: true,
                message: message,
                is_active: result.is_active
            });
        } catch (error) {
            consola.error('User status toggle error:', error);

            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message === 'Cannot modify your own account status') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Server error updating user status'
            });
        }
    }
}

module.exports = new UserManagementController();
