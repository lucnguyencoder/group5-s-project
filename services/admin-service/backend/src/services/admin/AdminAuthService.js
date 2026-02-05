//done
const userService = require('../userService');

const adminAuthService = {
    login: async (email, password) => {
        return await userService.login(email, password, 'system');
    },
};

module.exports = adminAuthService;
