'use strict';

const express = require('express');
const { getDb } = require('../database');
const logger = require('../logger');
const { sendError, sendSuccess } = require('../response');

const router = express.Router();

router.get('/', (_req, res) => {
    try {
        const db = getDb();
        const semesters = db
            .prepare('SELECT id, semester FROM semesters ORDER BY semester DESC')
            .all();

        return sendSuccess(res, semesters);
    } catch (err) {
        logger.error('Lỗi khi lấy danh sách semesters', { error: err.message });
        return sendError(res, 500, 'Lỗi server khi lấy danh sách học kỳ.');
    }
});

router.post('/', (req, res) => {
    try {
        const { semester } = req.body;
        if (!semester || typeof semester !== 'string') {
            return sendError(res, 400, 'Mã kỳ không hợp lệ.');
        }

        const db = getDb();
        db.prepare('INSERT INTO semesters (semester, is_active) VALUES (?, 0)').run(semester.trim());

        logger.info(`Đã thêm học kỳ mới: ${semester}`);
        return sendSuccess(res, { message: 'Thêm kỳ thành công' }, 201);
    } catch (err) {
        logger.error('Lỗi khi thêm học kỳ', { error: err.message });
        if (err.message.includes('UNIQUE constraint failed')) {
            return sendError(res, 400, 'Học kỳ này đã tồn tại.');
        }
        return sendError(res, 500, 'Lỗi server khi thêm học kỳ.');
    }
});

module.exports = router;
