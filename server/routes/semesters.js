'use strict';

const express = require('express');
const { getDb } = require('../database');
const logger = require('../logger');

const router = express.Router();

// Lấy danh sách các học kỳ (semester)
router.get('/', (req, res) => {
    try {
        const db = getDb();
        const semesters = db.prepare('SELECT id, semester FROM semesters ORDER BY semester DESC').all();
        
        res.json({ success: true, data: semesters });
    } catch (err) {
        logger.error('Lỗi khi lấy danh sách semesters:', { error: err.message });
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách học kỳ' });
    }
});

module.exports = router;
