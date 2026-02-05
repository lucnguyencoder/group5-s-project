//done
const adminAuthService = require('../../services/admin/AdminAuthService');
const { JWT_COOKIE_NAME, setCookie } = require('../../config/cookie');
const { consola } = require('consola');

const adminAuthController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await adminAuthService.login(email, password);

            if (result.success) {
                setCookie(res, JWT_COOKIE_NAME, result.data.token);
            }

            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            consola.error('Admin login error:', error);
            return res.status(500).json({
                success: false,
                message: 'Unknown issue.'
            });
        }
    }
};

module.exports = adminAuthController;
