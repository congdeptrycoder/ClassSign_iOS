'use strict';

const express = require('express');
const { sendSuccess } = require('../response');

const router = express.Router();

router.get('/', (_req, res) => {
    return sendSuccess(res, {
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});

module.exports = router;
