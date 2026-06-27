import { AdminRepositoryImpl } from '../../../src/infrastructure/repositories/AdminRepositoryImpl';
import { apiClient } from '../../../src/infrastructure/api/apiClient';

jest.mock('../../../src/infrastructure/api/apiClient', () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    }
}));

describe('AdminRepositoryImpl', () => {
    let repository: AdminRepositoryImpl;

    beforeEach(() => {
        repository = new AdminRepositoryImpl();
        jest.clearAllMocks();
    });

    it('should fetch course registration stats', async () => {
        const mockData = [
            { course_id: 1, ma_hp: 'IT101', ten_hp: 'Intro', truong_khoa: 'IT', so_luong_dang_ky: 10, so_luong_lop: 1, so_luong_dk_toi_da: 50 }
        ];
        (apiClient.get as jest.Mock).mockResolvedValue(mockData);

        const result = await repository.getCourseRegistrationStats(20241);
        expect(apiClient.get).toHaveBeenCalledWith('/admin/course-registration-stats?semester=20241');
        expect(result[0].course_id).toBe(1);
    });

    it('should create class course', async () => {
        const mockData = { name: 'Class 1' };
        await repository.createClassCourse(mockData);
        expect(apiClient.post).toHaveBeenCalledWith('/admin/classes', mockData);
    });

    it('should get classes by course', async () => {
        const mockData = [{ id: 1, name: 'Class 1' }];
        (apiClient.get as jest.Mock).mockResolvedValue(mockData);

        const result = await repository.getClassesByCourse(1, 20241);
        expect(apiClient.get).toHaveBeenCalledWith('/admin/classes?course_id=1&semester=20241');
        expect(result).toEqual(mockData);
    });

    it('should delete class course', async () => {
        await repository.deleteClassCourse(1);
        expect(apiClient.delete).toHaveBeenCalledWith('/admin/classes/1');
    });

    it('should update class course', async () => {
        const mockData = { name: 'Updated' };
        await repository.updateClassCourse(1, mockData);
        expect(apiClient.put).toHaveBeenCalledWith('/admin/classes/1', mockData);
    });

    it('should get all classes', async () => {
        const mockData = [{ id: 1 }];
        (apiClient.get as jest.Mock).mockResolvedValue(mockData);

        const result = await repository.getAllClasses(20241);
        expect(apiClient.get).toHaveBeenCalledWith('/admin/classes/all?semester=20241');
        expect(result).toEqual(mockData);
    });
});
