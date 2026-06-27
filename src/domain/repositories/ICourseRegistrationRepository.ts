import { Curriculum, CurriculumCourse, RegisteredCourse, RegisteredCoursesResponse } from '../entities/StudentRegistration';

export interface ICourseRegistrationRepository {
  getCurriculum(studentId: number): Promise<Curriculum>;
  getRegisteredCourses(studentId: number): Promise<RegisteredCoursesResponse>;
  searchCourseSuggestions(studentId: number, query: string): Promise<CurriculumCourse[]>;
  registerCourse(studentId: number, courseId: number): Promise<RegisteredCourse>;
  deleteRegisteredCourse(studentId: number, courseId: number, semester: string): Promise<void>;
}
