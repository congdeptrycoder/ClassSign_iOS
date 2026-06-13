import { CourseRegistrationStat } from '../../domain/entities/CourseRegistrationStat';
import { IAdminRepository } from '../../domain/repositories/IAdminRepository';
import { apiClient } from '../api/apiClient';

/**
 * AdminRepositoryImpl - Infrastructure Layer
 * Implement IAdminRepository để giao tiếp với API server.
 */
export class AdminRepositoryImpl implements IAdminRepository {
    async getCourseRegistrationStats(semester: number): Promise<CourseRegistrationStat[]> {
        try {
            const data = await apiClient.get<CourseRegistrationStat[]>(
                `/admin/course-registration-stats?semester=${semester}`
            );
            return data.map(
                item =>
                    new CourseRegistrationStat(
                        item.course_id,
                        item.ma_hp,
                        item.ten_hp,
                        item.truong_khoa,
                        item.so_luong_dang_ky,
                        item.so_luong_lop,
                        item.so_luong_dk_toi_da
                    )
            );
        } catch (error: any) {
            console.error('AdminRepositoryImpl getCourseRegistrationStats error:', error);
            throw new Error(error.message || 'Lỗi kết nối tới máy chủ.');
        }
    }

    async createClassCourse(data: any): Promise<void> {
        try {
            await apiClient.post('/admin/classes', data);
        } catch (error: any) {
            console.error('AdminRepositoryImpl createClassCourse error:', error);
            throw new Error(error.message || 'Lỗi kết nối tới máy chủ.');
        }
    }

    async getClassesByCourse(courseId: number, semester: number): Promise<any[]> {
        try {
            return await apiClient.get<any[]>(`/admin/classes?course_id=${courseId}&semester=${semester}`);
        } catch (error: any) {
            console.error('AdminRepositoryImpl getClassesByCourse error:', error);
            throw new Error(error.message || 'Lỗi lấy danh sách lớp học.');
        }
    }

    async deleteClassCourse(id: number): Promise<void> {
        try {
            await apiClient.delete(`/admin/classes/${id}`);
        } catch (error: any) {
            console.error('AdminRepositoryImpl deleteClassCourse error:', error);
            throw new Error(error.message || 'Lỗi khi xoá lớp học.');
        }
    }

    async updateClassCourse(id: number, data: any): Promise<void> {
        try {
            await apiClient.put(`/admin/classes/${id}`, data);
        } catch (error: any) {
            console.error('AdminRepositoryImpl updateClassCourse error:', error);
            throw new Error(error.message || 'Lỗi khi cập nhật lớp học.');
        }
    }
}
