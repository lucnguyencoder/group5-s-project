const storeAuthService = require('../../services/store/StoreAuthService');
const { JWT_COOKIE_NAME, setCookie, clearCookie } = require('../../config/cookie');
const { consola } = require('consola');

const storeAuthController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await storeAuthService.login(email, password);

            if (result.success) {
                setCookie(res, JWT_COOKIE_NAME, result.data.token);
            }

            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            consola.error('Store login error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during login'
            });
        }
    },
};

module.exports = storeAuthController;
