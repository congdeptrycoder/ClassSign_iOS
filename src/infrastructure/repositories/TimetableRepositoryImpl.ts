import { TimetableEntry } from '../../domain/entities/StudentRegistration';
import { ITimetableRepository } from '../../domain/repositories/ITimetableRepository';
import { apiClient } from '../api/apiClient';

export class TimetableRepositoryImpl implements ITimetableRepository {
  getTimetable(studentId: number): Promise<TimetableEntry[]> {
    return apiClient.get<TimetableEntry[]>(`/students/${studentId}/timetable`);
  }
}
