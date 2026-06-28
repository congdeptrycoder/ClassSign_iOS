const Database = require('better-sqlite3');
const {
    getCurriculum,
    registerClassSection,
    registerCourse,
} = require('../../../server/services/studentRegistrationService');

function createDb() {
    const db = new Database(':memory:');

    db.exec(`
        CREATE TABLE accounts (
            id INTEGER PRIMARY KEY,
            username TEXT,
            name TEXT,
            role TEXT,
            id_card TEXT
        );

        CREATE TABLE students (
            id INTEGER PRIMARY KEY,
            status TEXT
        );

        CREATE TABLE programs (
            id INTEGER PRIMARY KEY,
            program_code TEXT,
            program_name TEXT
        );

        CREATE TABLE classes (
            id INTEGER PRIMARY KEY,
            program_id INTEGER
        );

        CREATE TABLE classes_student (
            id_account INTEGER,
            id_class INTEGER
        );

        CREATE TABLE courses (
            id INTEGER PRIMARY KEY,
            course_code TEXT,
            course_name TEXT,
            credits INTEGER
        );

        CREATE TABLE program_course (
            id INTEGER PRIMARY KEY,
            program_id INTEGER,
            course_id INTEGER,
            prerequisite_course_id INTEGER,
            parallel_course_id INTEGER
        );

        CREATE TABLE academic_periods (
            id INTEGER PRIMARY KEY,
            semester TEXT,
            period_type TEXT,
            start_date TEXT,
            end_date TEXT,
            is_active INTEGER
        );

        CREATE TABLE student_courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            course_id INTEGER,
            semester TEXT,
            status TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE classes_course (
            id INTEGER PRIMARY KEY,
            course_id INTEGER,
            detail TEXT,
            total_slots INTEGER,
            occupied_slots INTEGER,
            semester TEXT
        );

        CREATE TABLE student_class_registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            class_id INTEGER
        );

        CREATE TABLE semesters (
            id TEXT PRIMARY KEY,
            semester TEXT
        );
    `);

    db.prepare(`
        INSERT INTO accounts (id, username, name, role, id_card)
        VALUES (2, 'student', 'Student One', 'student', 'S001')
    `).run();
    db.prepare("INSERT INTO students (id, status) VALUES (2, 'study')").run();
    db.prepare(`
        INSERT INTO programs (id, program_code, program_name)
        VALUES (1, 'CS', 'Computer Science')
    `).run();
    db.prepare('INSERT INTO classes (id, program_id) VALUES (1, 1)').run();
    db.prepare('INSERT INTO classes_student (id_account, id_class) VALUES (2, 1)').run();

    const insertCourse = db.prepare(`
        INSERT INTO courses (id, course_code, course_name, credits)
        VALUES (?, ?, ?, ?)
    `);
    insertCourse.run(1, 'CS101', 'Intro', 3);
    insertCourse.run(2, 'CS102', 'Data Structures', 3);
    insertCourse.run(3, 'CS201', 'Algorithms', 3);

    const insertProgramCourse = db.prepare(`
        INSERT INTO program_course (
            id,
            program_id,
            course_id,
            prerequisite_course_id,
            parallel_course_id
        )
        VALUES (?, 1, ?, ?, NULL)
    `);
    insertProgramCourse.run(1, 1, null);
    insertProgramCourse.run(2, 2, 1);
    insertProgramCourse.run(3, 3, 2);

    const now = Date.now();
    const startDate = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    const endDate = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const insertPeriod = db.prepare(`
        INSERT INTO academic_periods (
            semester,
            period_type,
            start_date,
            end_date,
            is_active
        )
        VALUES ('2026.1', ?, ?, ?, 1)
    `);
    insertPeriod.run('register_program', startDate, endDate);
    insertPeriod.run('register_class', startDate, endDate);

    db.prepare(`
        INSERT INTO student_courses (student_id, course_id, semester, status)
        VALUES (2, 1, '2025.2', 'completed')
    `).run();
    db.prepare(`
        INSERT INTO student_courses (student_id, course_id, semester, status)
        VALUES (2, 1, '2026.1', 'registered')
    `).run();

    db.prepare(`
        INSERT INTO classes_course (
            id,
            course_id,
            detail,
            total_slots,
            occupied_slots,
            semester
        )
        VALUES (10, 2, 'Monday 08:00', 30, 0, '2026.1')
    `).run();
    db.prepare(`
        INSERT INTO classes_course (
            id,
            course_id,
            detail,
            total_slots,
            occupied_slots,
            semester
        )
        VALUES (11, 3, 'Tuesday 08:00', 30, 0, '2026.1')
    `).run();

    return db;
}

describe('studentRegistrationService', () => {
    let db;

    beforeEach(() => {
        db = createDb();
    });

    afterEach(() => {
        db.close();
    });

    it('returns one curriculum row per course with derived registration status', () => {
        const curriculum = getCurriculum(db, 2);

        expect(curriculum.courses).toHaveLength(3);
        expect(curriculum.courses.map(course => course.code)).toEqual([
            'CS101',
            'CS102',
            'CS201',
        ]);
        expect(curriculum.courses.find(course => course.code === 'CS101').status)
            .toBe('completed');
        expect(curriculum.courses.find(course => course.code === 'CS101').hasStudied)
            .toBe(true);
        expect(curriculum.courses.find(course => course.code === 'CS101').studyStatusLabel)
            .toBe('Đã học');
        expect(curriculum.courses.find(course => course.code === 'CS102').status)
            .toBe('available');
        expect(curriculum.courses.find(course => course.code === 'CS102').hasStudied)
            .toBe(false);
        expect(curriculum.courses.find(course => course.code === 'CS102').studyStatusLabel)
            .toBe('Chưa học');
        expect(curriculum.courses.find(course => course.code === 'CS201').status)
            .toBe('blocked');
        expect(curriculum.courses.find(course => course.code === 'CS201').hasStudied)
            .toBe(false);
    });

    it('registers only courses that satisfy curriculum prerequisites', () => {
        const registered = registerCourse(db, 2, { courseId: 2 });

        expect(registered.code).toBe('CS102');
        expect(() => registerCourse(db, 2, { courseId: 3 })).toThrow();
    });

    it('registers a class section only after the matching course is registered', () => {
        expect(() => registerClassSection(db, 2, 11)).toThrow();

        registerCourse(db, 2, { courseId: 2 });
        const classRegistration = registerClassSection(db, 2, 10);
        const classSection = db
            .prepare('SELECT occupied_slots as occupiedSlots FROM classes_course WHERE id = 10')
            .get();

        expect(classRegistration.id).toBeGreaterThan(0);
        expect(classSection.occupiedSlots).toBe(1);
    });
});
