'use strict';

const express = require('express');
const { getDb } = require('../database');
const logger = require('../logger');
const { sendError, sendSuccess } = require('../response');

const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        logger.warn('Thiếu username hoặc password trong request đăng nhập');
        return sendError(
            res,
            400,
            'Vui lòng nhập đầy đủ tài khoản và mật khẩu.'
        );
    }

    try {
        const db = getDb();
        const account = db.prepare(
            `SELECT id, username, name, role, id_card
             FROM accounts
             WHERE username = ? AND password = ? AND is_active = 1`
        ).get(username, password);

        if (!account) {
            logger.warn('Đăng nhập thất bại', { username });
            return sendError(
                res,
                401,
                'Tài khoản hoặc mật khẩu không đúng.'
            );
        }

        logger.info('Đăng nhập thành công', {
            id: account.id,
            role: account.role,
        });

        return sendSuccess(res, {
            user: {
                id: account.id,
                username: account.username,
                name: account.name,
                role: account.role,
                id_card: account.id_card,
            },
        });
    } catch (err) {
        logger.error('Lỗi server khi xử lý đăng nhập', { error: err.message });
        return sendError(res, 500, 'Lỗi server. Vui lòng thử lại sau.');
    }
});

module.exports = router;
