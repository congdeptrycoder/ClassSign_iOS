import { ISemesterRepository } from '../../domain/repositories/ISemesterRepository';
import { Semester } from '../../domain/entities/Semester';
import apiClient from '../api/axiosClient';

export class SemesterRepositoryImpl implements ISemesterRepository {
    async getSemesters(): Promise<Semester[]> {
        const response = await apiClient.get('/semesters');
        return response.data.data; // Dựa trên sendSuccess format
    }

    async createSemester(semesterCode: string): Promise<void> {
        await apiClient.post('/semesters', { semester: semesterCode });
    }
}
