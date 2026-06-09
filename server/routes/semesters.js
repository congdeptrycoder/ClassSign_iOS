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

module.exports = router;
