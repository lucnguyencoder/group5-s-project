//done
const { User, UserGroup, Permission, UserGroupPermission } = require('../models');
const { consola } = require('consola');

const matchesUrlPattern = (requestUrl, permissionUrl) => {
    try {
        if (permissionUrl === '*') {
            return true;
        }
        const patternRegex = permissionUrl
            .replace(/:[^/]+/g, '[^/]+')
            .replace(/\//g, '\\/');

        const regex = new RegExp(`^${patternRegex}$`);
        return regex.test(requestUrl);
    } catch (error) {
        consola.error(`Error matching URL pattern: ${permissionUrl}`, error);
        return false;
    }
};

const getUserPermissions = async (userId) => {
    try {
        const user = await User.findByPk(userId, {
            include: [{
                model: UserGroup,
                as: 'group',
                include: [{
                    model: Permission,
                    as: 'permissions',
                    through: { attributes: [] }
                }]
            }]
        });

        if (!user || !user.group || !user.group.permissions) {
            return [];
        }

        return user.group.permissions.map(permission => ({
            url: permission.url,
            http_method: permission.http_method,
            description: permission.description
        }));
    } catch (error) {
        consola.error('Error fetching user permissions:', error);
        return [];
    }
};

const requirePermission = (specificUrl = null, specificMethod = null) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const curl = specificUrl || req.originalUrl || req.url;
            const methodToCheck = specificMethod || req.method;

            const userPermissions = await getUserPermissions(req.user.id);

            if (userPermissions.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }

            const hasAccess = userPermissions.some(permission => {
                return permission.http_method === methodToCheck &&
                    matchesUrlPattern(curl, permission.url);
            });

            if (!hasAccess) {
                // consola.warn(`Access denied for user ${req.user.id} to ${methodToCheck} ${curl} ${spe}`);
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }
            next();
        } catch (error) {
            consola.error('Permission check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during permission check'
            });
        }
    };
};

module.exports = {
    requirePermission
};
