//done
const groupManagementService = require('../../services/admin/groupManagementService');

const GroupManagementController = {
    getAllGroups: async (req, res) => {
        try {
            const filters = {
                name: req.query.name,
                type: req.query.type !== undefined ? req.query.type : undefined
            };
            const result = await groupManagementService.getAllGroups(filters);
            return res.status(200).json({
                success: true,
                count: result.groups.length,
                data: result.groups
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error fetching groups'
            });
        }
    },

    getGroupById: async (req, res) => {
        try {
            const group = await groupManagementService.getGroupById(req.params.id);
            if (!group.success) {
                return res.status(group.status).json({
                    success: false,
                    message: 'Group not found'
                });
            }
            return res.status(200).json({
                success: true,
                data: group.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error fetching group'
            });
        }
    },

    getAllPermission: async (req, res) => {
        try {
            const result = await groupManagementService.getAllPermission();
            if (result) {
                return res.status(result.status).json({
                    success: true,
                    data: result.data
                });
            }
            return res.status(result.status).json({
                success: false,
                message: 'Failed to get Permission',
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Sever Error'
            });
        }
    },

    getPermissionByGroupId: async (req, res) => {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Group ID is required'
                });
            }
            const result = await groupManagementService.getPermissionByGroupId(id);
            if (result.success) {
                return res.status(result.status).json({
                    success: true,
                    data: result.data
                })
            };
            return res.status(result.status).json({
                success: false,
                message: result.message
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Sever Error: ' + error
            });
        }
    },

    addPermission: async (req, res) => {
        try {
            const group_id = req.body.group_id;
            const permission_id = req.body.permission_id;
            if (!group_id || !permission_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Group ID and Permission ID are required'
                });
            }
            const result = await groupManagementService.addPermission(permission_id, group_id);
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: 'Added successfully'
                });
            }
            return res.status(404).json({
                success: false,
                message: 'Failed to add'
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Sever Error: ' + error
            });
        }
    },

    removePermission: async (req, res) => {
        try {
            const group_id = req.body.group_id;
            const permission_id = req.body.permission_id;
            if (!group_id || !permission_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Group ID and Permission ID are required'
                });
            }
            const result = await groupManagementService.removePermission(permission_id, group_id);
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: 'Removed successfully'
                });
            }
            return res.status(404).json({
                success: false,
                message: 'Failed to remove'
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Sever Error: ' + error
            });
        }
    },

    updateGroup: async (req, res) => {
        try {
            const groupId = req.params.id;
            const groupData = req.body;
            if (!groupData || !groupData.name || !groupData.type) {
                return res.status(400).json({
                    success: false,
                    message: 'Group data is invalid'
                });
            }
            if (!groupId) {
                return res.status(400).json({
                    success: false,
                    message: 'Group ID is required'
                });
            }
            const result = await groupManagementService.updateGroup(groupId, groupData);
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: 'Group updated successfully',
                    data: result.data
                });
            }
            return res.status(result.status).json({
                success: false,
                message: result.message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error updating group'
            });
        }
    },

    addUserGroup: async (req, res) => {
        try {
            const groupData = req.body;
            if (!groupData || !groupData.name || !groupData.type) {
                return res.status(400).json({
                    success: false,
                    message: 'Group data is invalid'
                });
            }
            const result = await groupManagementService.addUserGroup(groupData);
            if (result.success) {
                return res.status(result.status).json({
                    success: true,
                    message: result.message,
                    groupId: result.groupId
                });
            }
            return res.status(result.status).json({
                success: false,
                message: result.message
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error adding group'
            });
        }
    }
}

module.exports = GroupManagementController;

