import { CourseRegistrationStat } from '../../domain/entities/CourseRegistrationStat';
import { IAdminRepository } from '../../domain/repositories/IAdminRepository';

/**
 * GetCourseRegistrationStatsUseCase - Application Use Case
 * Lấy thống kê số lượng sinh viên đăng ký học phần theo kỳ học.
 */
export class GetCourseRegistrationStatsUseCase {
    constructor(private readonly adminRepo: IAdminRepository) {}

    async execute(semester: number): Promise<CourseRegistrationStat[]> {
        if (!semester) {
            throw new Error('Semester là bắt buộc.');
        }
        return this.adminRepo.getCourseRegistrationStats(semester);
    }
}
