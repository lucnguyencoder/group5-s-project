module.exports = [
    { url: '/api/auth/login', http_method: 'POST', description: 'Sale agent login' },
    { url: '/api/auth/me', http_method: 'GET', description: 'Get sale agent profile' },
    { url: '/api/auth/refresh', http_method: 'POST', description: 'Refresh token' },

    { url: '/api/store/me', http_method: 'GET', description: 'Get current store information' },

    { url: '/api/store/order', http_method: 'GET', description: 'View all store orders' },
    { url: '/api/store/order/:id', http_method: 'GET', description: 'View order details' },
    { url: '/api/store/order/:id', http_method: 'PUT', description: 'Update order status' },

    { url: '/api/store/foods', http_method: 'GET', description: 'View store foods' },
    { url: '/api/store/foods/:foodId', http_method: 'GET', description: 'View food item details' },

    { url: '/api/store/categories', http_method: 'GET', description: 'View store categories' },
    { url: '/api/store/categories/:id', http_method: 'GET', description: 'View category details' },
];