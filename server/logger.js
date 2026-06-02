'use strict';

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'server.log');

// Tạo thư mục logs nếu chưa có
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Ghi log ra file và console.
 * @param {'INFO'|'ERROR'|'WARN'} level
 * @param {string} message
 * @param {any} [data]
 */
function log(level, message, data) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    const line = `[${timestamp}] [${level}] ${message}${dataStr}\n`;

    // Ghi ra console
    if (level === 'ERROR') {
        console.error(line.trim());
    } else {
        console.log(line.trim());
    }

    // Ghi ra file log (async để không block)
    fs.appendFile(LOG_FILE, line, (err) => {
        if (err) console.error('[LOGGER] Không thể ghi log file:', err.message);
    });
}

module.exports = {
    info: (msg, data) => log('INFO', msg, data),
    error: (msg, data) => log('ERROR', msg, data),
    warn: (msg, data) => log('WARN', msg, data),
};
