import {
  ClassSuggestion,
  Curriculum,
  CurriculumCourse,
  RegisteredCourse,
  RegisteredCoursesResponse,
  TimetableEntry,
} from '../entities/StudentRegistration';

export interface IStudentRegistrationRepository {
  getCurriculum(studentId: number): Promise<Curriculum>;
  getRegisteredCourses(studentId: number): Promise<RegisteredCoursesResponse>;
  searchCourseSuggestions(studentId: number, query: string): Promise<CurriculumCourse[]>;
  registerCourse(studentId: number, courseId: number): Promise<RegisteredCourse>;
  searchClassSuggestions(studentId: number, query: string): Promise<ClassSuggestion[]>;
  registerClass(studentId: number, classId: number): Promise<void>;
  getTimetable(studentId: number): Promise<TimetableEntry[]>;
  deleteRegisteredCourse(studentId: number, courseId: number, semester: string): Promise<void>;
  getCourseClasses(studentId: number, courseId: number): Promise<ClassSuggestion[]>;
  cancelClassRegistration(studentId: number, classId: number): Promise<void>;
}
