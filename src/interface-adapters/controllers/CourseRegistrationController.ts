import { CancelCourseRegistrationUseCase } from '../../application/use-cases/CancelCourseRegistrationUseCase';
import { GetCurriculumUseCase } from '../../application/use-cases/GetCurriculumUseCase';
import { GetRegisteredCoursesUseCase } from '../../application/use-cases/GetRegisteredCoursesUseCase';
import { RegisterCourseUseCase } from '../../application/use-cases/RegisterCourseUseCase';
import { SearchCourseSuggestionsUseCase } from '../../application/use-cases/SearchCourseSuggestionsUseCase';
import { Curriculum, CurriculumCourse, RegisteredCourse, RegisteredCoursesResponse } from '../../domain/entities/StudentRegistration';

export class CourseRegistrationController {
  constructor(
    private readonly getCurriculumUseCase: GetCurriculumUseCase,
    private readonly getRegisteredCoursesUseCase: GetRegisteredCoursesUseCase,
    private readonly searchCourseSuggestionsUseCase: SearchCourseSuggestionsUseCase,
    private readonly registerCourseUseCase: RegisterCourseUseCase,
    private readonly cancelCourseRegistrationUseCase: CancelCourseRegistrationUseCase
  ) {}

  public async getCurriculum(studentId: number): Promise<Curriculum> {
    return this.getCurriculumUseCase.execute(studentId);
  }

  public async getRegisteredCourses(studentId: number): Promise<RegisteredCoursesResponse> {
    return this.getRegisteredCoursesUseCase.execute(studentId);
  }

  public async searchCourseSuggestions(studentId: number, query: string): Promise<CurriculumCourse[]> {
    return this.searchCourseSuggestionsUseCase.execute(studentId, query);
  }

  public async registerCourse(studentId: number, courseId: number): Promise<RegisteredCourse> {
    return this.registerCourseUseCase.execute(studentId, courseId);
  }

  public async cancelCourseRegistration(studentId: number, courseId: number, semester: string): Promise<void> {
    return this.cancelCourseRegistrationUseCase.execute(studentId, courseId, semester);
  }
}
