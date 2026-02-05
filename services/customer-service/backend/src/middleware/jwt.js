//done
const jwt = require('jsonwebtoken');
const { consola } = require('consola');
const { JWT_COOKIE_NAME } = require('../config/cookie');

const JWT_SECRET = process.env.JWT_SECRET || 'yuumi';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

const verifyToken = (req, res, next) => {
    const token =
        req.headers.authorization?.split(' ')[1] ||
        req.query?.token ||
        req.cookies?.[JWT_COOKIE_NAME];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        consola.error('JWT verification error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token. Please authenticate again.'
        });
    }
};

const shortTimeToken = (user, expireTime = '1d') => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: expireTime }
    );
}

const optionalToken = (req, res, next) => {
    const token =
        req.headers.authorization?.split(' ')[1] ||
        req.query?.token ||
        req.cookies?.[JWT_COOKIE_NAME];

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        next();
    }
};

module.exports = {
    generateToken,
    verifyToken,
    optionalToken,
    shortTimeToken
};
