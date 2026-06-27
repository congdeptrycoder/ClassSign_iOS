import { RegistrationPhaseRepositoryImpl } from '../infrastructure/repositories/RegistrationPhaseRepositoryImpl';
import { AdminRepositoryImpl } from '../infrastructure/repositories/AdminRepositoryImpl';
import { SemesterRepositoryImpl } from '../infrastructure/repositories/SemesterRepositoryImpl';

import { GetRegistrationPhasesUseCase } from '../application/use-cases/GetRegistrationPhasesUseCase';
import { AddRegistrationPhaseUseCase } from '../application/use-cases/AddRegistrationPhaseUseCase';
import { UpdateRegistrationPhaseUseCase } from '../application/use-cases/UpdateRegistrationPhaseUseCase';
import { DeleteRegistrationPhaseUseCase } from '../application/use-cases/DeleteRegistrationPhaseUseCase';
import { GetCourseRegistrationStatsUseCase } from '../application/use-cases/GetCourseRegistrationStatsUseCase';
import { GetClassesByCourseUseCase } from '../application/use-cases/GetClassesByCourseUseCase';
import { DeleteClassCourseUseCase } from '../application/use-cases/DeleteClassCourseUseCase';
import { CreateClassCourseUseCase } from '../application/use-cases/CreateClassCourseUseCase';
import { UpdateClassCourseUseCase } from '../application/use-cases/UpdateClassCourseUseCase';
import { GetSemestersUseCase } from '../application/use-cases/GetSemestersUseCase';
import { CreateSemesterUseCase } from '../application/use-cases/CreateSemesterUseCase';
import { GetAllClassesUseCase } from '../application/use-cases/GetAllClassesUseCase';

import { RegistrationPhaseController } from '../interface-adapters/controllers/RegistrationPhaseController';

// ── Repositories ─────────────────────────────────────────────────────────────
const registrationPhaseRepo = RegistrationPhaseRepositoryImpl.getInstance();
const adminRepo = new AdminRepositoryImpl();
const semesterRepo = new SemesterRepositoryImpl();

// ── Use Cases — Registration Phase ───────────────────────────────────────────
const getRegistrationPhasesUseCase = new GetRegistrationPhasesUseCase(registrationPhaseRepo);
const addRegistrationPhaseUseCase = new AddRegistrationPhaseUseCase(registrationPhaseRepo);
const updateRegistrationPhaseUseCase = new UpdateRegistrationPhaseUseCase(registrationPhaseRepo);
const deleteRegistrationPhaseUseCase = new DeleteRegistrationPhaseUseCase(registrationPhaseRepo);

// ── Use Cases — Admin (CRUD lớp học) ─────────────────────────────────────────
export const getCourseRegistrationStatsUseCase = new GetCourseRegistrationStatsUseCase(adminRepo);
export const getClassesByCourseUseCase = new GetClassesByCourseUseCase(adminRepo);
export const deleteClassCourseUseCase = new DeleteClassCourseUseCase(adminRepo);
export const createClassCourseUseCase = new CreateClassCourseUseCase(adminRepo);
export const updateClassCourseUseCase = new UpdateClassCourseUseCase(adminRepo);
export const getAllClassesUseCase = new GetAllClassesUseCase(adminRepo);

// ── Use Cases — Semester ──────────────────────────────────────────────────────
export const getSemestersUseCase = new GetSemestersUseCase(semesterRepo);
export const createSemesterUseCase = new CreateSemesterUseCase(semesterRepo);

// ── Controller ────────────────────────────────────────────────────────────────
export const registrationPhaseController = new RegistrationPhaseController(
  getRegistrationPhasesUseCase,
  addRegistrationPhaseUseCase,
  updateRegistrationPhaseUseCase,
  deleteRegistrationPhaseUseCase
);
