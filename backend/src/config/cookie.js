//done
const defaultCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 * 30, 
    path: '/'
};

const JWT_COOKIE_NAME = 'auth_token';

const setCookie = (res, name, value, options = {}) => {
    res.cookie(name, value, {
        ...defaultCookieOptions,
        ...options
    });
};

const clearCookie = (res, name, options = {}) => {
    res.clearCookie(name, {
        ...defaultCookieOptions,
        ...options
    });
};

module.exports = {
    defaultCookieOptions,
    JWT_COOKIE_NAME,
    setCookie,
    clearCookie
};
