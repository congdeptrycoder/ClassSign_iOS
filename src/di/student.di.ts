import { CourseRegistrationRepositoryImpl } from '../infrastructure/repositories/CourseRegistrationRepositoryImpl';
import { ClassRegistrationRepositoryImpl } from '../infrastructure/repositories/ClassRegistrationRepositoryImpl';
import { TimetableRepositoryImpl } from '../infrastructure/repositories/TimetableRepositoryImpl';
import { RegistrationPhaseRepositoryImpl } from '../infrastructure/repositories/RegistrationPhaseRepositoryImpl';
import { IRegistrationPhaseObservable } from '../application/interfaces/IRegistrationPhaseObservable';
import { appEventBus } from './shared.di';

import { GetCurriculumUseCase } from '../application/use-cases/GetCurriculumUseCase';
import { GetRegisteredCoursesUseCase } from '../application/use-cases/GetRegisteredCoursesUseCase';
import { SearchCourseSuggestionsUseCase } from '../application/use-cases/SearchCourseSuggestionsUseCase';
import { RegisterCourseUseCase } from '../application/use-cases/RegisterCourseUseCase';
import { CancelCourseRegistrationUseCase } from '../application/use-cases/CancelCourseRegistrationUseCase';

import { SearchClassSuggestionsUseCase } from '../application/use-cases/SearchClassSuggestionsUseCase';
import { GetCourseClassesUseCase } from '../application/use-cases/GetCourseClassesUseCase';
import { RegisterClassUseCase } from '../application/use-cases/RegisterClassUseCase';
import { CancelClassRegistrationUseCase } from '../application/use-cases/CancelClassRegistrationUseCase';

import { GetTimetableUseCase } from '../application/use-cases/GetTimetableUseCase';

import { CourseRegistrationController } from '../interface-adapters/controllers/CourseRegistrationController';
import { ClassRegistrationController } from '../interface-adapters/controllers/ClassRegistrationController';
import { TimetableController } from '../interface-adapters/controllers/TimetableController';

// ── Repositories ──────────────────────────────────────────────────────────────
const courseRegistrationRepo = new CourseRegistrationRepositoryImpl();
const classRegistrationRepo = new ClassRegistrationRepositoryImpl();
const timetableRepo = new TimetableRepositoryImpl();

/**
 * Singleton instance của RegistrationPhaseRepositoryImpl — được export theo
 * IRegistrationPhaseObservable interface để ViewModel không phụ thuộc Impl.
 */
export const registrationPhaseRepository: IRegistrationPhaseObservable =
  RegistrationPhaseRepositoryImpl.getInstance();

/** Singleton EventBus dùng chung — import từ đây thay vì shared/utils */
export { appEventBus };

// ── Use Cases — Course ────────────────────────────────────────────────────────
const getCurriculumUseCase = new GetCurriculumUseCase(courseRegistrationRepo);
const getRegisteredCoursesUseCase = new GetRegisteredCoursesUseCase(courseRegistrationRepo);
const searchCourseSuggestionsUseCase = new SearchCourseSuggestionsUseCase(courseRegistrationRepo);
const registerCourseUseCase = new RegisterCourseUseCase(courseRegistrationRepo);
const cancelCourseRegistrationUseCase = new CancelCourseRegistrationUseCase(courseRegistrationRepo);

// ── Use Cases — Class ─────────────────────────────────────────────────────────
const searchClassSuggestionsUseCase = new SearchClassSuggestionsUseCase(classRegistrationRepo);
const getCourseClassesUseCase = new GetCourseClassesUseCase(classRegistrationRepo);
const registerClassUseCase = new RegisterClassUseCase(classRegistrationRepo);
const cancelClassRegistrationUseCase = new CancelClassRegistrationUseCase(classRegistrationRepo);

// ── Use Cases — Timetable ─────────────────────────────────────────────────────
const getTimetableUseCase = new GetTimetableUseCase(timetableRepo);

// ── Controllers ───────────────────────────────────────────────────────────────
export const courseRegistrationController = new CourseRegistrationController(
  getCurriculumUseCase,
  getRegisteredCoursesUseCase,
  searchCourseSuggestionsUseCase,
  registerCourseUseCase,
  cancelCourseRegistrationUseCase
);

export const classRegistrationController = new ClassRegistrationController(
  searchClassSuggestionsUseCase,
  getCourseClassesUseCase,
  registerClassUseCase,
  cancelClassRegistrationUseCase
);

export const timetableController = new TimetableController(getTimetableUseCase);

