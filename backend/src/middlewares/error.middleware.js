const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const nodeEnv = process.env.NODE_ENV || 'development';

    res.status(statusCode).json({
        success: false,
        message,
        stack: nodeEnv === 'development' ? err.stack : undefined,
    });
};

module.exports = errorMiddleware;
