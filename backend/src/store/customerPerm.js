module.exports = [
    { url: '/api/auth/login', http_method: 'POST', description: 'Customer login' },
    { url: '/api/auth/register', http_method: 'POST', description: 'Customer registration' },
    { url: '/api/auth/me', http_method: 'GET', description: 'Get customer profile' },
    { url: '/api/auth/refresh', http_method: 'POST', description: 'Refresh token' },
    { url: '/api/auth/authenticate/verify', http_method: 'POST', description: 'Verify OTP for 2FA' },
    { url: '/api/account-recovery/request', http_method: 'POST', description: 'Request for reset password OTP' },
    { url: '/api/account-recovery/verifyOTP', http_method: 'POST', description: 'Verify OTP for reset password' },
    { url: '/api/auth/account-recovery/reset-password', http_method: 'POST', description: 'Reset Password' },

    { url: '/api/customer/profile', http_method: 'GET', description: 'Get profile' },
    { url: '/api/customer/profile', http_method: 'PUT', description: 'Update profile' },
    { url: '/api/customer/profile/change-password', http_method: 'PUT', description: 'Change password' },
    { url: '/api/customer/profile/avatar', http_method: 'POST', description: 'Upload avatar' },
    { url: '/api/profile/toggle2fa', http_method: 'POST', description: 'Toggle 2FA' },

    { url: '/api/customer/locations', http_method: 'GET', description: 'Get all locations' },
    { url: '/api/customer/locations/:id', http_method: 'GET', description: 'Get location by ID' },
    { url: '/api/customer/locations', http_method: 'POST', description: 'Create location' },
    { url: '/api/customer/locations/:id', http_method: 'PUT', description: 'Update location' },
    { url: '/api/customer/locations/:id', http_method: 'DELETE', description: 'Delete location' },
    { url: '/api/customer/locations/:id/default', http_method: 'PUT', description: 'Set default location' },

    { url: '/api/customer/tickets', http_method: 'POST', description: 'Create ticket' },
    { url: '/api/customer/tickets', http_method: 'GET', description: 'Get all tickets' },
    { url: '/api/customer/tickets/:id', http_method: 'GET', description: 'Get ticket by ID' },
    { url: '/api/customer/tickets/:id/replies', http_method: 'POST', description: 'Reply to ticket' },
    { url: '/api/customer/tickets/:id/close', http_method: 'PUT', description: 'Close ticket' },

    { url: '/api/customer/products/:id/save', http_method: 'POST', description: 'Save product' },
    { url: '/api/customer/products/check', http_method: 'GET', description: 'Check saved product' },
    { url: '/api/customer/products/saved', http_method: 'GET', description: 'Get all saved products' },

    { url: '/api/customer/stores/:id/follow', http_method: 'POST', description: 'Follow store' },
    { url: '/api/customer/stores/check', http_method: 'GET', description: 'Check following store' },
    { url: '/api/customer/stores/following', http_method: 'GET', description: 'Get all following stores' },

    { url: '/api/customer/order', http_method: 'GET', description: 'Get all orders' },
    { url: '/api/customer/order/:id', http_method: 'GET', description: 'Get order by ID' },
    { url: '/api/customer/order', http_method: 'POST', description: 'Create order' }
];