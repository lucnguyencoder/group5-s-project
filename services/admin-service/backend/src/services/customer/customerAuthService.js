const {
    User,
    UserGroup,
    CustomerProfile,
    SystemProfile,
    StoreProfile,
    Store,
    Permission,
    UserGroupPermission
} = require('../../models');
const { includes } = require('../../store/adminPerm');

const userService = require('../userService');

const customerAuthService = {
    login: async (email, password) => {
        return await userService.login(email, password, 'customer');
    },

    register: async (userData) => {
        userData.user_type = 'customer';
        return await userService.register(userData);
    },

    getProfile: async (userId) => {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password_hash'] },
            include: [
                { model: UserGroup, as: 'group' }
            ]
        });

        if (!user) {
            return {
                success: false,
                status: 404,
                message: 'User not found'
            };
        }

        let profile = null;
        const userGroup = user.group;
        const userType = userGroup ? userGroup.type : null;

        if (userType === 'customer') {
            profile = await CustomerProfile.findOne({ where: { user_id: user.id } });

            if (!profile) {
                profile = await CustomerProfile.create({
                    user_id: user.id,
                    full_name: 'New Customer',
                    is_verified: false,
                    is_enabled_2fa: user.is_enabled_2fa,
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }
        } else if (userType === 'system') {
            profile = await SystemProfile.findOne({ where: { user_id: user.id } });

            if (!profile) {
                profile = await SystemProfile.create({
                    user_id: user.id,
                    role: userGroup.name === 'system_admin' ? 'system_admin' : 'support_agent',
                    full_name: '',
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }
        } else if (userType === 'store') {
            profile = await StoreProfile.findOne({
                where: { user_id: user.id },
                include: [{
                    model: Store,
                    as: 'store'
                }]
            });
        }

        const permissions = await UserGroupPermission.findAll({
            where: { group_id: userGroup.id },
            include: [
                {
                    model: Permission,
                    as: 'permission',
                }
            ]
        });

        const permList = permissions.map((item) => ({ url: item.permission.url, method: item.permission.http_method }));

        return {
            success: true,
            status: 200,
            data: {
                id: user.id,
                email: user.email,
                profile_picture: user.profile_picture,
                is_active: user.is_active,
                is_enabled_2fa: user.is_enabled_2fa,
                user_type: userType,
                created_at: user.created_at,
                group: {
                    id: userGroup.id,
                    name: userGroup.name,
                    type: userGroup.type
                },
                profile,
                permissions: permList || [],
            }
        };
    },

    //xac minh otp
    verify2FA: async (tempToken, requestId, otp) => {
        return await userService.verify2FA(tempToken, requestId, otp);
    },

    //tao otp, gui mail khoi phuc tai khoan
    requestRecoveryAccount: async (email) => {
        return await userService.requestRecoveryAccount(email, 'customer');
    },

    verifyOTP: async (id, otp) => {
        return await userService.verifyOTP(id, otp);
    },

    resetPassword: async (resetToken, newPass) => {
        return await userService.resetPassword(resetToken, newPass);
    }
};

module.exports = customerAuthService;
