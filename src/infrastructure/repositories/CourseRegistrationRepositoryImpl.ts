import {
  Curriculum,
  CurriculumCourse,
  RegisteredCourse,
  RegisteredCoursesResponse,
} from '../../domain/entities/StudentRegistration';
import { ICourseRegistrationRepository } from '../../domain/repositories/ICourseRegistrationRepository';
import { apiClient } from '../api/apiClient';

export class CourseRegistrationRepositoryImpl implements ICourseRegistrationRepository {
  getCurriculum(studentId: number): Promise<Curriculum> {
    return apiClient.get<Curriculum>(`/students/${studentId}/curriculum`);
  }

  getRegisteredCourses(studentId: number): Promise<RegisteredCoursesResponse> {
    return apiClient.get<RegisteredCoursesResponse>(`/students/${studentId}/registered-courses`);
  }

  searchCourseSuggestions(studentId: number, query: string): Promise<CurriculumCourse[]> {
    return apiClient.get<CurriculumCourse[]>(
      `/students/${studentId}/course-suggestions?q=${encodeURIComponent(query)}`
    );
  }

  registerCourse(studentId: number, courseId: number): Promise<RegisteredCourse> {
    return apiClient.post<RegisteredCourse>(
      `/students/${studentId}/course-registrations`,
      { courseId }
    );
  }

  async deleteRegisteredCourse(studentId: number, courseId: number, semester: string): Promise<void> {
    await apiClient.delete<{ success: boolean }>(
      `/students/${studentId}/course-registrations?courseId=${courseId}&semester=${encodeURIComponent(semester)}`
    );
  }
}
