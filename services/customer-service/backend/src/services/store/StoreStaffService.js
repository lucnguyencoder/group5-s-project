//done
const { Store, StoreProfile, User, UserGroup } = require('../../models');
const { sequelize } = require('../../config/db');
const { Op } = require('sequelize');




const storeStaffService = {
    getAllStaff: async (storeId, filters, itemPerPage, page) => {
        try {
            itemPerPage = parseInt(itemPerPage);
            page = parseInt(page);

            const conditions = {
                store_id: storeId
            }
            const groupCondition = {}
            if (filters.email) {
                conditions.email = { [Op.like]: `%${filters.email}%` };
            }
            if (filters.type) {
                groupCondition.name = { [Op.eq]: `${filters.type}` };
            }
            if (filters.isCourierActive !== undefined && filters.type === 'courier') {
                if (typeof filters.isCourierActive === 'string') {
                    conditions.is_courier_active = filters.isCourierActive === 'true';
                } else {
                    conditions.is_courier_active = filters.isCourierActive;
                }
            }

            const store = await Store.findAll({
                where: { store_id: storeId }
            });
            if (!store) {
                return {
                    status: 401,
                    success: false,
                    message: 'Can not find any staff of the store'
                }
            }

            const totalCount = await StoreProfile.count({
                include: {
                    model: User,
                    as: 'user',
                    required: true,
                    include: {
                        model: UserGroup,
                        as: 'group',
                        required: true,
                        attributes: []
                    },
                    attributes: []
                },
                where: { store_id: storeId },
            });

            const totalPage = Math.ceil(totalCount / itemPerPage);

            const offSet = (page - 1) * itemPerPage;
            const staff = await StoreProfile.findAll({
                include: {
                    model: User,
                    as: 'user',
                    required: true,
                    include: {
                        model: UserGroup,
                        as: 'group',
                        where: groupCondition,
                        required: true,
                        attributes: ['name']
                    },
                    attributes: ['group_id']
                },
                where: conditions,
                offset: offSet,
                limit: itemPerPage
            });
            return {
                status: 200,
                success: true,
                currentPage: page,
                totalPage,
                staff: staff
            }
        }
        catch (error) {
            console.log(error);
            return {
                status: 500,
                success: false,
                message: 'Internal Error'
            }
        }
    },

    getStaffById: async (staffId) => {
        try {
            const staffData = await StoreProfile.findByPk(staffId,
                {
                    include: {
                        model: User,
                        as: 'user',
                        required: true,
                        attributes: ['group_id', 'is_active', 'updated_at'],
                        include: {
                            model: UserGroup,
                            as: 'group',
                            required: true,
                            attributes: ['name']
                        }
                    }
                }
            );
            if (!staffData) {
                return {
                    status: 404,
                    success: false,
                    message: 'User not found'
                }
            }
            return {
                status: 200,
                success: true,
                staff: staffData
            }
        }
        catch (error) {
            console.log(error);
            return {
                status: 500,
                success: false,
                message: 'Internal Error: ' + error
            }
        }
    },

    updateStaff: async (staffId, updateData, userId) => {
        try {
            const staff = await StoreProfile.findByPk(staffId,
                {
                    include: {
                        model: User,
                        as: 'user',
                        include: {
                            model: UserGroup,
                            as: 'group',
                            attributes: ['name']
                        }
                    }
                }
            );
            if (!staff) {
                return {
                    status: 404,
                    success: false,
                    message: 'Staff not found'
                }
            }
            //chi duoc sua neu nguoi do khong phai la manager hoac la manager sua chinh minh
            if (staff.user.group.name === 'manager' && staffId !== userId) {
                return {
                    status: 403,
                    success: false,
                    message: "You do not have permission"
                }
            }
            await staff.update(updateData);
            return {
                status: 200,
                success: true,
            }
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Internal Error: ' + error
            }
        }
    },

    createStaff: async (staffData) => {
        try {
            const { email, password, group_id, storeProfileData } = staffData;
            if (!email || !password || !group_id) {
                return {
                    status: 400,
                    success: false,
                    message: 'All fields are required'
                }
            }
            if (!storeProfileData || !storeProfileData.store_id) {
                return {
                    status: 400,
                    success: false,
                    message: 'Store ID is required'
                }
            }
            const createUser = await User.create({
                email: email,
                password_hash: password,
                group_id: group_id,
                is_active: true
            })
            if (!createUser) {
                return {
                    status: 500,
                    success: false,
                    message: 'Failed to create user'
                }
            }
            const createStoreProfile = await StoreProfile.create({
                ...storeProfileData,
                user_id: createUser.id,
            });
            if (!createStoreProfile) {
                return {
                    status: 500,
                    success: false,
                    message: 'Failed to create profile'
                }
            }
            if (!createStoreProfile) {
                return {
                    status: 500,
                    success: false,
                    message: 'Failed to create store profile'
                }
            }
            return {
                status: 201,
                success: true,
                message: 'Staff created successfully',
                staff: createStoreProfile
            }

        } catch (error) {
            console.log(error);
            return {
                status: 500,
                success: false,
                message: 'Internal Error: ' + error
            }
        }
    },
    disableStaff: async (staffId) => {
        const t = await sequelize.transaction();
        try {
            const checkStaff = await StoreProfile.findByPk(staffId, { transaction: t });
            if (!checkStaff) {
                await t.rollback();
                return {
                    status: 404,
                    success: false,
                    message: 'Could not find this staff'
                }
            }
            const user = await User.findByPk(staffId, { transaction: t });
            if (!user) {
                await t.rollback();
                return {
                    status: 404,
                    success: false,
                    message: 'Could not find user'
                }
            }
            await User.update({ is_active: !user.is_active }, { where: { id: user.id } }, { transaction: t });
            await t.commit();
            const updatedUser = await User.findByPk(user.id);
            return {
                status: 200,
                success: true,
                isActive: updatedUser.is_active
            }
        }
        catch (error) {
            await t.rollback();
            return {
                status: 500,
                success: false,
                message: 'Server Error'
            }
        }
    },

    changeRole: async (staffId, role) => {
        const t = await sequelize.transaction();
        try {
            const group = await UserGroup.findOne({ where: { id: role } })
            const check = await StoreProfile.findByPk(staffId);
            if (!check) {
                return {
                    status: 404,
                    success: false,
                    message: 'Could not find this staff'
                }
            }
            if (group.name === 'sale_agent') {
                await StoreProfile.update({
                    vehicle_plate: null,
                    vehicle_type: null
                },
                    {
                        where: {
                            user_id: staffId
                        }
                    })
            }
            await User.update(
                { group_id: role },
                { where: { id: staffId } },
                { transaction: t });

            await t.commit();
            const updated = await User.findByPk(staffId, {
                include: {
                    model: UserGroup,
                    as: 'group',
                    attributes: ['name']
                }
            });
            return {
                status: 200,
                success: true,
                role: updated.group.name
            }
        }
        catch (error) {
            await t.rollback();
            return {
                status: 500,
                success: false,
                message: 'Server Error'
            }
        }
    },

    setCheckInOut: async (staffId) => {
        try {
            const staff = await StoreProfile.findByPk(staffId);
            if (!staff) {
                return {
                    status: 404,
                    success: false,
                    message: 'Staff not found'
                }
            }
            if (staff.is_courier_active) {
                await staff.update({
                    is_courier_active: false,
                })
            }
            else {
                await staff.update({
                    is_courier_active: true,
                })
            }
            return {
                status: 200,
                success: true,
                isActive: staff.is_courier_active
            }
        }
        catch (error) {
            console.log(error);
            return {
                status: 500,
                success: false,
                message: 'Internal Error'
            }
        }
    }
}

module.exports = storeStaffService;