import { ClassSuggestion } from '../../domain/entities/StudentRegistration';
import { IClassRegistrationRepository } from '../../domain/repositories/IClassRegistrationRepository';
import { apiClient } from '../api/apiClient';

export class ClassRegistrationRepositoryImpl implements IClassRegistrationRepository {
  searchClassSuggestions(studentId: number, query: string): Promise<ClassSuggestion[]> {
    return apiClient.get<ClassSuggestion[]>(
      `/students/${studentId}/class-suggestions?q=${encodeURIComponent(query)}`
    );
  }

  async registerClass(studentId: number, classId: number): Promise<void> {
    await apiClient.post<{ id: number }>(`/students/${studentId}/class-registrations`, {
      classId,
    });
  }

  getCourseClasses(studentId: number, courseId: number): Promise<ClassSuggestion[]> {
    return apiClient.get<ClassSuggestion[]>(`/students/${studentId}/courses/${courseId}/classes`);
  }

  async cancelClassRegistration(studentId: number, classId: number): Promise<void> {
    await apiClient.delete<{ success: boolean }>(`/students/${studentId}/class-registrations?classId=${classId}`);
  }
}
