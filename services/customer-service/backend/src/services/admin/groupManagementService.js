//done
const { UserGroup, Permission, UserGroupPermission } = require('../../models');
const { sequelize } = require('../../config/db');
const { Op } = require('sequelize');

const GroupManagementService = {
    getAllGroups: async (filters = {}) => {
        try {
            const whereConditions = {};
            if (filters.name) {
                whereConditions.name = { [Op.like]: `%${filters.name}%` };
            }
            if (filters.type !== undefined) {
                whereConditions.type = filters.type;
            }

            const groups = await UserGroup.findAll({
                where: whereConditions,
            });

            return {
                success: true,
                groups
            };
        } catch (error) {
            return {
                success: false,
                message: 'Server error fetching groups'
            };
        }
    },

    //
    getGroupById: async (id) => {
        try {
            const result = await UserGroup.findByPk(id, {
            });
            if (!result) {
                return {
                    status: 404,
                    success: false,
                    message: 'Failed to get group'
                }
            }
            return {
                status: 200,
                success: true,
                message: 'Get Group Successfully',
                data: result
            }
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Server error fetching group'
            }
        }
    },

    getAllPermission: async () => {
        try {
            const result = await Permission.findAll();
            if (result) {
                return {
                    status: 200,
                    success: true,
                    data: result
                }
            }
            return {
                status: 404,
                success: false,
            }
        }
        catch (error) {
            return {
                status: 500,
                success: false
            }
        }
    },

    getPermissionByGroupId: async (id) => {
        try {
            const result = await UserGroup.findByPk(id, {
                include: [
                    {
                        model: Permission,
                        as: 'permissions',
                        through: { attributes: [] }
                    }
                ]
            });
            if (result) {
                return {
                    status: 200,
                    success: true,
                    data: result.permissions
                }
            }
            return {
                status: 404,
                success: false,
            }
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: "Server error fetching group"
            }
        }
    },

    addPermission: async (permission_id, group_id) => {
        try {
            const check = await UserGroupPermission.findOne({
                where: { group_id: group_id, permission_id: permission_id }
            });
            if (check) {
                return {
                    status: 409,
                    success: false,
                    message: 'Permission already exists for this group'
                };
            }
            const data = await UserGroupPermission.create({
                group_id: group_id,
                permission_id: permission_id
            })
            if (data) {
                return {
                    status: 200,
                    success: true,
                }
            }
            return {
                status: 404,
                success: false,
            }
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Server error adding permission'
            }
        }
    },

    removePermission: async (permission_id, group_id) => {
        const t = await sequelize.transaction();
        try {
            const checkId = await UserGroupPermission.findOne({
                where: { group_id: group_id, permission_id: permission_id }
            });
            if (!checkId) {
                return {
                    status: 404,
                    success: false,
                    message: 'Permission not found'
                };
            }
            const data = await UserGroupPermission.destroy({
                where: { group_id: group_id, permission_id: permission_id }
            }, { transaction: t });
            if (data > 0) {
                await t.commit();
                return {
                    status: 200,
                    success: true,
                }
            }
            await t.rollback();
            return {
                status: 404,
                success: false,
            }
        }
        catch (error) {
            await t.rollback();
            return {
                status: 500,
                success: false,
                message: 'Server error removing permission'
            }
        }
    },

    updateGroup: async (id, groupData) => {
        try {
            const group = await UserGroup.findByPk(id);
            if (!group) {
                return {
                    status: 404,
                    success: false,
                    message: 'Group not found'
                };
            }
            const existingGroup = await UserGroup.findOne({
                where: {
                    name: groupData.name,
                    id: { [Op.ne]: id }
                }
            });
            if (existingGroup) {
                return {
                    status: 409,
                    success: false,
                    message: 'Group with this name already exists'
                };
            }
            await group.update(groupData);
            return {
                status: 200,
                success: true,
                message: 'Group updated successfully',
                data: group
            };
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Server error updating group'
            };
        }
    },

    addUserGroup: async (groupData) => {
        try {
            const check = await UserGroup.findOne({
                where: { name: groupData.name }
            });
            if (check) {
                return {
                    status: 409,
                    success: false,
                    message: 'Group already exists'
                };
            }
            const result = await UserGroup.create({
                name: groupData.name,
                type: groupData.type,
                description: groupData.description,
                created_at: new Date(),
            })
            if (result) {
                return {
                    status: 200,
                    success: true,
                    message: 'Added successfully',
                    groupId: result.id
                }
            }
            return {
                status: 400,
                success: false,
                message: 'Failed to add' + result,
            }
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Server error adding group'
            };
        }
    }
}

module.exports = GroupManagementService;
