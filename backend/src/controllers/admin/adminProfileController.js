//done
const AdminProfileService = require('../../services/admin/AdminProfileService');


const adminProfileRoute = {
    updateProfile: async (req, res) => {
        const userId = req.body.userId;
        const profileData = req.body.profileData;
        if (!userId || !profileData) {
            return res.status(400).json({
                success: false,
                message: 'User ID and profile data are required'
            });
        }
        try {
            const response = await AdminProfileService.updateProfile(userId, profileData);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                    message: response.message,
                    data: response.data,
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error while updating profile'
            });
        }
    },

    changePassword: async (req, res) => {
        const userId = req.body.userId;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'User ID, current password, and new password are required'
            });
        }
        try {
            const response = await AdminProfileService.changePassword(userId, currentPassword, newPassword);
            if (response.success) {
                return res.status(200).json({
                    success: true,
                    message: response.message,
                });
            }
            return res.status(response.status).json({
                success: false,
                message: response.message
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error while updating password'
            });
        }
    }
}

module.exports = adminProfileRoute;