'use strict';

const express = require('express');
const { getDb } = require('./database');
const logger = require('./logger');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');

const PORT = 3001;

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());

// CORS: cho phép Expo Go từ bất kỳ IP nào trong mạng LAN
app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Xử lý OPTIONS preflight (Express 5: dùng regex thay vì '*')
app.options(/.*/, (_req, res) => res.sendStatus(204));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/semesters', require('./routes/semesters'));
app.use('/api/academic-periods', require('./routes/academic-periods'));
app.use('/api/students', require('./routes/student-registration'));

// ── Khởi động ─────────────────────────────────────────────────────────────────
try {
    // Kết nối DB ngay khi server khởi động để phát hiện lỗi sớm
    getDb();

    app.listen(PORT, '0.0.0.0', () => {
        logger.info(`Server đang chạy tại http://0.0.0.0:${PORT}`);
        logger.info(`Health check: http://localhost:${PORT}/api/health`);
        logger.info(`Login API:    POST http://localhost:${PORT}/api/auth/login`);
    });
} catch (err) {
    logger.error('Không thể khởi động server', { error: err.message });
    process.exit(1);
}
