import { ClassSuggestion } from '../entities/StudentRegistration';

export interface IClassRegistrationRepository {
  searchClassSuggestions(studentId: number, query: string): Promise<ClassSuggestion[]>;
  registerClass(studentId: number, classId: number): Promise<void>;
  getCourseClasses(studentId: number, courseId: number): Promise<ClassSuggestion[]>;
  cancelClassRegistration(studentId: number, classId: number): Promise<void>;
}
