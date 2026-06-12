'use strict';

const express = require('express');
const { getDb } = require('../database');
const logger = require('../logger');
const { sendError, sendSuccess } = require('../response');

const router = express.Router();

/**
 * GET /api/admin/course-registration-stats?semester=<semesterId>
 * Trả về thống kê số lượng sinh viên đăng ký học phần theo học kỳ.
 */
router.get('/course-registration-stats', (req, res) => {
    try {
        const semester = Number(req.query.semester);
        if (!semester) {
            return sendError(res, 400, 'Thiếu tham số semester');
        }

        const db = getDb();

        const rows = db.prepare(`
            SELECT
                c.id            AS course_id,
                c.course_code   AS ma_hp,
                c.course_name   AS ten_hp,
                m.major_name    AS truong_khoa,
                COUNT(DISTINCT sc.student_id) AS so_luong_dang_ky,
                COALESCE(cls.so_luong_lop, 0) AS so_luong_lop,
                COALESCE(cls.so_luong_dk_toi_da, 0) AS so_luong_dk_toi_da
            FROM courses c
            JOIN student_courses sc ON c.id = sc.course_id
            LEFT JOIN (
                SELECT course_id, semester, COUNT(id) AS so_luong_lop, SUM(total_slots) AS so_luong_dk_toi_da
                FROM classes_course
                GROUP BY course_id, semester
            ) cls ON c.id = cls.course_id AND sc.semester = cls.semester
            LEFT JOIN (
                SELECT course_id, MIN(program_id) AS program_id
                FROM program_course
                GROUP BY course_id
            ) pc ON c.id = pc.course_id
            LEFT JOIN programs p ON pc.program_id = p.id
            LEFT JOIN majors m ON p.major_id = m.id
            WHERE sc.semester = ?
            GROUP BY c.id, c.course_code, c.course_name, m.major_name, cls.so_luong_lop, cls.so_luong_dk_toi_da
        `).all(semester);

        return sendSuccess(res, rows, 'Lấy thống kê thành công');
    } catch (err) {
        logger.error('Lỗi khi lấy thống kê đăng ký học phần', { error: err.message });
        return sendError(res, 500, 'Lỗi server khi lấy thống kê.');
    }
});

module.exports = router;
