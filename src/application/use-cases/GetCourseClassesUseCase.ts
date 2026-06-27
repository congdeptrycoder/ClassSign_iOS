import { IClassRegistrationRepository } from '../../domain/repositories/IClassRegistrationRepository';

export class GetCourseClassesUseCase {
  constructor(private readonly repository: IClassRegistrationRepository) {}

  execute(studentId: number, courseId: number) {
    return this.repository.getCourseClasses(studentId, courseId);
  }
}
