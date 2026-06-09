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
        return sendSuccess(res, getRegisteredCourseRows(db, parseStudentId(req)));
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
        return sendSuccess(
            res,
            registerCourse(db, parseStudentId(req), req.body),
            'Đăng ký học phần thành công.'
        );
    } catch (err) {
        logger.error('Lỗi khi đăng ký học phần', { error: err.message });
        return handleRouteError(res, err, 'Không thể đăng ký học phần.');
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
