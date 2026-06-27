import { CancelClassRegistrationUseCase } from '../../application/use-cases/CancelClassRegistrationUseCase';
import { GetCourseClassesUseCase } from '../../application/use-cases/GetCourseClassesUseCase';
import { RegisterClassUseCase } from '../../application/use-cases/RegisterClassUseCase';
import { SearchClassSuggestionsUseCase } from '../../application/use-cases/SearchClassSuggestionsUseCase';
import { ClassSuggestion } from '../../domain/entities/StudentRegistration';

export class ClassRegistrationController {
  constructor(
    private readonly searchClassSuggestionsUseCase: SearchClassSuggestionsUseCase,
    private readonly getCourseClassesUseCase: GetCourseClassesUseCase,
    private readonly registerClassUseCase: RegisterClassUseCase,
    private readonly cancelClassRegistrationUseCase: CancelClassRegistrationUseCase
  ) {}

  public async searchClassSuggestions(studentId: number, query: string): Promise<ClassSuggestion[]> {
    return this.searchClassSuggestionsUseCase.execute(studentId, query);
  }

  public async getCourseClasses(studentId: number, courseId: number): Promise<ClassSuggestion[]> {
    return this.getCourseClassesUseCase.execute(studentId, courseId);
  }

  public async registerClass(studentId: number, classId: number): Promise<void> {
    return this.registerClassUseCase.execute(studentId, classId);
  }

  public async cancelClassRegistration(studentId: number, classId: number): Promise<void> {
    return this.cancelClassRegistrationUseCase.execute(studentId, classId);
  }
}
