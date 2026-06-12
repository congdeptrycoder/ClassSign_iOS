'use strict';

const express = require('express');
const { getDb } = require('../database');
const logger = require('../logger');
const { sendError, sendSuccess } = require('../response');
const {
    getCurriculum,
    getRegisteredCourseRows,
    getTimetable,
    registerClassSection,
    registerCourse,
    deleteRegisteredCourse,
    searchClassSuggestions,
    searchCourseSuggestions,
} = require('../services/studentRegistrationService');

const router = express.Router();

function parseStudentId(req) {
    const studentId = Number(req.params.studentId);
    if (!Number.isInteger(studentId) || studentId <= 0) {
        throw new Error('Mã sinh viên không hợp lệ.');
    }
    return studentId;
}

function handleRouteError(res, err, fallbackMessage) {
    const message = err instanceof Error ? err.message : fallbackMessage;
    const status = message.includes('không tìm thấy') || message.includes('không tồn tại')
        ? 404
        : 400;
    return sendError(res, status, message || fallbackMessage);
}

router.get('/:studentId/curriculum', (req, res) => {
    try {
        const db = getDb();
        return sendSuccess(res, getCurriculum(db, parseStudentId(req)));
    } catch (err) {
        logger.error('Lỗi khi lấy chương trình đào tạo', { error: err.message });
        return handleRouteError(res, err, 'Không thể lấy chương trình đào tạo.');
    }
});

router.get('/:studentId/registered-courses', (req, res) => {
    try {
        const db = getDb();
        const studentId = parseStudentId(req);

        // Lấy semester của academic_period đang active (bất kỳ loại nào)
        const activePeriod = db.prepare(`
            SELECT ap.semester as semesterId, s.semester as semesterName
            FROM academic_periods ap
            LEFT JOIN semesters s ON s.id = ap.semester
            WHERE ap.is_active = 1
            ORDER BY ap.id DESC
            LIMIT 1
        `).get();

        const semesterId = activePeriod?.semesterId ?? null;
        const semesterName = activePeriod?.semesterName ?? null;

        const courses = getRegisteredCourseRows(db, studentId, semesterId);

        const studentRow = db.prepare('SELECT status FROM students WHERE id = ?').get(studentId);

        return sendSuccess(res, { courses, semesterName, studentStatus: studentRow?.status });
    } catch (err) {
        logger.error('Lỗi khi lấy học phần đã đăng ký', { error: err.message });
        return handleRouteError(res, err, 'Không thể lấy học phần đã đăng ký.');
    }
});


router.get('/:studentId/course-suggestions', (req, res) => {
    try {
        const db = getDb();
        const query = String(req.query.q ?? '');
        const limit = Number(req.query.limit ?? 10);
        return sendSuccess(
            res,
            searchCourseSuggestions(db, parseStudentId(req), query, limit)
        );
    } catch (err) {
        logger.error('Lỗi khi tìm gợi ý học phần', { error: err.message });
        return handleRouteError(res, err, 'Không thể tìm gợi ý học phần.');
    }
});

router.post('/:studentId/course-registrations', (req, res) => {
    try {
        const db = getDb();
        const result = registerCourse(db, parseStudentId(req), req.body);
        return sendSuccess(
            res,
            result,
            result.message || 'Đăng ký học phần thành công.'
        );
    } catch (err) {
        logger.error('Lỗi khi đăng ký học phần', { error: err.message });
        return handleRouteError(res, err, 'Không thể đăng ký học phần.');
    }
});

router.delete('/:studentId/course-registrations', (req, res) => {
    try {
        const db = getDb();
        const courseId = Number(req.query.courseId);
        const semester = req.query.semester;
        if (!courseId || !semester) {
            throw new Error('Thiếu thông tin courseId hoặc semester');
        }
        return sendSuccess(
            res,
            deleteRegisteredCourse(db, parseStudentId(req), courseId, semester),
            'Xoá đăng ký học phần thành công.'
        );
    } catch (err) {
        logger.error('Lỗi khi xoá đăng ký học phần', { error: err.message });
        return handleRouteError(res, err, 'Không thể xoá đăng ký học phần.');
    }
});

router.get('/:studentId/class-suggestions', (req, res) => {
    try {
        const db = getDb();
        const query = String(req.query.q ?? '');
        const limit = Number(req.query.limit ?? 10);
        return sendSuccess(
            res,
            searchClassSuggestions(db, parseStudentId(req), query, limit)
        );
    } catch (err) {
        logger.error('Lỗi khi tìm gợi ý lớp học phần', { error: err.message });
        return handleRouteError(res, err, 'Không thể tìm gợi ý lớp học phần.');
    }
});

router.post('/:studentId/class-registrations', (req, res) => {
    try {
        const db = getDb();
        return sendSuccess(
            res,
            registerClassSection(db, parseStudentId(req), Number(req.body.classId)),
            'Đăng ký lớp học phần thành công.'
        );
    } catch (err) {
        logger.error('Lỗi khi đăng ký lớp học phần', { error: err.message });
        return handleRouteError(res, err, 'Không thể đăng ký lớp học phần.');
    }
});

router.get('/:studentId/timetable', (req, res) => {
    try {
        const db = getDb();
        return sendSuccess(res, getTimetable(db, parseStudentId(req)));
    } catch (err) {
        logger.error('Lỗi khi lấy thời khóa biểu', { error: err.message });
        return handleRouteError(res, err, 'Không thể lấy thời khóa biểu.');
    }
});

module.exports = router;
