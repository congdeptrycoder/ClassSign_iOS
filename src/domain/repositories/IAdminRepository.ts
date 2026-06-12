import { CourseRegistrationStat } from '../entities/CourseRegistrationStat';

/**
 * IAdminRepository - Domain Repository Interface
 * Định nghĩa các phương thức truy xuất dữ liệu dành cho Admin.
 */
export interface IAdminRepository {
    getCourseRegistrationStats(semester: number): Promise<CourseRegistrationStat[]>;
}
