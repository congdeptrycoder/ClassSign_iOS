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

    const student = db.prepare('SELECT id, status FROM students WHERE id = ?').get(studentId);
    if (!student || !student.status || !student.status.includes('study')) {
        throw new Error('Bạn không có quyền thực hiện thao tác này. Liên hệ nhà trường để biết thêm thông tin');
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

function getRegisteredCourseRows(db, studentId, semester = null) {
    ensureStudentCourseStatusColumn(db);
    const query = `
        SELECT
            sc.id,
            sc.course_id as courseId,
            sc.semester,
            s.semester as semesterName,
            COALESCE(sc.status, 'registered') as status,
            c.course_code as code,
            c.course_name as name,
            c.credits
        FROM student_courses sc
        JOIN courses c ON c.id = sc.course_id
        LEFT JOIN semesters s ON s.id = sc.semester
        WHERE sc.student_id = ?
        ${semester !== null ? 'AND sc.semester = ?' : ''}
        ORDER BY sc.created_at DESC, sc.id DESC
    `;
    const params = semester !== null ? [studentId, semester] : [studentId];
    return db.prepare(query).all(...params);
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
                    WHEN SUM(CASE WHEN COALESCE(status, 'registered') IN ('registered', 're_registered') THEN 1 ELSE 0 END) > 0 THEN 'registered'
                    ELSE NULL
                END as registrationStatus,
                (SELECT COALESCE(status, 'registered') FROM student_courses sc2 WHERE sc2.course_id = student_courses.course_id AND sc2.student_id = student_courses.student_id ORDER BY id DESC LIMIT 1) as latestStatus
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
            sc.registrationStatus,
        sc.latestStatus
        FROM program_course pc
        JOIN courses c ON c.id = pc.course_id
        LEFT JOIN courses pre ON pre.id = pc.prerequisite_course_id
        LEFT JOIN courses par ON par.id = pc.parallel_course_id
        LEFT JOIN student_course_state sc ON sc.course_id = pc.course_id
        WHERE pc.program_id = ?
        ORDER BY c.course_code ASC
    `).all(studentId, programId);

    const completedCourseIds = getCompletedCourseIds(db, studentId);

    const courses = rows.map(row => {
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
      latestStatus: row.latestStatus,
      status,
      statusLabel: getCourseStatusLabel(status),
      hasStudied,
      studyStatusLabel: hasStudied ? 'Đã học' : 'Chưa học',
      canRegister: status === 'available',
      blockingReason: hasMissingPrerequisite
        ? `Thiếu học phần tiên quyết ${row.prerequisiteCode}-${row.prerequisiteName} chưa hoàn thành`
        : null,
    };
  });

  const courseMap = new Map(courses.map(c => [c.courseId, c]));
  courses.forEach(c => {
    if (c.parallelCourseId) {
      const parCourse = courseMap.get(c.parallelCourseId);
      c.parallelCourseRawStatus = parCourse ? parCourse.latestStatus : null;
    } else {
      c.parallelCourseRawStatus = null;
    }
  });

  return courses;
}


function getCourseStatusLabel(status) {
    switch (status) {
        case 'completed':
            return 'Đã học xong. Có thể học lại';
        case 'registered':
            return 'Đã từng đăng ký, chưa học xong';
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

    const curriculumCourses = getCurriculumRows(db, studentId);
    const courseMap = new Map(curriculumCourses.map(c => [c.courseId, c]));

    const collectedToRegister = new Map();
    const autoAddedNames = [];

    function collectSync(targetCourseId, isAutoAdd, depth = 0) {
        if (depth > 10) throw new Error('Phát hiện vòng lặp đệ quy học phần song hành.');
        if (collectedToRegister.has(targetCourseId)) return;

        const curriculumCourse = courseMap.get(targetCourseId);
        if (!curriculumCourse) {
            if (!isAutoAdd) throw new Error('Học phần không thuộc chương trình đào tạo của sinh viên.');
            return;
        }

        if (curriculumCourse.blockingReason) {
            throw new Error(`Học phần tiên quyết ${curriculumCourse.prerequisiteCode}-${curriculumCourse.prerequisiteName} chưa hoàn thành`);
        }

        const existingInSemester = db.prepare(`SELECT id FROM student_courses WHERE student_id = ? AND course_id = ? AND semester = ? LIMIT 1`).get(studentId, targetCourseId, activePeriod.semester);

        if (existingInSemester) {
            if (!isAutoAdd) throw new Error('Bạn đã đăng ký thành công trước đó');
            return; 
        }

        collectedToRegister.set(targetCourseId, curriculumCourse);
        if (isAutoAdd) {
            autoAddedNames.push(`${curriculumCourse.code}-${curriculumCourse.name}`);
        }

        if (curriculumCourse.parallelCourseId) {
            const parStatus = curriculumCourse.parallelCourseRawStatus;
            if (parStatus !== 'completed' && parStatus !== 're_registered') {
                collectSync(curriculumCourse.parallelCourseId, true, depth + 1);
            }
        }
    }

    collectSync(course.id, false);

    let primaryRegisteredCourse = null;
    let primaryMessage = 'Đăng ký thành công';

    for (const [cId, cCourse] of collectedToRegister.entries()) {
        const existingRegisteredOtherSemester = db.prepare(`SELECT id FROM student_courses WHERE student_id = ? AND course_id = ? AND status = 'registered' LIMIT 1`).get(studentId, cId);
        const existingCompleted = db.prepare(`SELECT id FROM student_courses WHERE student_id = ? AND course_id = ? AND status = 'completed' LIMIT 1`).get(studentId, cId);

        let newStatus = 'registered';
        let msg = 'Đăng ký thành công';

        if (existingCompleted) {
            newStatus = 're_registered';
            msg = 'Đăng ký thành công. Học phần này đã từng được học, bạn đang đăng ký học lại.';
        } else if (existingRegisteredOtherSemester) {
            newStatus = 'registered';
            msg = 'Đăng ký thành công. Học phần này đã từng được đăng ký nhưng chưa học xong.';
        }

        const result = db.prepare(`INSERT INTO student_courses (student_id, course_id, semester, status) VALUES (?, ?, ?, ?)`).run(studentId, cId, activePeriod.semester, newStatus);

        if (cId === course.id) {
            primaryRegisteredCourse = getRegisteredCourseRows(db, studentId).find(item => item.id === result.lastInsertRowid);
            primaryMessage = msg;
        }
    }

    if (autoAddedNames.length > 0) {
        primaryMessage = `Đã tự động thêm học phần song hành ${autoAddedNames.join(', ')}`;
    }

    return {
        ...primaryRegisteredCourse,
        message: primaryMessage
    };
}

function deleteRegisteredCourse(db, studentId, courseId, semester) {
    const existing = db.prepare(`
        SELECT id FROM student_courses
        WHERE student_id = ? AND course_id = ? AND semester = ?
        LIMIT 1
    `).get(studentId, courseId, semester);

    if (!existing) {
        throw new Error('Không tìm thấy đăng ký học phần này.');
    }

    db.prepare(`
        DELETE FROM student_courses
        WHERE student_id = ? AND course_id = ? AND semester = ?
    `).run(studentId, courseId, semester);

    return { success: true };
}

function searchClassSuggestions(db, studentId, query, limit = 10) {
    ensureStudentCourseStatusColumn(db);
    const normalized = query.trim().toLowerCase();

    // Lọc theo kỳ đăng ký lớp học hiện hành
    const activePeriod = getActiveRegistrationPeriod(db, 'register_class');
    const semesterCondition = activePeriod ? `AND cc.semester = ${activePeriod.semester} AND sc.semester = ${activePeriod.semester}` : ``;

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
            AND COALESCE(sc.status, 'registered') IN ('registered', 're_registered')
        WHERE (? = '' OR lower(c.course_code) LIKE ? OR lower(c.course_name) LIKE ?)
        ${semesterCondition}
        ORDER BY c.course_code ASC
        LIMIT ?
    `).all(studentId, normalized, `%${normalized}%`, `%${normalized}%`, limit);
}

function parseSchedule(detailStr) {
    try {
        const parsed = JSON.parse(detailStr || '{}');
        let slots = [];
        if (Array.isArray(parsed)) slots = parsed;
        else if (parsed.slots && Array.isArray(parsed.slots)) slots = parsed.slots;
        
        if (slots.length > 0) {
            return slots.map(s => ({
                day: String(s.day).replace('T', ''), // 'T3' -> '3'
                periods: Array.isArray(s.periods) ? s.periods.map(Number) : [Number(s.period)]
            }));
        } else if (parsed.thu && parsed.tiet_bd && parsed.tiet_kt) {
            const start = Number(parsed.tiet_bd);
            const end = Number(parsed.tiet_kt);
            const periods = [];
            for(let i = start; i <= end; i++) periods.push(i);
            return [{
                day: String(parsed.thu),
                periods
            }];
        }
    } catch (e) {}
    return [];
}

function hasOverlap(detailA, detailB) {
    const schedA = parseSchedule(detailA);
    const schedB = parseSchedule(detailB);
    
    for (const slotA of schedA) {
        for (const slotB of schedB) {
            if (slotA.day === slotB.day) {
                const setB = new Set(slotB.periods);
                for (const p of slotA.periods) {
                    if (setB.has(p)) return true;
                }
            }
        }
    }
    return false;
}

function getClassesForCourse(db, studentId, courseId) {
    ensureStudentCourseStatusColumn(db);

    // Lọc theo kỳ đăng ký lớp học hiện hành
    const activePeriod = getActiveRegistrationPeriod(db, 'register_class');
    const semesterCondition = activePeriod ? `AND cc.semester = ${activePeriod.semester} AND sc.semester = ${activePeriod.semester}` : ``;

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
            AND COALESCE(sc.status, 'registered') IN ('registered', 're_registered')
        WHERE cc.course_id = ?
        ${semesterCondition}
        ORDER BY cc.id ASC
    `).all(studentId, courseId);
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
            AND COALESCE(status, 'registered') IN ('registered', 're_registered')
        LIMIT 1
    `).get(studentId, classSection.courseId);

    if (!registeredCourse) {
        throw new Error('Sinh viên chưa đăng ký học phần của lớp này.');
    }

    const existingCourseClass = db.prepare(`
        SELECT scr.id
        FROM student_class_registrations scr
        JOIN classes_course cc ON cc.id = scr.class_id
        WHERE scr.student_id = ? AND cc.course_id = ?
        LIMIT 1
    `).get(studentId, classSection.courseId);

    if (existingCourseClass) {
        throw new Error('Bạn đã đăng ký một lớp khác của học phần này.');
    }

    const currentTimetable = getTimetable(db, studentId);
    for (const registeredClass of currentTimetable) {
        if (hasOverlap(classSection.detail, registeredClass.detail)) {
            throw new Error(`Trùng lịch với lớp ${registeredClass.code} (${registeredClass.name}).`);
        }
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
    // Ưu tiên đợt đăng ký lớp học hoặc học phần hiện tại
    const activePeriod = getActiveRegistrationPeriod(db, 'register_class') || getActiveRegistrationPeriod(db, 'register_program');
    let semesterId = activePeriod?.semester;

    if (!semesterId) {
        // Fallback lấy đợt đăng ký gần nhất trong hệ thống
        const lastPeriod = db.prepare('SELECT semester FROM academic_periods ORDER BY id DESC LIMIT 1').get();
        semesterId = lastPeriod?.semester;
    }

    const semesterCondition = semesterId ? `AND cc.semester = ${semesterId}` : ``;

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
        ${semesterCondition}
        ORDER BY c.course_code ASC
    `).all(studentId);
}

function cancelClassRegistration(db, studentId, classId) {
    const existing = db.prepare(`
        SELECT id FROM student_class_registrations
        WHERE student_id = ? AND class_id = ?
        LIMIT 1
    `).get(studentId, classId);

    if (!existing) {
        throw new Error('Không tìm thấy đăng ký lớp học này.');
    }

    db.transaction(() => {
        db.prepare(`
            DELETE FROM student_class_registrations
            WHERE id = ?
        `).run(existing.id);

        db.prepare(`
            UPDATE classes_course
            SET occupied_slots = occupied_slots - 1
            WHERE id = ?
        `).run(classId);
    })();

    return { success: true };
}

module.exports = {
    getCurriculum,
    getRegisteredCourseRows,
    registerCourse,
    deleteRegisteredCourse,
    registerClassSection,
    searchClassSuggestions,
    searchCourseSuggestions,
    getTimetable,
    getClassesForCourse,
    cancelClassRegistration,
};
