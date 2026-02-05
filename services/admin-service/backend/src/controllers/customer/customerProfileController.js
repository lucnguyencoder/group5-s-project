const customerProfileService = require('../../services/customer/customerProfileService');
const { consola } = require('consola');
const { body, validationResult } = require('express-validator');
const { JWT_COOKIE_NAME, setCookie, clearCookie } = require('../../config/cookie');
const { response } = require('express');

const customerProfileController = {

    //toggle 2fa
    toggle2Fa: async (req, res) => {
        try {
            const { userId } = req.body;
            const result = await customerProfileService.toggle2Fa(userId);
            if (result.success) {
                return res.status(result.status).json({
                    success: result.success,
                    message: result.message,
                    data: result.data
                })
            }
            else {
                return res.status(result.status).json({
                    success: result.success,
                    message: result.message,
                    data: result.data
                })
            }
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'An error has occurred: ' + error
            })
        }
    },

    // Feature 2: Change Password
    changePassword: async (req, res) => {
        try {
            // Validate request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: errors.array()
                });
            }
            const userId = req.user.id;
            const { current_password, new_password } = req.body;

            const result = await customerProfileService.changePassword(userId, current_password, new_password);

            if (result.success && result.data?.token) {
                // Set the new token in cookie if provided
                res.cookie('token', result.data.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 60 * 1000 // 24 hours
                });
            }

            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            consola.error('Password change error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during password change'
            });
        }
    },


    // Feature 3: Edit Profile Information
    updateProfile: async (req, res) => {
        try {
            const userId = req.user.id;

            if (!req.body.full_name && !req.body.date_of_birth && !req.body.gender) {
                return res.status(400).json({
                    success: false,
                    message: 'At least one field is required for update'
                });
            }

            const profileData = {};

            if (req.body.full_name) profileData.full_name = req.body.full_name;
            if (req.body.gender) profileData.gender = req.body.gender;
            if (req.body.date_of_birth) {
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateRegex.test(req.body.date_of_birth)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid date format. Use YYYY-MM-DD'
                    });
                }
                profileData.date_of_birth = req.body.date_of_birth;
            }

            const result = await customerProfileService.updateProfile(userId, profileData);
            return res.status(result.status).json(result);
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
            const userId = req.user.id; // Assuming authentication middleware sets req.user
            const result = await customerProfileService.getProfile(userId);

            return res.status(result.status).json({
                success: result.success,
                data: result.data,
                message: result.message
            });
        } catch (error) {
            consola.error('Get profile error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    // New method for avatar upload
    uploadAvatar: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            // Check file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid file type. Only JPEG, PNG, JPG and GIF are allowed'
                });
            }

            // Check file size (max 2MB)
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (req.file.size > maxSize) {
                return res.status(400).json({
                    success: false,
                    message: 'File is too large. Maximum size is 2MB'
                });
            }

            const userId = req.user.id;
            const result = await customerProfileService.uploadAvatar(userId, req.file);

            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            consola.error('Avatar upload error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during avatar upload'
            });
        }
    }
    // //account recovery
    // //request
    // requestRecoveryAccount: async (req, res) => {
    //     try {
    //         const { email } = req.body;
    //         const result = await customerProfileService.requestRecoveryAccount(email);
    //         return res.status(result.status).json({
    //             success: result.success,
    //             message: result.message,
    //             ...(result.data && { data: result.data })
    //         })
    //     }
    //     catch (error) {
    //         consola.error('Recovery account error: ', error);
    //         return res.status(500).json({
    //             success: false,
    //             message: 'Sever error during recovery account'
    //         });
    //     }
    // },
    // //verify otp
    // verifyOTP: async (req, res) => {
    //     try {
    //         //lay id request tu duong dan
    //         const { id, otp } = req.body;
    //         const result = await customerProfileService.verifyOTP(id, otp);
    //         return res.status(result.status).json({
    //             success: result.success,
    //             message: result.message,
    //             ...(result.data && { data: result.data })
    //         })
    //     }
    //     catch (error) {
    //         consola.error('Verify recovery error:', error);
    //         return res.status(500).json({
    //             success: false,
    //             message: 'Server error during recovery verification'
    //         });
    //     }
    // },

    // //change password
    // resetPassword: async (req, res) => {
    //     try {
    //         const { resetToken, newPass } = req.body;
    //         const result = await customerProfileService.resetPassword(resetToken, newPass);
    //         return res.status(result.status).json({
    //             success: result.success,
    //             message: result.message
    //         });
    //     }
    //     catch (error) {
    //         consola.error('Reset password error:', error);
    //         return res.status(500).json({
    //             success: false,
    //             message: 'Server error during password reset'
    //         });
    //     }
    // },

    // // Feature 2: Change Password
    // changePassword: async (req, res) => {
    //     try {
    //         // TODO: Implement password change controller logic
    //     } catch (error) {
    //         consola.error('Password change error:', error);
    //         return res.status(500).json({
    //             success: false,
    //             message: 'Server error during password change'
    //         });
    //     }
    // },

    // // Feature 3: Edit Profile Information
    // updateProfile: async (req, res) => {
    //     try {
    //         // TODO: Implement profile update controller logic
    //     } catch (error) {
    //         consola.error('Profile update error:', error);
    //         return res.status(500).json({
    //             success: false,
    //             message: 'Server error during profile update'
    //         });
    //     }
    // },

    // getProfile: async (req, res) => {
    //     try {
    //         // TODO: Implement get profile controller logic
    //     } catch (error) {
    //         consola.error('Get profile error:', error);
    //         return res.status(500).json({
    //             success: false,
    //             message: 'Server error while fetching profile'
    //         });
    //     }
    // }
};


module.exports = customerProfileController;