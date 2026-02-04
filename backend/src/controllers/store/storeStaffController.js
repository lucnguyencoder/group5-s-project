//done
const storeStaffService = require('../../services/store/StoreStaffService');

const storeStaffController = {
    getAllStaff: async (req, res) => {
        try {
            const filters = {
                type: req.query.type,
                email: req.query.email,
                isCourierActive: req.query.is_courier_active
            }
            const pagination = {
                page: req.query.page || 1,
                itemPerPage: req.query.itemPerPage || 10
            }
            const storeId = req.query.storeId;
            if (!storeId) {
                return res.status(400).json({
                    success: false, message: 'Store ID is required'
                });
            }
            const response = await storeStaffService.getAllStaff(storeId, filters, pagination.itemPerPage, pagination.page);
            if (!response.success) {
                return res.status(response.status).json({
                    success: false,
                    message: response.message
                })
            }
            return res.status(response.status).json({
                success: true,
                message: response.message,
                currentPage: response.currentPage,
                totalPage: response.totalPage,
                staff: response.staff
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Server Error'
            })
        }
    },

    getStaffById: async (req, res) => {
        try {
            const staffId = req.params.staffId;
            if (!staffId) {
                return res.status(400).json({
                    success: false,
                    message: 'Staff ID is required'
                });
            }
            const response = await storeStaffService.getStaffById(staffId);
            if (!response.success) {
                return res.status(response.status).json({
                    success: false,
                    message: response.message
                })
            }
            return res.status(response.status).json({
                success: true,
                message: response.message,
                staff: response.staff
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Server Error'
            })
        }
    },

    updateStaff: async (req, res) => {
        try {
            const { staffId, updateData, userId } = req.body;
            if (!staffId || !updateData || !userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Staff ID, update data, and user ID are required'
                });
            }
            const response = await storeStaffService.updateStaff(staffId, updateData, userId);
            if (response.success) {
                return res.status(200).json({
                    success: true,
                })
            }
            return res.status(response.status).json({
                success: false,
                message: response.message
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server Error'
            })
        }
    },

    createStaff: async (req, res) => {
        try {
            const { staffData } = req.body;
            const response = await storeStaffService.createStaff(staffData);
            if (!response.success) {
                return res.status(response.status).json({
                    success: false,
                    message: response.message
                })
            }
            return res.status(response.status).json({
                success: true,
                message: response.message,
                staff: response.staff
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server Error'
            })
        }
    },

    disableStaff: async (req, res) => {
        try {
            const staffId = req.params.staffId;
            if (!staffId) {
                return res.status(400).json({
                    success: false,
                    message: 'Staff ID is required'
                });
            }
            const response = await storeStaffService.disableStaff(staffId);
            if (response.success) {
                return res.status(200).json({
                    success: true,
                    isActive: response.isActive
                })
            }
            return res.status(response.status).json({
                success: false,
                message: response.message
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server Error'
            })
        }
    },
    changeRole: async (req, res) => {
        try {
            const staffId = req.params.staffId;
            const role = req.body.role;
            if (!staffId || !role) {
                return res.status(400).json({
                    success: false,
                    message: 'Staff ID and role are required'
                });
            }
            const response = await storeStaffService.changeRole(staffId, role);
            if (response.success) {
                return res.status(200).json({
                    success: true,
                    role: response.role
                })
            }
            return res.status(response.status).json({
                success: false,
                message: response.message
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server Error'
            })
        }
    },

    setCheckInOut: async (req, res) => {
        try {
            const { staffId } = req.params;
            if (!staffId) {
                return res.status(400).json({
                    success: false,
                    message: 'Staff ID is required'
                });
            }
            const response = await storeStaffService.setCheckInOut(staffId);
            if (response.success) {
                return res.status(200).json({
                    success: true,
                    isActive: response.isActive
                })
            }
            return res.status(response.status).json({
                success: false,
                message: response.message
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server Error'
            })
        }
    }
}

module.exports = storeStaffController;