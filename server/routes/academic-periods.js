'use strict';

const express = require('express');
const { getDb } = require('../database');
const logger = require('../logger');

const router = express.Router();

// Helper để cập nhật các kế hoạch đã hết hạn
function updateExpiredPeriods(db) {
    try {
        const now = new Date().toISOString().slice(0, 16).replace('T', ' '); // YYYY-MM-DD HH:mm
        // Cập nhật is_active = 0 cho những bản ghi đang active nhưng end_date <= now
        const info = db.prepare(`
            UPDATE academic_periods 
            SET is_active = 0, updated_at = CURRENT_TIMESTAMP 
            WHERE is_active = 1 AND end_date <= ?
        `).run(now);
        if (info.changes > 0) {
            logger.info(`Đã cập nhật ${info.changes} kế hoạch thành ĐÃ KẾT THÚC.`);
        }
    } catch (err) {
        logger.error('Lỗi khi cập nhật kế hoạch hết hạn:', { error: err.message });
    }
}

// Lấy danh sách các kế hoạch đăng ký
router.get('/', (req, res) => {
    try {
        const db = getDb();
        
        // 1. Cập nhật is_active = 0 cho các kế hoạch đã qua end_date
        updateExpiredPeriods(db);
        
        // 2. Truy vấn danh sách
        const periods = db.prepare(`
            SELECT p.id, p.semester as semesterId, p.period_type, p.start_date, p.end_date, p.is_active, s.semester as semesterName
            FROM academic_periods p
            LEFT JOIN semesters s ON p.semester = s.id
            ORDER BY p.id DESC
        `).all();
        
        // Map về định dạng cho Frontend
        const data = periods.map(p => ({
            id: String(p.id),
            semesterId: p.semesterId,
            semesterName: p.semesterName ? String(p.semesterName) : '',
            type: p.period_type === 'register_class' ? 'class' : 'course',
            startTime: p.start_date,
            endTime: p.end_date,
            isActive: p.is_active
        }));

        res.json({ success: true, data });
    } catch (err) {
        logger.error('Lỗi khi lấy danh sách academic periods:', { error: err.message });
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Tạo mới kế hoạch đăng ký
router.post('/', (req, res) => {
    try {
        const { semesterId, type, startTime, endTime } = req.body;
        
        if (!semesterId || !type || !startTime || !endTime) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin yêu cầu.' });
        }

        const db = getDb();
        const periodType = type === 'class' ? 'register_class' : 'register_program';
        
        // Bắt đầu transaction
        const createPeriod = db.transaction(() => {
            // Set tất cả các active hiện tại thành 0
            db.prepare(`UPDATE academic_periods SET is_active = 0 WHERE is_active = 1`).run();
            
            // Insert mới với is_active = 1
            const result = db.prepare(`
                INSERT INTO academic_periods (semester, period_type, start_date, end_date, is_active)
                VALUES (?, ?, ?, ?, 1)
            `).run(semesterId, periodType, startTime, endTime);
            
            return result.lastInsertRowid;
        });
        
        const newId = createPeriod();
        
        res.json({ success: true, data: { id: String(newId) }, message: 'Tạo kế hoạch thành công.' });
    } catch (err) {
        logger.error('Lỗi khi tạo academic period:', { error: err.message });
        res.status(500).json({ success: false, message: 'Lỗi server khi lưu dữ liệu.' });
    }
});

// Cập nhật kế hoạch
router.put('/:id', (req, res) => {
    try {
        const id = req.params.id;
        const { semesterId, type, startTime, endTime } = req.body;
        
        const periodType = type === 'class' ? 'register_class' : 'register_program';
        const db = getDb();
        
        db.prepare(`
            UPDATE academic_periods
            SET semester = ?, period_type = ?, start_date = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(semesterId, periodType, startTime, endTime, id);
        
        // Cũng kiểm tra xem có hết hạn chưa sau khi update
        updateExpiredPeriods(db);
        
        res.json({ success: true, message: 'Cập nhật thành công.' });
    } catch (err) {
        logger.error('Lỗi khi cập nhật academic period:', { error: err.message });
        res.status(500).json({ success: false, message: 'Lỗi server.' });
    }
});

// Xóa kế hoạch
router.delete('/:id', (req, res) => {
    try {
        const id = req.params.id;
        const db = getDb();
        db.prepare('DELETE FROM academic_periods WHERE id = ?').run(id);
        res.json({ success: true, message: 'Đã xóa kế hoạch đăng ký.' });
    } catch (err) {
        logger.error('Lỗi khi xóa academic period:', { error: err.message });
        res.status(500).json({ success: false, message: 'Lỗi server khi xóa dữ liệu.' });
    }
});

module.exports = router;
