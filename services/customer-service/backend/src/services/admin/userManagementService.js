//done
const {
    User,
    UserGroup,
    CustomerProfile,
    SystemProfile,
} = require('../../models');
const { sequelize } = require('../../config/db');
const { Op } = require('sequelize');
const { changePasswordNotification } = require('../EmailSender');

class UserManagementService {
    async getAllUsers(filters = {}, itemPerPage = 20, page = 1) {

        const w = {};

        if (filters.email) {
            w.email = { [Op.like]: `%${filters.email}%` };
        }

        let groupInclude = { model: UserGroup, as: 'group' };

        if (filters.user_type) {
            groupInclude.where = { type: filters.user_type };
        }

        if (filters.is_active !== undefined) {
            w.is_active = filters.is_active;
        }

        const offset = (page - 1) * itemPerPage;

        const totalCount = await User.count({
            where: w,
            include: [groupInclude]
        });

        const totalPages = Math.ceil(totalCount / itemPerPage);

        const users = await User.findAll({
            where: w,
            attributes: { exclude: ['password_hash'] },
            include: [groupInclude],
            limit: itemPerPage,
            offset: offset
        });

        return {
            users,
            currentPage: page,
            itemPerPage,
            totalPages,
            totalCount
        };
    }

    async getUserById(id) {
        const user = await User.findOne({
            where: { id },
            attributes: { exclude: ['password_hash'] },
            include: [
                { model: UserGroup, as: 'group' }
            ]
        });

        if (!user) {
            return null;
        }

        let profile = null;
        const userGroup = user.group ? user.group : null;
        const userType = userGroup ? userGroup.type : null;

        if (userType === 'customer') {
            profile = await CustomerProfile.findOne({ where: { user_id: user.id } });
        } else if (userType === 'system') {
            profile = await SystemProfile.findOne({ where: { user_id: user.id } });
        }

        const userData = user.toJSON();
        userData.profile = profile;
        userData.user_type = userType;

        return userData;
    }

    async createUser(userData) {
        const transaction = await sequelize.transaction();

        try {
            const { email, password, group_id, profile_data } = userData;

            const existingUser = await User.findOne({
                where: { email },
                transaction
            });

            if (existingUser) {
                throw new Error('User with this email already exists');
            }


            const group = await UserGroup.findByPk(group_id, { transaction });
            if (!group) {
                throw new Error(`User group with ID ${group_id} not found`);
            }

            const userType = group.type;
            if (userType === 'store') {
                throw new Error('Store account creation is not supported.');
            }

            const newUser = await User.create({
                email,
                password_hash: password,
                group_id: group_id,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction });

            await this._createUserProfile(newUser.id, userType, profile_data, transaction);
            await transaction.commit();

            return {
                id: newUser.id,
                email: newUser.email,
                user_type: userType,
                group_id: group_id
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateUser(id, updateData) {
        const transaction = await sequelize.transaction();

        try {
            const user = await User.findByPk(id, { transaction });

            if (!user) {
                throw new Error('User not found');
            }

            if (updateData.password) {
                user.password_hash = updateData.password;
            }

            user.updated_at = new Date();
            user.password_hash = updateData.password;
            await user.save({ transaction });
            await changePasswordNotification(user.email, updateData.password);
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async toggleUser(id, currentUserId) {
        const transaction = await sequelize.transaction();

        try {
            const user = await User.findByPk(id, { transaction });

            if (!user) {
                throw new Error('User not found');
            }

            if (user.id === currentUserId) {
                throw new Error('Cannot modify your own account status');
            }

            user.is_active = !user.is_active;
            user.updated_at = new Date();
            await user.save({ transaction });

            await transaction.commit();


            return {
                id: user.id,
                is_active: user.is_active
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async _createUserProfile(userId, userType, profileData, transaction) {
        console.log(profileData.phone_number);
        if (userType === 'customer' && profileData) {
            await CustomerProfile.create({
                user_id: userId,
                full_name: profileData.full_name || 'New Customer',
                gender: profileData.gender,
                date_of_birth: profileData.date_of_birth,
                is_verified: profileData.is_verified !== undefined ? profileData.is_verified : true,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction });
        } else if (userType === 'system' && profileData) {
            await SystemProfile.create({
                user_id: userId,
                full_name: profileData.full_name || 'System User',
                role_title: profileData.role_title,
                department: profileData.department,
                employee_id: profileData.employee_id,
                phone_number: profileData.phone_number,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction });
        }
        else {

        }
    }

    async _updateUserProfile(userId, userType, profileData, transaction) {
        if (userType === 'customer') {
            await CustomerProfile.update(profileData, {
                where: { user_id: userId },
                transaction
            });
        } else if (userType === 'system') {
            await SystemProfile.update(profileData, {
                where: { user_id: userId },
                transaction
            });
        }
    }
}

module.exports = new UserManagementService();
