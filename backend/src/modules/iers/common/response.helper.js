/**
 * Formats a successful API response.
 */
exports.success = (res, data, message = 'Operation successful', status = 200) => {
    return res.status(status).json({
        success: true,
        message,
        data
    });
};

/**
 * Formats an error API response.
 */
exports.error = (res, message = 'Internal Server Error', status = 500, errors = null) => {
    return res.status(status).json({
        success: false,
        message,
        errors
    });
};

/**
 * Specifically for permission-related errors.
 */
exports.forbidden = (res, message = 'Forbidden: Insufficient permissions') => {
    return this.error(res, message, 403);
};
