'use strict';

function ensureStudentCourseStatusColumn(db) {
    const columns = db.prepare('PRAGMA table_info(student_courses)').all();
    const hasStatus = columns.some(column => column.name === 'status');

    if (!hasStatus) {
        db.prepare("ALTER TABLE student_courses ADD COLUMN status TEXT DEFAULT 'registered'").run();
    }
}

function ensureStudentRecord(db, studentId) {
    const account = db.prepare(
        "SELECT id FROM accounts WHERE id = ? AND role = 'student'"
    ).get(studentId);

    if (!account) {
        throw new Error('Không tìm thấy tài khoản sinh viên.');
    }

    const student = db.prepare('SELECT id FROM students WHERE id = ?').get(studentId);
    if (!student) {
        db.prepare(
            "INSERT INTO students (id, status) VALUES (?, 'study')"
        ).run(studentId);
    }
}

function getStudentProfile(db, studentId) {
    const profile = db.prepare(`
        SELECT id, name, username, id_card
        FROM accounts
        WHERE id = ? AND role = 'student'
    `).get(studentId);

    if (!profile) {
        throw new Error('Không tìm thấy tài khoản sinh viên.');
    }

    return profile;
}

function getStudentProgramId(db, studentId) {
    const assignedProgram = db.prepare(`
        SELECT c.program_id as programId
        FROM classes_student cs
        JOIN classes c ON c.id = cs.id_class
        WHERE cs.id_account = ?
        LIMIT 1
    `).get(studentId);

    if (assignedProgram?.programId) {
        return assignedProgram.programId;
    }

    const fallbackProgram = db.prepare(
        'SELECT id FROM programs ORDER BY id LIMIT 1'
    ).get();

    if (!fallbackProgram) {
        throw new Error('Chưa có chương trình đào tạo trong cơ sở dữ liệu.');
    }

    return fallbackProgram.id;
}

function getActiveRegistrationPeriod(db, expectedType) {
    const rows = db.prepare(`
        SELECT id, semester, period_type, start_date, end_date, is_active
        FROM academic_periods
        WHERE is_active = 1
        ORDER BY id DESC
    `).all();

    const now = new Date();
    return rows.find(row => {
        const start = new Date(String(row.start_date).replace(' ', 'T'));
        const end = new Date(String(row.end_date).replace(' ', 'T'));
        return row.period_type === expectedType && now >= start && now <= end;
    }) ?? null;
}

function getCompletedCourseIds(db, studentId) {
    ensureStudentCourseStatusColumn(db);
    return new Set(
        db.prepare(`
            SELECT course_id
            FROM student_courses
            WHERE student_id = ? AND status = 'completed'
        `).all(studentId).map(row => row.course_id)
    );
}

function getRegisteredCourseRows(db, studentId) {
    ensureStudentCourseStatusColumn(db);
    return db.prepare(`
        SELECT
            sc.id,
            sc.course_id as courseId,
            sc.semester,
            COALESCE(sc.status, 'registered') as status,
            c.course_code as code,
            c.course_name as name,
            c.credits
        FROM student_courses sc
        JOIN courses c ON c.id = sc.course_id
        WHERE sc.student_id = ?
        ORDER BY sc.created_at DESC, sc.id DESC
    `).all(studentId);
}

function getCurriculumRows(db, studentId) {
    ensureStudentCourseStatusColumn(db);
    const programId = getStudentProgramId(db, studentId);

    const rows = db.prepare(`
        WITH student_course_state AS (
            SELECT
                course_id,
                CASE
                    WHEN SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) > 0 THEN 'completed'
                    WHEN SUM(CASE WHEN COALESCE(status, 'registered') = 'registered' THEN 1 ELSE 0 END) > 0 THEN 'registered'
                    ELSE NULL
                END as registrationStatus
            FROM student_courses
            WHERE student_id = ?
            GROUP BY course_id
        )
        SELECT
            pc.id as curriculumId,
            pc.course_id as courseId,
            pc.prerequisite_course_id as prerequisiteCourseId,
            pc.parallel_course_id as parallelCourseId,
            c.course_code as code,
            c.course_name as name,
            c.credits,
            pre.course_code as prerequisiteCode,
            pre.course_name as prerequisiteName,
            par.course_code as parallelCode,
            par.course_name as parallelName,
            sc.registrationStatus
        FROM program_course pc
        JOIN courses c ON c.id = pc.course_id
        LEFT JOIN courses pre ON pre.id = pc.prerequisite_course_id
        LEFT JOIN courses par ON par.id = pc.parallel_course_id
        LEFT JOIN student_course_state sc ON sc.course_id = pc.course_id
        WHERE pc.program_id = ?
        ORDER BY c.course_code ASC
    `).all(studentId, programId);

    const completedCourseIds = getCompletedCourseIds(db, studentId);

    return rows.map(row => {
        const hasMissingPrerequisite =
            row.prerequisiteCourseId && !completedCourseIds.has(row.prerequisiteCourseId);
        const status = row.registrationStatus === 'completed'
            ? 'completed'
            : row.registrationStatus
                ? 'registered'
                : hasMissingPrerequisite
                    ? 'blocked'
                    : 'available';
        const hasStudied = status === 'completed';

        return {
            ...row,
            status,
            statusLabel: getCourseStatusLabel(status),
            hasStudied,
            studyStatusLabel: hasStudied ? 'Đã học' : 'Chưa học',
            canRegister: status === 'available',
            blockingReason: hasMissingPrerequisite
                ? `Thiếu học phần tiên quyết ${row.prerequisiteCode}`
                : null,
        };
    });
}

function getCourseStatusLabel(status) {
    switch (status) {
        case 'completed':
            return 'Đã học';
        case 'registered':
            return 'Đã đăng ký';
        case 'blocked':
            return 'Chưa đủ điều kiện';
        default:
            return 'Có thể đăng ký';
    }
}

function getCurriculum(db, studentId) {
    const profile = getStudentProfile(db, studentId);
    const programId = getStudentProgramId(db, studentId);
    const program = db.prepare(`
        SELECT p.id, p.program_code as code, p.program_name as name
        FROM programs p
        WHERE p.id = ?
    `).get(programId);

    return {
        student: profile,
        program,
        courses: getCurriculumRows(db, studentId),
    };
}

function searchCourseSuggestions(db, studentId, query, limit = 10) {
    const normalized = query.trim().toLowerCase();

    return getCurriculumRows(db, studentId)
        .filter(course =>
            !normalized ||
            course.code.toLowerCase().includes(normalized) ||
            course.name.toLowerCase().includes(normalized)
        )
        .slice(0, limit);
}

function registerCourse(db, studentId, input) {
    ensureStudentRecord(db, studentId);
    ensureStudentCourseStatusColumn(db);

    const activePeriod = getActiveRegistrationPeriod(db, 'register_program');
    if (!activePeriod) {
        throw new Error('Hiện không trong giai đoạn đăng ký học phần.');
    }

    const course = input.courseId
        ? db.prepare('SELECT * FROM courses WHERE id = ?').get(input.courseId)
        : db.prepare('SELECT * FROM courses WHERE course_code = ?').get(input.courseCode);

    if (!course) {
        throw new Error('Học phần không tồn tại.');
    }

    const curriculumCourse = getCurriculumRows(db, studentId)
        .find(item => item.courseId === course.id);

    if (!curriculumCourse) {
        throw new Error('Học phần không thuộc chương trình đào tạo của sinh viên.');
    }

    if (!curriculumCourse.canRegister) {
        throw new Error(curriculumCourse.blockingReason || `Học phần đang ở trạng thái: ${curriculumCourse.statusLabel}.`);
    }

    const existing = db.prepare(`
        SELECT id, status
        FROM student_courses
        WHERE student_id = ?
            AND course_id = ?
            AND COALESCE(status, 'registered') IN ('registered', 'completed')
        LIMIT 1
    `).get(studentId, course.id);

    if (existing?.status === 'completed') {
        throw new Error('Học phần này đã học xong.');
    }

    if (existing) {
        throw new Error('Học phần này đã được đăng ký.');
    }

    const result = db.prepare(`
        INSERT INTO student_courses (student_id, course_id, semester, status)
        VALUES (?, ?, ?, 'registered')
    `).run(studentId, course.id, activePeriod.semester);

    return getRegisteredCourseRows(db, studentId)
        .find(item => item.id === Number(result.lastInsertRowid));
}

function searchClassSuggestions(db, studentId, query, limit = 10) {
    ensureStudentCourseStatusColumn(db);
    const normalized = query.trim().toLowerCase();

    return db.prepare(`
        SELECT DISTINCT
            cc.id,
            cc.course_id as courseId,
            c.course_code as code,
            c.course_name as name,
            c.credits,
            cc.detail,
            cc.total_slots as totalSlots,
            cc.occupied_slots as occupiedSlots
        FROM classes_course cc
        JOIN courses c ON c.id = cc.course_id
        JOIN student_courses sc
            ON sc.course_id = cc.course_id
            AND sc.student_id = ?
            AND COALESCE(sc.status, 'registered') = 'registered'
        WHERE ? = '' OR lower(c.course_code) LIKE ? OR lower(c.course_name) LIKE ?
        ORDER BY c.course_code ASC
        LIMIT ?
    `).all(studentId, normalized, `%${normalized}%`, `%${normalized}%`, limit);
}

function registerClassSection(db, studentId, classId) {
    ensureStudentRecord(db, studentId);

    const activePeriod = getActiveRegistrationPeriod(db, 'register_class');
    if (!activePeriod) {
        throw new Error('Hiện không trong giai đoạn đăng ký lớp học.');
    }

    const classSection = db.prepare(`
        SELECT
            id,
            course_id as courseId,
            total_slots as totalSlots,
            occupied_slots as occupiedSlots
        FROM classes_course
        WHERE id = ?
    `).get(classId);

    if (!classSection) {
        throw new Error('Lớp học phần không tồn tại.');
    }

    if (classSection.occupiedSlots >= classSection.totalSlots) {
        throw new Error('Lớp học phần đã hết chỗ.');
    }

    const registeredCourse = db.prepare(`
        SELECT id
        FROM student_courses
        WHERE student_id = ?
            AND course_id = ?
            AND COALESCE(status, 'registered') = 'registered'
        LIMIT 1
    `).get(studentId, classSection.courseId);

    if (!registeredCourse) {
        throw new Error('Sinh viên chưa đăng ký học phần của lớp này.');
    }

    const existing = db.prepare(`
        SELECT id
        FROM student_class_registrations
        WHERE student_id = ? AND class_id = ?
        LIMIT 1
    `).get(studentId, classId);

    if (existing) {
        throw new Error('Lớp học phần này đã được đăng ký.');
    }

    const createRegistration = db.transaction(() => {
        const result = db.prepare(`
            INSERT INTO student_class_registrations (student_id, class_id)
            VALUES (?, ?)
        `).run(studentId, classId);

        db.prepare(`
            UPDATE classes_course
            SET occupied_slots = occupied_slots + 1
            WHERE id = ?
        `).run(classId);

        return result.lastInsertRowid;
    });

    return { id: Number(createRegistration()) };
}

function getTimetable(db, studentId) {
    return db.prepare(`
        SELECT
            scr.id,
            cc.id as classId,
            c.course_code as code,
            c.course_name as name,
            cc.detail
        FROM student_class_registrations scr
        JOIN classes_course cc ON cc.id = scr.class_id
        JOIN courses c ON c.id = cc.course_id
        WHERE scr.student_id = ?
        ORDER BY c.course_code ASC
    `).all(studentId);
}

module.exports = {
    getCurriculum,
    getRegisteredCourseRows,
    registerCourse,
    registerClassSection,
    searchClassSuggestions,
    searchCourseSuggestions,
    getTimetable,
};
