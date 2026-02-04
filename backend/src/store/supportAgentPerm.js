// Support agent permissions
module.exports = [
    { url: '/api/admin/tickets/all', http_method: 'GET', description: 'View all tickets' },
    { url: '/api/admin/tickets/:id', http_method: 'GET', description: 'View ticket details' },
    { url: '/api/admin/tickets/:id/reply', http_method: 'POST', description: 'Reply to ticket' },
    { url: '/api/admin/tickets/:id', http_method: 'PUT', description: 'Update ticket status or details' },
    { url: '/api/admin/tickets/:id/close', http_method: 'PUT', description: 'Close ticket' }
];
