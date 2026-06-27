import { ISemesterRepository } from '../../domain/repositories/ISemesterRepository';
import { Semester } from '../../domain/entities/Semester';
import { apiClient } from '../api/apiClient';

export class SemesterRepositoryImpl implements ISemesterRepository {
    async getSemesters(): Promise<Semester[]> {
        try {
            return await apiClient.get<Semester[]>('/semesters');
        } catch (error: any) {
            console.error('SemesterRepositoryImpl getSemesters error:', error);
            throw new Error(error.message || 'Lỗi lấy danh sách học kỳ.');
        }
    }

    async createSemester(semesterCode: string): Promise<void> {
        try {
            await apiClient.post('/semesters', { semester: semesterCode });
        } catch (error: any) {
            console.error('SemesterRepositoryImpl createSemester error:', error);
            throw new Error(error.message || 'Lỗi tạo học kỳ mới.');
        }
    }
}
