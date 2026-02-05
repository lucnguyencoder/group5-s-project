module.exports = [
    { url: '/api/auth/login', http_method: 'POST', description: 'User login' },
    { url: '/api/auth/register', http_method: 'POST', description: 'User registration' },
    { url: '/api/account-recovery/request', http_method: 'POST', description: 'Request for reset password OTP' },
    { url: '/api/account-recovery/verifyOTP', http_method: 'POST', description: 'Verify OTP for reset password' },
    { url: '/api/auth/account-recovery/reset-password', http_method: 'POST', description: 'Reset Password' },

    { url: '/api/products', http_method: 'GET', description: 'Browse products' },
    { url: '/api/products/:id', http_method: 'GET', description: 'View product details' },

    { url: '/api/stores', http_method: 'GET', description: 'Browse stores' },
    { url: '/api/stores/:id', http_method: 'GET', description: 'View store details' }
];