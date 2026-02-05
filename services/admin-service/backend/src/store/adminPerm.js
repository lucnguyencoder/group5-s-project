module.exports = [
    { url: '/api/admin/auth/login', http_method: 'POST', description: 'Admin login' },

    { url: '/api/admin/users', http_method: 'GET', description: 'View all users' },
    { url: '/api/admin/users', http_method: 'POST', description: 'Create new user' },
    { url: '/api/admin/users/:id', http_method: 'GET', description: 'View user details' },
    { url: '/api/admin/users/:id', http_method: 'PUT', description: 'Update user' },
    { url: '/api/admin/users/:id', http_method: 'DELETE', description: 'Delete user' },

    { url: '/api/admin/groups', http_method: 'GET', description: 'View all user groups' },
    { url: '/api/admin/groups/add', http_method: 'POST', description: 'Create user group' },
    { url: '/api/admin/groups/:id', http_method: 'PUT', description: 'Update user group' },
    { url: '/api/admin/groups/:id', http_method: 'GET', description: 'Get user group' },
    { url: '/api/admin/groups/permission', http_method: 'GET', description: 'Get all permissions' },
    { url: '/api/admin/groups/permission/:id', http_method: 'GET', description: 'Get permissions of a group' },
    { url: '/api/admin/groups/permission/add', http_method: 'PUT', description: 'Add permission to group' },
    { url: '/api/admin/groups/permission/delete', http_method: 'DELETE', description: 'Remove permission from group' },

    { url: '/api/admin/stores', http_method: 'GET', description: 'View all stores' },
    { url: '/api/admin/stores', http_method: 'POST', description: 'Create store' },
    { url: '/api/admin/stores/:id', http_method: 'GET', description: 'View store details' },
    { url: '/api/admin/stores/:id', http_method: 'PUT', description: 'Update store' },
    { url: '/api/admin/stores/:id/toggle-status', http_method: 'PATCH', description: 'Toggle store active status' },
    { url: '/api/admin/stores/:id/toggle-temp-closed', http_method: 'PATCH', description: 'Toggle store temporarily closed status' },

    { url: '/api/admin/profile', http_method: 'PUT', description: 'Update admin profile' },
    { url: '/api/admin/profile/change-password', http_method: 'PUT', description: 'Change admin password' },

    { url: '/api/admin/tickets/all', http_method: 'GET', description: 'View all tickets' },
    { url: '/api/admin/tickets/:id', http_method: 'GET', description: 'View ticket details' },
    { url: '/api/admin/tickets/:id/reply', http_method: 'POST', description: 'Reply to ticket' },
    { url: '/api/admin/tickets/:id', http_method: 'PUT', description: 'Update ticket status or details' },
    { url: '/api/admin/tickets/:id/close', http_method: 'PUT', description: 'Close ticket' }
];