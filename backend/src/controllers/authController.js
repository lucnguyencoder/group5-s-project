const authService = require('../services/customer/customerAuthService');
const { JWT_COOKIE_NAME, setCookie, clearCookie } = require('../config/cookie');
const { consola } = require('consola');
const { User, UserGroup, CustomerProfile, SystemProfile, StoreProfile } = require('../models');
const { generateToken } = require('../middleware/jwt');



const authController = {
    // Login controller
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            /**
             * return {
            success: true,
            status: 200,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    profile_picture: user.profile_picture,
                    user_type: user.user_type,
                    groups: user.groups.map(group => ({
                        id: group.id,
                        name: group.name
                    })),
                    profile: profile
                },
                token
            }
        };
             */
            if (result.success) {
                if (result.is_enabled_2fa) {
                    return res.status(result.status).json({
                        success: result.success,
                        message: result.message,
                        is_enabled_2fa: result.is_enabled_2fa,
                        data: result.data
                    })
                }
                else
                    setCookie(res, JWT_COOKIE_NAME, result.data.token);
            }

            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            consola.error('Login error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during login'
            });
        }
    },

    register: async (req, res) => {
        try {
            const result = await authService.register(req.body);

            if (result.success) {
                setCookie(res, JWT_COOKIE_NAME, result.data.token);
            }

            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            consola.error('Registration error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during registration'
            });
        }
    },

    logout: (req, res) => {
        try {
            clearCookie(res, JWT_COOKIE_NAME);

            return res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            consola.error('Logout error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during logout'
            });
        }
    },    // Get current user profile
    getProfile: async (req, res) => {
        try {
            const result = await authService.getProfile(req.user.id);

            // If this is a customer profile and the request was successful, get locations
            if (result.success && result.data && result.data.user_type === 'customer') {
                // Import the location service
                const customerLocationService = require('../services/customer/customerLocationService');

                // Get the customer's delivery locations
                const locationsResult = await customerLocationService.getAllLocations(req.user.id);

                // Add locations to the response if they were retrieved successfully
                if (locationsResult.success) {
                    result.data.deliveryAddresses = locationsResult.data;
                }
            }

            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            consola.error('Get profile error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error fetching profile'
            });
        }
    },

    refreshToken: async (req, res) => {
        try {
            const user = await User.findByPk(req.user.id, {
                include: [
                    { model: UserGroup, as: 'groups' }
                ]
            });

            if (!user) {
                clearCookie(res, JWT_COOKIE_NAME);
                return res.status(401).json({
                    success: false,
                    message: 'User no longer active'
                });
            }
            const userGroup = user.groups && user.groups.length > 0 ? user.groups[0] : null;
            const userType = userGroup ? userGroup.type : null;
            let isVerified = true;
            if (userType === 'customer') {
                const profile = await CustomerProfile.findOne({ where: { user_id: user.id } });
                if (profile && !profile.is_verified) {
                    isVerified = false;
                }
            } else if (userType === 'store') {
                const profile = await StoreProfile.findOne({ where: { user_id: user.id } });
                if (profile && !profile.is_verified) {
                    isVerified = false;
                }
            }

            if (!isVerified) {
                clearCookie(res, JWT_COOKIE_NAME);
                return res.status(401).json({
                    success: false,
                    message: 'Account not verified'
                });
            }

            const newToken = generateToken(user);
            setCookie(res, JWT_COOKIE_NAME, newToken);

            return res.status(200).json({
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    token: newToken
                }
            });
        } catch (error) {
            consola.error('Token refresh error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during token refresh'
            });
        }
    },

    verify2FA: async (req, res) => {
        try {
            const { id, otp } = req.body;
            const { tempToken } = req.body.data;
            if (!tempToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Temporary token is required'
                });
            }
            if (!id || !otp) {
                return res.status(400).json({
                    success: false,
                    message: 'ID and OTP are required'
                });
            }
            const result = await authService.verify2FA(tempToken, id, otp);
            if (result.success) {
                setCookie(res, JWT_COOKIE_NAME, result.data.token)
                return res.status(result.status).json({
                    success: result.success,
                    message: result.message,
                    data: result.data,
                })
            }
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Sever error during authenticate'
            });
        }
    },

    requestRecoveryAccount: async (req, res) => {
        try {
            const { email } = req.body;
            const result = await authService.requestRecoveryAccount(email);
            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                ...(result.data && { data: result.data })
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Sever error during recovery account'
            });
        }
    },

    verifyOTP: async (req, res) => {
        try {
            const { id, otp } = req.body;
            if (!id || !otp) {
                return res.status(400).json({
                    success: false,
                    message: 'ID and OTP are required'
                });
            }
            const result = await authService.verifyOTP(id, otp);
            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                ...(result.data && { data: result.data })
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error during recovery verification'
            });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { resetToken, newPass } = req.body;
            const result = await authService.resetPassword(resetToken, newPass);
            return res.status(result.status).json({
                success: result.success,
                message: result.message
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error during password reset'
            });
        }
    },

    changePassword: async (req, res) => {
        try {
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error during password change'
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error during profile update'
            });
        }
    },
};

module.exports = authController;
