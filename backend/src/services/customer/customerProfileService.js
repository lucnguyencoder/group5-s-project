const {
    User,
    CustomerProfile,
    VerificationCode,
    UserGroup,
    sequelize
} = require('../../models');
const { consola } = require('consola');
const { sendOTPEmail } = require('../EmailSender');
const { Op } = require('sequelize');
const { generateToken, verifyToken, shortTimeToken } = require('../../middleware/jwt');
const jwt = require('jsonwebtoken');

const customerProfileService = {

    // Feature 2: Change Password
    changePassword: async (userId, current_password, new_password) => {
        const user = await User.findOne({
            where: { id: userId },
            include: [
                { model: UserGroup, as: 'group' }
            ]
        });

        if (!user) {
            return { success: false, status: 401, message: 'User is not found.' };
        }

        const userGroup = user.group;
        const userType = userGroup ? userGroup.type : null;

        if (userType !== 'customer') {
            return { success: false, status: 401, message: 'User is not found.' };
        }

        const isPasswordValid = await user.comparePassword(current_password);
        if (!isPasswordValid) {
            return {
                success: false,
                status: 401,
                message: 'The email or password is incorrect. Please try again.'
            };
        }

        const transaction = await sequelize.transaction();
        try {
            user.password_hash = new_password;
            await user.save({ transaction });

            await User.update(
                { updated_at: new Date() },
                { where: { id: user.id }, transaction }
            );

            let profile = await CustomerProfile.findOne({ where: { user_id: user.id } });
            if (!profile) {
                profile = await CustomerProfile.create({
                    user_id: user.id,
                    full_name: '',
                    is_verified: false,
                    created_at: new Date(),
                    updated_at: new Date()
                }, { transaction });
            }

            const token = generateToken(user.id, user.email);

            await transaction.commit();
            return {
                success: true,
                status: 200,
                message: 'Password changed successfully',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
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
            await transaction.rollback();
            consola.error('Password change error:', error);
            throw error;
        }
    },


    // Feature 3: Edit Profile Information
    getProfile: async (userId) => {
        try {
            if (!userId) {
                return {
                    success: false,
                    status: 400,
                    message: 'User ID is required'
                };
            }

            const user = await User.findOne({
                where: { id: userId },
                attributes: ['id', 'email', 'profile_picture'],
                include: [{
                    model: CustomerProfile,
                    required: false,
                    as: 'customerProfile',
                    attributes: ['full_name', 'date_of_birth', 'gender', 'is_verified']
                }]
            });

            if (!user) {
                return {
                    success: false,
                    status: 404,
                    message: 'User not found'
                };
            }

            // If no profile exists, create one
            if (!user.customerProfile) {
                const newProfile = await CustomerProfile.create({
                    user_id: userId,
                    full_name: '',
                    is_verified: false,
                    created_at: new Date(),
                    updated_at: new Date()
                });

                return {
                    success: true,
                    status: 200,
                    data: {
                        ...user.toJSON(),
                        customerProfile: newProfile
                    }
                };
            }

            return {
                success: true,
                status: 200,
                data: user
            };
        } catch (error) {
            consola.error('Get profile error:', error);
            return {
                success: false,
                status: 500,
                message: 'Internal server error'
            };
        }
    },

    updateProfile: async (userId, profileData) => {
        const transaction = await sequelize.transaction();
        try {
            console.log('Updating profile for user:', userId);
            console.log('Update data:', profileData);

            // First find or create the profile
            const [profile, created] = await CustomerProfile.findOrCreate({
                where: { user_id: userId },
                defaults: {
                    user_id: userId,
                    profile_picture: profileData.profile_picture,
                    full_name: profileData.full_name || '',
                    date_of_birth: profileData.date_of_birth || null,
                    gender: profileData.gender || null,
                    is_verified: false,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                transaction
            });

            if (!created) {
                // Update existing profile
                await profile.update({
                    ...profileData,
                    updated_at: new Date()
                }, { transaction });
            }

            // Refresh profile data
            const updatedProfile = await CustomerProfile.findOne({
                where: { user_id: userId },
                transaction
            });

            const user = await User.findByPk(userId, {
                attributes: ['id', 'email', 'profile_picture'],
                transaction
            });

            await transaction.commit();

            return {
                success: true,
                status: 200,
                data: {
                    id: user.id,
                    email: user.email,
                    profile_picture: user.profile_picture,
                    customerProfile: updatedProfile
                },
                message: 'Profile updated successfully'
            };
        } catch (error) {
            await transaction.rollback();
            console.error('Profile update error:', error);
            return {
                success: false,
                status: 500,
                message: error.message || 'Failed to update profile'
            };
        }
    },


    //Enable/Disable 2FA
    toggle2Fa: async (userId) => {
        try {
            console.log(userId);
            const user = await User.findByPk(userId,
                {
                    include: [
                        { model: UserGroup, as: 'group' }
                    ]
                });
            if (!user) {
                return {
                    status: 404,
                    success: false,
                    message: 'User not found'
                };
            }
            const userGroup = user.group;
            const userType = userGroup ? userGroup.type : null;
            let profile = await CustomerProfile.findOne({ where: { user_id: user.id } });
            if (user.is_enabled_2fa) {
                await User.update(
                    { is_enabled_2fa: false },
                    { where: { id: userId } }
                );
                user.is_enabled_2fa = false
                console.log(user.is_enabled_2fa);
                return {
                    status: 200,
                    success: true,
                    data: {
                        user: {
                            id: user.id,
                            email: user.email,
                            is_enabled_2fa: true,
                            profile_picture: user.profile_picture,
                            user_type: userType,
                            group: {
                                id: userGroup.id,
                                name: userGroup.name,
                                type: userGroup.type
                            },
                            profile: profile
                        },
                    },
                    message: 'Two-Factor Authentication Disabled',
                }
            } else {
                await User.update(
                    { is_enabled_2fa: true },
                    { where: { id: userId } }
                );
                user.is_enabled_2fa = true
                return {
                    status: 200,
                    success: true,
                    message: '2FA disable successfully',
                    data: {
                        user: {
                            id: user.id,
                            email: user.email,
                            is_enabled_2fa: false,
                            profile_picture: user.profile_picture,
                            user_type: userType,
                            group: {
                                id: userGroup.id,
                                name: userGroup.name,
                                type: userGroup.type
                            },
                            profile: profile
                        },
                    },
                    message: 'Two-Factor Authentication Enabled',
                }
            }
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'An error has occurred: ' + error
            };
        }
    }

    // // Feature 2: Change Password
    // changePassword: async (userId, currentPassword, newPassword) => {
    //     // TODO: Implement password change logic
    // },

    // // Feature 3: Edit Profile Information
    // updateProfile: async (userId, profileData) => {
    //     // TODO: Implement profile update logic
    // },

    // getProfile: async (userId) => {
    //     // TODO: Implement get profile logic
    // }
};

module.exports = customerProfileService;