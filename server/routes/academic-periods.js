'use strict';

const express = require('express');
const { getDb } = require('../database');
const logger = require('../logger');
const { sendError, sendSuccess } = require('../response');

const router = express.Router();

function updateExpiredPeriods(db) {
    try {
        const now = new Date().toISOString().slice(0, 16).replace('T', ' ');

        const expireInfo = db.prepare(`
            UPDATE academic_periods
            SET is_active = 0, updated_at = CURRENT_TIMESTAMP
            WHERE is_active = 1 AND end_date <= ?
        `).run(now);

        const activateInfo = db.prepare(`
            UPDATE academic_periods
            SET is_active = 1, updated_at = CURRENT_TIMESTAMP
            WHERE is_active = 0 AND start_date <= ? AND end_date > ?
        `).run(now, now);

        if (expireInfo.changes > 0 || activateInfo.changes > 0) {
            logger.info(`Đã cập nhật ${expireInfo.changes} giai đoạn hết hạn, ${activateInfo.changes} giai đoạn bắt đầu.`);
        }
    } catch (err) {
        logger.error('Lỗi khi cập nhật trạng thái giai đoạn', {
            error: err.message,
        });
    }
}

router.get('/', (_req, res) => {
    try {
        const db = getDb();
        updateExpiredPeriods(db);

        const periods = db.prepare(`
            SELECT
                p.id,
                p.semester as semesterId,
                p.period_type,
                p.start_date,
                p.end_date,
                p.is_active,
                s.semester as semesterName
            FROM academic_periods p
            LEFT JOIN semesters s ON p.semester = s.id
            ORDER BY p.id DESC
        `).all();

        const data = periods.map(period => ({
            id: String(period.id),
            semesterId: period.semesterId,
            semesterName: period.semesterName ? String(period.semesterName) : '',
            type: period.period_type === 'register_class' ? 'class' : 'course',
            startTime: period.start_date,
            endTime: period.end_date,
            isActive: period.is_active,
        }));

        return sendSuccess(res, data);
    } catch (err) {
        logger.error('Lỗi khi lấy danh sách academic periods', {
            error: err.message,
        });
        return sendError(res, 500, 'Lỗi server khi lấy giai đoạn đăng ký.');
    }
});

router.post('/', (req, res) => {
    try {
        const { semesterId, type, startTime, endTime } = req.body;

        if (!semesterId || !type || !startTime || !endTime) {
            return sendError(res, 400, 'Thiếu thông tin yêu cầu.');
        }

        const db = getDb();
        const periodType = type === 'class' ? 'register_class' : 'register_program';

        // Check for overlaps
        const overlap = db.prepare(`
            SELECT id FROM academic_periods
            WHERE period_type = ? 
              AND (? <= end_date) 
              AND (? >= start_date)
        `).get(periodType, startTime, endTime);

        if (overlap) {
            return sendError(res, 400, 'alarm_one_choose');
        }

        const now = new Date();
        const start = new Date(startTime.replace(' ', 'T'));
        const end = new Date(endTime.replace(' ', 'T'));
        const isActive = (now >= start && now <= end) ? 1 : 0;

        const createPeriod = db.transaction(() => {
            const result = db.prepare(`
                INSERT INTO academic_periods (semester, period_type, start_date, end_date, is_active)
                VALUES (?, ?, ?, ?, ?)
            `).run(semesterId, periodType, startTime, endTime, isActive);

            return result.lastInsertRowid;
        });

        const newId = createPeriod();

        return sendSuccess(
            res,
            { id: String(newId) },
            'Tạo kế hoạch thành công.'
        );
    } catch (err) {
        logger.error('Lỗi khi tạo academic period', { error: err.message });
        return sendError(res, 500, 'Lỗi server khi lưu dữ liệu.');
    }
});

router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { semesterId, type, startTime, endTime } = req.body;

        if (!semesterId || !type || !startTime || !endTime) {
            return sendError(res, 400, 'Thiếu thông tin yêu cầu.');
        }

        const periodType = type === 'class' ? 'register_class' : 'register_program';
        const db = getDb();

        // Check for overlaps
        const overlap = db.prepare(`
            SELECT id FROM academic_periods
            WHERE id != ? 
              AND period_type = ?
              AND (? <= end_date) 
              AND (? >= start_date)
        `).get(id, periodType, startTime, endTime);

        if (overlap) {
            return sendError(res, 400, 'alarm_one_choose');
        }

        const now = new Date();
        const start = new Date(startTime.replace(' ', 'T'));
        const end = new Date(endTime.replace(' ', 'T'));
        const isActive = (now >= start && now <= end) ? 1 : 0;

        db.prepare(`
            UPDATE academic_periods
            SET semester = ?,
                period_type = ?,
                start_date = ?,
                end_date = ?,
                is_active = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(semesterId, periodType, startTime, endTime, isActive, id);

        updateExpiredPeriods(db);

        return sendSuccess(res, null, 'Cập nhật thành công.');
    } catch (err) {
        logger.error('Lỗi khi cập nhật academic period', { error: err.message });
        return sendError(res, 500, 'Lỗi server khi cập nhật dữ liệu.');
    }
});

router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const db = getDb();

        db.prepare('DELETE FROM academic_periods WHERE id = ?').run(id);

        return sendSuccess(res, null, 'Đã xóa kế hoạch đăng ký.');
    } catch (err) {
        logger.error('Lỗi khi xóa academic period', { error: err.message });
        return sendError(res, 500, 'Lỗi server khi xóa dữ liệu.');
    }
});

module.exports = {
    router,
    updateExpiredPeriods
};
