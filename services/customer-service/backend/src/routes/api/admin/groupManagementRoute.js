//done
const express = require('express');
const router = express.Router();
const groupManagementController = require('../../../controllers/admin/groupManagementController');
const { requirePermission } = require('../../../middleware/permission');


router.get('/',
    requirePermission('/api/admin/groups', 'GET'),
    groupManagementController.getAllGroups
);

router.put(`/:id`,
    requirePermission('/api/admin/groups/:id', 'PUT'),
    groupManagementController.updateGroup
);

router.post('/add',
    requirePermission('/api/admin/groups/add', 'POST'),
    groupManagementController.addUserGroup
);

router.get('/permission',
    requirePermission('/api/admin/groups/permission', 'GET'),
    groupManagementController.getAllPermission
)

router.get('/permission/:id',
    requirePermission('/api/admin/groups/permission/:id', 'GET'),
    groupManagementController.getPermissionByGroupId
)

router.put('/permission/add',
    requirePermission('/api/admin/groups/permission/add', 'PUT'),
    groupManagementController.addPermission
)

router.delete('/permission/delete',
    requirePermission('/api/admin/groups/permission/delete', 'DELETE'),
    groupManagementController.removePermission
)

router.get('/:id',
    requirePermission('/api/admin/groups/:id', 'GET'),
    groupManagementController.getGroupById
);

module.exports = router;
