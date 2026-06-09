'use strict';

function sendSuccess(res, data = null, message) {
    return res.json({
        success: true,
        data,
        ...(message ? { message } : {}),
    });
}

function sendError(res, statusCode, message) {
    return res.status(statusCode).json({
        success: false,
        message,
    });
}

module.exports = {
    sendSuccess,
    sendError,
};
