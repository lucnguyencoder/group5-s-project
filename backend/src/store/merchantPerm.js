module.exports = [
    { url: '/api/auth/login', http_method: 'POST', description: 'Merchant login' },
    { url: '/api/auth/me', http_method: 'GET', description: 'Get merchant profile' },
    { url: '/api/auth/refresh', http_method: 'POST', description: 'Refresh token' },

    { url: '/api/store/me', http_method: 'GET', description: 'Get current store information' },
    { url: '/api/store/profile', http_method: 'GET', description: 'View store profile' },
    { url: '/api/store/profile/update', http_method: 'PUT', description: 'Update store profile' },
    { url: '/api/store/profile/config', http_method: 'GET', description: 'Get store profile config' },
    { url: '/api/store/profile/config', http_method: 'POST', description: 'Update store profile config' },

    { url: '/api/store/foods', http_method: 'GET', description: 'View store foods' },
    { url: '/api/store/foods', http_method: 'POST', description: 'Create food item' },
    { url: '/api/store/foods/:foodId', http_method: 'GET', description: 'View food item details' },
    { url: '/api/store/foods/:foodId', http_method: 'PUT', description: 'Update food item' },
    { url: '/api/store/foods/:foodId', http_method: 'DELETE', description: 'Delete food item' },

    { url: '/api/store/categories', http_method: 'GET', description: 'View store categories' },
    { url: '/api/store/categories', http_method: 'POST', description: 'Create category' },
    { url: '/api/store/categories/:id', http_method: 'GET', description: 'View category details' },
    { url: '/api/store/categories/:id', http_method: 'PUT', description: 'Update category' },
    { url: '/api/store/categories/:id', http_method: 'DELETE', description: 'Delete category' },
    { url: '/api/store/categories/:id/add-food', http_method: 'POST', description: 'Add food to category' },

    { url: '/api/store/order', http_method: 'GET', description: 'View all store orders' },
    { url: '/api/store/order/:id', http_method: 'GET', description: 'View order details' },
    { url: '/api/store/order/:id', http_method: 'PUT', description: 'Update order status' },

    { url: '/api/store/staff', http_method: 'GET', description: 'View store staff' },
    { url: '/api/store/staff', http_method: 'POST', description: 'Add store staff' },
    { url: '/api/store/staff/:staffId', http_method: 'PUT', description: 'Update staff' },
    { url: '/api/store/staff/:staffId', http_method: 'GET', description: 'Get staff details' },
    { url: '/api/store/staff/:staffId', http_method: 'DELETE', description: 'Remove staff' },
    { url: '/api/store/staff/change-role/:staffId', http_method: 'PUT', description: 'Change staff role' },

    { url: '/api/store/discount', http_method: 'GET', description: 'View store discounts' },
    { url: '/api/store/discount', http_method: 'POST', description: 'Create discount' },
    { url: '/api/store/discount/:id', http_method: 'GET', description: 'View discount details' },
    { url: '/api/store/discount/:id', http_method: 'PUT', description: 'Update discount' },
    { url: '/api/store/discount/:id', http_method: 'DELETE', description: 'Delete discount' },

    { url: '/api/store/tickets', http_method: 'POST', description: 'Create support ticket' },
    { url: '/api/store/tickets', http_method: 'GET', description: 'View own tickets' },
    { url: '/api/store/tickets/:id', http_method: 'GET', description: 'View ticket details' },
    { url: '/api/store/tickets/:id/reply', http_method: 'POST', description: 'Reply ticket' },
    { url: '/api/store/tickets/:id/close', http_method: 'PUT', description: 'Close ticket' },

    { url: '/api/store/custom/:storeId', http_method: 'GET', description: 'Get store customization data' },
    { url: '/api/store/custom/', http_method: 'PUT', description: 'Update store customization data' },
    { url: '/api/store/custom/', http_method: 'POST', description: 'Create store customization data' },
    { url: '/api/store/custom/', http_method: 'DELETE', description: 'Delete store customization data' },

    // { url: '/api/store/revenue', http_method: 'GET', description: 'Get list of orders for revenue' },
    // { url: '/api/store/dashboard', http_method: 'GET', description: 'View store dashboard' },
];