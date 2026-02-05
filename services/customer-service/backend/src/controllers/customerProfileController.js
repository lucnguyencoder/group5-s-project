const customerProfileService = require('../services/customerProfileService');
const { consola } = require('consola');
const { body, validationResult } = require('express-validator');

const customerProfileController = {
    //account recovery
    //request
    requestRecoveryAccount: async (req, res) => {
        try {
            const { email } = req.body;
            const result = await customerProfileService.requestRecoveryAccount(email);
            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                ...(result.data && { data: result.data })
            })
        }
        catch (error) {
            consola.error('Recovery account error: ', error);
            return res.status(500).json({
                success: false,
                message: 'Sever error during recovery account'
            });
        }
    },
    //verify otp
    verifyOTP: async (req, res) => {
        try {
            //lay id request tu duong dan
            const { id, otp } = req.body;
            const result = await customerProfileService.verifyOTP(id, otp);
            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                ...(result.data && { data: result.data })
            })
        }
        catch (error) {
            consola.error('Verify recovery error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during recovery verification'
            });
        }
    },

    //change password
    resetPassword: async (req, res) => {
        try {
            const { resetToken, newPass } = req.body;
            const result = await customerProfileService.resetPassword(resetToken, newPass);
            return res.status(result.status).json({
                success: result.success,
                message: result.message
            });
        }
        catch (error) {
            consola.error('Reset password error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during password reset'
            });
        }
    },

    // Feature 2: 2FA


    // Feature 3: Edit Profile Information
    updateProfile: async (req, res) => {
        try {
            // TODO: Implement profile update controller logic
        } catch (error) {
            consola.error('Profile update error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during profile update'
            });
        }
    },

    getProfile: async (req, res) => {
        try {
            // TODO: Implement get profile controller logic
        } catch (error) {
            consola.error('Get profile error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error while fetching profile'
            });
        }
    }
};

module.exports = customerProfileController;