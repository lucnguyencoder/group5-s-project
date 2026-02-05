//done
const {
    User,
    UserGroup,
    SystemProfile
} = require('../../models');
const { sequelize } = require('../../config/db');

const AdminProfileService = () => ({

    updateProfile: async (userId, profileData) => {
        const transaction = await sequelize.transaction();
        try {
            const [profile, created] = await SystemProfile.findOrCreate({
                where: { user_id: userId },
                defaults: {
                    user_id: userId,
                    full_name: profileData.full_name || '',
                    phone_number: profileData.phone_number || '',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                transaction
            });

            if (!created) {
                await profile.update({
                    ...profileData,
                    updated_at: new Date()
                }, { transaction });
            }
            const updatedProfile = await SystemProfile.findOne({
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

    changePassword: async (userId, current_password, new_password) => {
        try {
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
            if (userType !== 'system') {
                return {
                    success: false,
                    status: 401,
                    message: 'User is not found.'
                };
            }
            const isPasswordValid = await user.comparePassword(current_password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    status: 401,
                    message: 'The email or password is incorrect. Please try again.'
                };
            }
            await user.update(
                { password_hash: new_password },
                { where: { id: userId } });
            return {
                status: 200,
                success: true,
                message: 'Update successfully'
            }
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Internal server error: ' + error
            }
        }
    },
});

module.exports = AdminProfileService();