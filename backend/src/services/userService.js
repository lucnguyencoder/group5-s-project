const {
    User,
    UserGroup,
    CustomerProfile,
    SystemProfile,
    StoreProfile,
    VerificationCode
} = require('../models');
const { generateToken, shortTimeToken } = require('../middleware/jwt');
const { consola } = require('consola');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { sendOTPEmail, sendAuthenticate } = require('./EmailSender');

const userService = {
    login: async (email, password, userType) => {

        const user = await User.findOne({
            where: { email },
            include: [
                { model: UserGroup, as: 'group' }
            ]
        });

        if (!user) {
            return { success: false, status: 401, message: 'User is not found.' };
        }

        const userGroup = user.group;
        const actualUserType = userGroup ? userGroup.type : null;

        if (actualUserType !== userType) {
            return { success: false, status: 401, message: 'User is not found.' };
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return { success: false, status: 401, message: 'The email or password is incorrect. Please try again.' };
        }

        await User.update(
            { updated_at: new Date() },
            { where: { id: user.id } }
        );

        if (userType === 'customer' && user.is_enabled_2fa) {
            return await userService.handle2FAAuthentication(user);
        }

        let profile = await userService.getOrCreateProfile(user.id, userType, userGroup);

        const token = generateToken(user);

        return {
            success: true,
            status: 200,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    is_enabled_2fa: user.is_enabled_2fa,
                    profile_picture: user.profile_picture,
                    user_type: userType,
                    is_active: user.is_active,
                    group: {
                        id: userGroup.id,
                        name: userGroup.name,
                        type: userGroup.type
                    },
                    profile: profile
                },
                token
            }
        };
    },


    handle2FAAuthentication: async (user) => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const coolDownTime = new Date(Date.now() - 2 * 60 * 1000);


        const lastOtp = await VerificationCode.findOne({
            where: {
                user_id: user.id,
                created_at: { [Op.gt]: coolDownTime },
                code_type: 'two_factor_auth'
            },
            order: [['created_at', 'DESC']]
        });

        if (lastOtp) {
            return {
                status: 400,
                success: false,
                message: 'You need to wait 2 minutes to send OTP'
            };
        }


        const createOTP = await VerificationCode.create({
            user_id: user.id,
            code: otp,
            expires_at: new Date(Date.now() + 5 * 60 * 1000),
            code_type: 'two_factor_auth'
        });

        const tempToken = shortTimeToken(user, '5m');
        const sendEmail = await sendAuthenticate(user.email, otp);

        if (!sendEmail) {
            return {
                status: 421,
                success: false,
                message: 'Services not available'
            };
        }

        return {
            status: 200,
            success: true,
            is_enabled_2fa: user.is_enabled_2fa,
            message: 'OTP send successful',
            data: {
                requestId: createOTP.id,
                tempToken
            }
        };
    },

    getOrCreateProfile: async (userId, userType, userGroup) => {
        let profile = null;

        if (userType === 'customer') {
            profile = await CustomerProfile.findOne({ where: { user_id: userId } });

            if (!profile) {
                profile = await CustomerProfile.create({
                    user_id: userId,
                    full_name: '',
                    is_verified: false,
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }
        } else if (userType === 'system') {
            profile = await SystemProfile.findOne({ where: { user_id: userId } });

            if (!profile) {
                profile = await SystemProfile.create({
                    user_id: userId,
                    phone_number: '',
                    full_name: '',
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }
        } else if (userType === 'store') {
            profile = await StoreProfile.findOne({ where: { user_id: userId } });

            if (!profile) {
                profile = await StoreProfile.create({
                    user_id: userId,
                    store_id: 1,
                    role: userGroup.name,
                    username: "",
                    email: "",
                    full_name: '',
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }
        }

        return profile;
    },

    register: async (userData) => {
        const { email, password, full_name, user_type, store_name } = userData;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return {
                success: false,
                status: 400,
                message: 'User with this email already exists'
            };
        }


        const defaultGroup = await UserGroup.findOne({
            where: {
                is_default: true,
                type: user_type
            }
        });

        if (!defaultGroup) {
            return {
                success: false,
                status: 500,
                message: 'Default user group not found for this user type'
            };
        }

        const transaction = await sequelize.transaction();

        try {

            const newUser = await User.create({
                email,
                password_hash: password,
                group_id: defaultGroup.id,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction });


            if (user_type === 'customer') {
                await CustomerProfile.create({
                    user_id: newUser.id,
                    full_name,
                    is_verified: true,
                    created_at: new Date(),
                    updated_at: new Date()
                }, { transaction });
            } else if (user_type === 'system') {
                await SystemProfile.create({
                    user_id: newUser.id,
                    role: defaultGroup.name === 'system_admin' ? 'system_admin' : 'support_agent',
                    full_name,
                    created_at: new Date(),
                    updated_at: new Date()
                }, { transaction });
            } else if (user_type === 'store') {
                if (!store_name) {
                    await transaction.rollback();
                    return {
                        success: false,
                        status: 400,
                        message: 'Store name is required for store accounts'
                    };
                }

                await StoreProfile.create({
                    user_id: newUser.id,
                    store_id: 1,
                    role: defaultGroup.name,
                    username: email,
                    email,
                    full_name,
                    created_at: new Date(),
                    updated_at: new Date()
                }, { transaction });
            }

            await transaction.commit();

            const token = generateToken(newUser);
            return {
                success: true,
                status: 201,
                message: 'User registered successfully',
                data: {
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        user_type
                    },
                    token
                }
            };
        } catch (error) {
            await transaction.rollback();
            consola.error('Registration error:', error);
            return {
                success: false,
                status: 500,
                message: 'Server error during registration'
            };
        }
    },

    verify2FA: async (tempToken, requestId, otp) => {
        try {
            const decode = jwt.verify(tempToken, 'yuumi');
            if (!decode) {
                return {
                    status: 401,
                    success: false,
                    message: 'Not found or Invalid Token'
                };
            }
            const user = await User.findByPk(decode.id, {
                include: [
                    { model: UserGroup, as: 'group' }
                ]
            });
            if (!user) {
                return {
                    status: 401,
                    success: false,
                    message: 'Can not find user'
                };
            }
            const userGroup = user.group;
            const userType = userGroup ? userGroup.type : null;
            if (userType !== 'customer') {
                return { success: false, status: 401, message: 'User is not found.' };
            }
            const result = await VerificationCode.findOne({
                where: {
                    id: requestId,
                    code: otp,
                    is_used: false,
                    expires_at: {
                        [Op.gt]: new Date()
                    }
                },
            });
            if (!result) {
                return {
                    status: 400,
                    success: false,
                    message: 'Invalid or expired OTP'
                };
            }
            await result.update({
                is_used: true,
                used_at: new Date()
            });
            const token = generateToken(user);
            await User.update(
                { updated_at: new Date() },
                { where: { id: user.id } }
            );
            let profile = await userService.getOrCreateProfile(user.id, userType, userGroup);
            return {
                status: 200,
                success: true,
                message: 'OTP verified successfully',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        is_enabled_2fa: user.is_enabled_2fa,
                        profile_picture: user.profile_picture,
                        user_type: userType,
                        group: {
                            id: userGroup.id,
                            name: userGroup.name,
                            type: userGroup.type
                        },
                        profile: profile
                    },
                    token
                }
            };
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return {
                    status: 401,
                    success: false,
                    message: 'Reset token has expired'
                };
            }
            return {
                status: 500,
                success: false,
                message: 'Server error during OTP verification'
            };
        }
    },

    requestRecoveryAccount: async (email, userType) => {
        try {
            const user = await User.findOne({
                where: { email },
                include: [
                    { model: UserGroup, as: 'group' }
                ]
            });

            if (!user) {
                return {
                    status: 400,
                    success: false,
                    message: 'User not found'
                };
            }
            const userGroup = user.group;
            const actualUserType = userGroup ? userGroup.type : null;
            if (actualUserType !== userType) {
                return { success: false, status: 401, message: 'User is not found.' };
            }
            const coolDownTime = new Date(Date.now() - 2 * 60 * 1000);
            const lastOtp = await VerificationCode.findOne({
                where: {
                    user_id: user.id,
                    created_at: { [Op.gt]: coolDownTime },
                    code_type: 'password_recovery'
                },
                order: [['created_at', 'DESC']]
            });
            if (lastOtp) {
                return {
                    status: 400,
                    success: false,
                    message: 'You need to wait 2 minutes to send OTP'
                };
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const createOTP = await VerificationCode.create({
                user_id: user.id,
                code: otp,
                expires_at: new Date(Date.now() + 5 * 60 * 1000),
                code_type: 'password_recovery'
            });
            const sendEmail = await sendOTPEmail(email, otp);
            if (!sendEmail) {
                return {
                    status: 421,
                    success: false,
                    message: 'Services not available'
                };
            }
            return {
                status: 200,
                success: true,
                message: 'OTP send successful',
                data: {
                    requestId: createOTP.id
                }
            };
        } catch (error) {
            return {
                status: 421,
                success: false,
                message: 'Error during authenticate'
            };
        }
    },

    verifyOTP: async (id, otp) => {
        try {
            const requestId = parseInt(id);
            const result = await VerificationCode.findOne({
                where: {
                    id: requestId,
                    code: otp,
                    is_used: false,
                    expires_at: {
                        [Op.gt]: new Date()
                    }
                },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'email']
                }]
            });

            if (!result) {
                return {
                    status: 400,
                    success: false,
                    message: 'Invalid or expired OTP'
                };
            }

            await result.update({
                is_used: true,
                used_at: new Date()
            });

            const resetToken = shortTimeToken(result.user, '15m');

            return {
                status: 200,
                success: true,
                message: 'OTP verified successfully',
                data: {
                    resetToken
                }
            };
        } catch (error) {
            consola.error('Verify OTP error:', error);
            return {
                status: 500,
                success: false,
                message: 'Server error during verification'
            };
        }
    },

    resetPassword: async (resetToken, newPass) => {
        try {
            const decoded = jwt.verify(resetToken, 'yuumi');
            const user = await User.findByPk(decoded.id);

            if (!user) {
                return {
                    status: 404,
                    success: false,
                    message: 'User not found'
                };
            }

            await user.update({
                password_hash: newPass,
                updated_at: new Date()
            });

            return {
                status: 200,
                success: true,
                message: 'Password reset successfully'
            };
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return {
                    status: 401,
                    success: false,
                    message: 'Reset token has expired'
                };
            }
            consola.error('Password reset error:', error);
            return {
                status: 500,
                success: false,
                message: 'Server error during password reset'
            };
        }
    }
};

module.exports = userService;
