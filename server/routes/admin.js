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

/**
 * POST /api/admin/classes
 * Tạo lớp học mới
 */
router.post('/classes', (req, res) => {
    try {
        const data = req.body;
        if (!data.ky || !data.ma_hp || !data.ma_lop || !data.sl_max) {
            return sendError(res, 400, 'Thiếu thông tin bắt buộc (kỳ học, mã HP, mã lớp, SL Max)');
        }

        const db = getDb();

        // Lấy ID trước khi insert
        const semesterRow = db.prepare(`SELECT id FROM semesters WHERE semester = ?`).get(data.ky);
        if (!semesterRow) {
            return sendError(res, 404, 'Không tìm thấy kỳ học');
        }
        const semester_id = semesterRow.id;

        const courseRow = db.prepare(`SELECT id FROM courses WHERE course_code = ?`).get(data.ma_hp);
        if (!courseRow) {
            return sendError(res, 404, 'Không tìm thấy học phần');
        }
        const course_id = courseRow.id;

        const detailJSON = JSON.stringify({
            ma_lop: data.ma_lop,
            ma_lop_kem: data.ma_lop_kem || 'NULL',
            ghi_chu: data.ghi_chu || 'NULL',
            thu: data.thu,
            tiet_bd: data.tiet_bd,
            tiet_kt: data.tiet_kt,
            buoi: data.buoi,
            phong_hoc: data.phong_hoc,
            can_tn: data.can_tn || 'NULL',
            teaching_type: data.teaching_type || 'NULL'
        });

        db.prepare(`
            INSERT INTO classes_course (course_id, semester, detail, total_slots, occupied_slots)
            VALUES (?, ?, ?, ?, 0)
        `).run(course_id, semester_id, detailJSON, data.sl_max);

        return sendSuccess(res, null, 'Tạo lớp học thành công');
    } catch (err) {
        logger.error('Lỗi khi tạo lớp học', { error: err.message });
        return sendError(res, 500, 'Lỗi server khi tạo lớp học.');
    }
});

/**
 * GET /api/admin/classes?course_id=<id>&semester=<id>
 * Lấy danh sách lớp học của một học phần trong một học kỳ.
 */
router.get('/classes', (req, res) => {
    try {
        const { course_id, semester } = req.query;
        if (!course_id || !semester) {
            return sendError(res, 400, 'Thiếu tham số course_id hoặc semester');
        }

        const db = getDb();
        const rows = db.prepare(`
            SELECT id, detail, total_slots, occupied_slots
            FROM classes_course
            WHERE course_id = ? AND semester = ?
        `).all(course_id, semester);

        return sendSuccess(res, rows, 'Lấy danh sách lớp thành công');
    } catch (err) {
        logger.error('Lỗi khi lấy danh sách lớp học', { error: err.message });
        return sendError(res, 500, 'Lỗi server khi lấy danh sách lớp.');
    }
});

/**
 * GET /api/admin/classes/all?semester=<id>
 * Lấy toàn bộ lớp học của một học kỳ để hiển thị ở bảng Dashboard.
 */
router.get('/classes/all', (req, res) => {
    try {
        const semester = Number(req.query.semester);
        if (!semester) {
            return sendError(res, 400, 'Thiếu tham số semester');
        }

        const db = getDb();
        const rows = db.prepare(`
            SELECT 
                cc.id, cc.detail, cc.total_slots, cc.occupied_slots,
                c.course_code AS ma_hp, c.course_name AS ten_hp,
                m.major_name AS khoa_truong,
                s.semester AS ky
            FROM classes_course cc
            JOIN courses c ON cc.course_id = c.id
            JOIN semesters s ON cc.semester = s.id
            LEFT JOIN (
                SELECT course_id, MIN(program_id) as program_id
                FROM program_course
                GROUP BY course_id
            ) pc ON c.id = pc.course_id
            LEFT JOIN programs p ON pc.program_id = p.id
            LEFT JOIN majors m ON p.major_id = m.id
            WHERE cc.semester = ?
        `).all(semester);

        const formattedRows = rows.map(r => {
            let detail = {};
            try {
                detail = JSON.parse(r.detail || '{}');
            } catch (e) {}

            return {
                id: r.id,
                ky: String(r.ky),
                khoa_truong: r.khoa_truong || '',
                ma_lop: detail.ma_lop || '',
                ma_lop_kem: detail.ma_lop_kem !== 'NULL' ? detail.ma_lop_kem : '',
                ma_hp: r.ma_hp || '',
                ten_hp: r.ten_hp || '',
                khoi_luong: '', 
                ghi_chu: detail.ghi_chu !== 'NULL' ? detail.ghi_chu : '',
                thu: detail.thu !== 'NULL' ? detail.thu : '',
                tiet_bd: detail.tiet_bd || '',
                tiet_kt: detail.tiet_kt || '',
                buoi: detail.buoi || '',
                phong_hoc: detail.phong_hoc || '',
                can_tn: detail.can_tn !== 'NULL' ? detail.can_tn : '',
                sl_dk: String(r.occupied_slots || 0),
                sl_max: String(r.total_slots || 0),
                trang_thai: 'Mở ĐK',
                teaching_type: detail.teaching_type !== 'NULL' ? detail.teaching_type : ''
            };
        });

        return sendSuccess(res, formattedRows, 'Lấy toàn bộ danh sách lớp thành công');
    } catch (err) {
        logger.error('Lỗi khi lấy toàn bộ lớp học', { error: err.message });
        return sendError(res, 500, 'Lỗi server khi lấy toàn bộ lớp học.');
    }
});

/**
 * DELETE /api/admin/classes/:id
 * Xoá một lớp học
 */
router.delete('/classes/:id', (req, res) => {
    try {
        const { id } = req.params;
        const db = getDb();
        
        // Cần xoá các tham chiếu ở student_class_registrations (nếu có) trước
        db.prepare('DELETE FROM student_class_registrations WHERE class_id = ?').run(id);
        
        const result = db.prepare('DELETE FROM classes_course WHERE id = ?').run(id);
        if (result.changes === 0) {
            return sendError(res, 404, 'Không tìm thấy lớp học để xoá');
        }

        return sendSuccess(res, null, 'Xoá lớp học thành công');
    } catch (err) {
        logger.error('Lỗi khi xoá lớp học', { error: err.message });
        return sendError(res, 500, 'Lỗi server khi xoá lớp học.');
    }
});

/**
 * PUT /api/admin/classes/:id
 * Cập nhật thông tin lớp học
 */
router.put('/classes/:id', (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        if (!data.ma_lop || !data.sl_max) {
            return sendError(res, 400, 'Thiếu thông tin bắt buộc');
        }

        const db = getDb();

        const detailJSON = JSON.stringify({
            ma_lop: data.ma_lop,
            ma_lop_kem: data.ma_lop_kem || 'NULL',
            ghi_chu: data.ghi_chu || 'NULL',
            thu: data.thu,
            tiet_bd: data.tiet_bd,
            tiet_kt: data.tiet_kt,
            buoi: data.buoi,
            phong_hoc: data.phong_hoc,
            can_tn: data.can_tn || 'NULL',
            teaching_type: data.teaching_type || 'NULL'
        });

        const result = db.prepare(`
            UPDATE classes_course 
            SET detail = ?, total_slots = ?
            WHERE id = ?
        `).run(detailJSON, data.sl_max, id);

        if (result.changes === 0) {
            return sendError(res, 404, 'Không tìm thấy lớp học để cập nhật');
        }

        return sendSuccess(res, null, 'Cập nhật lớp học thành công');
    } catch (err) {
        logger.error('Lỗi khi cập nhật lớp học', { error: err.message });
        return sendError(res, 500, 'Lỗi server khi cập nhật lớp học.');
    }
});

module.exports = router;
