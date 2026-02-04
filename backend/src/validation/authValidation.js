const { commonValidation } = require("./commonValidation");

const authValidation = {
    validateRegister: (userData) => {
        const { email, password, full_name, user_type } = userData;

        if (!email || !password || !full_name || !user_type) {
            return "All fields are required";
        }

        if (typeof email !== 'string' || typeof password !== 'string' || typeof full_name !== 'string' || typeof user_type !== 'string') {
            return "Invalid input types";
        }

        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }

        if (!commonValidation.validateStringEmail(email)) {
            return "Invalid email format";
        }

        if (!['customer', 'system', 'store'].includes(user_type)) {
            return "Invalid user type";
        }

        return null;
    }
};

module.exports = { authValidation };