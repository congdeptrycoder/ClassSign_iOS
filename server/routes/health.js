'use strict';

const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * Kiểm tra server còn sống, dùng cho auto-detect kết nối từ Expo.
 */
router.get('/', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
