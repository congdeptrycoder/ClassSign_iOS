import { GetTimetableUseCase } from '../../application/use-cases/GetTimetableUseCase';
import { TimetableEntry } from '../../domain/entities/StudentRegistration';

export class TimetableController {
  constructor(private readonly getTimetableUseCase: GetTimetableUseCase) {}

  public async getTimetable(studentId: number): Promise<TimetableEntry[]> {
    return this.getTimetableUseCase.execute(studentId);
  }
}
