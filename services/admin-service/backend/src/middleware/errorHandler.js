//done
const errorHandler = (err, req, res, next) => {
    if (err.name === 'PathToRegexpError' || err.message.includes('path-to-regexp')) {
        return res.status(500).json({
            success: false,
            message: 'Invalid route pattern',
            error: 'Route configuration error - contact administrator'
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.stack
    });
};



module.exports = {
    errorHandler
};
