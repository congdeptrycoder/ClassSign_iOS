import { ICourseRegistrationRepository } from '../../domain/repositories/ICourseRegistrationRepository';

export class CancelCourseRegistrationUseCase {
  constructor(private readonly repository: ICourseRegistrationRepository) {}

  execute(studentId: number, courseId: number, semester: string) {
    return this.repository.deleteRegisteredCourse(studentId, courseId, semester);
  }
}
