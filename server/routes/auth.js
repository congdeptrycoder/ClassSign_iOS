'use strict';

const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const logger = require('../logger');

/**
 * POST /api/auth/login
 * Body: { username: string, password: string }
 * So sánh mật khẩu dạng TEXT thuần (chưa mã hoá).
 * Trả về thông tin account nếu hợp lệ, hoặc lỗi 401.
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        logger.warn('Thiếu username hoặc password trong request đăng nhập');
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu.',
        });
    }

    try {
        const db = getDb();

        // So sánh TEXT thuần, chưa dùng mã hoá
        const account = db.prepare(
            `SELECT id, username, name, role
             FROM accounts
             WHERE username = ? AND password = ? AND is_active = 1`
        ).get(username, password);

        if (!account) {
            logger.warn('Đăng nhập thất bại – sai tài khoản hoặc mật khẩu', { username });
            return res.status(401).json({
                success: false,
                message: 'Tài khoản hoặc mật khẩu không đúng.',
            });
        }

        logger.info('Đăng nhập thành công', { id: account.id, role: account.role });
        return res.json({
            success: true,
            user: {
                id: account.id,
                username: account.username,
                name: account.name,
                role: account.role,
            },
        });
    } catch (err) {
        logger.error('Lỗi server khi xử lý đăng nhập', { error: err.message });
        return res.status(500).json({
            success: false,
            message: 'Lỗi server. Vui lòng thử lại sau.',
        });
    }
});

module.exports = router;
