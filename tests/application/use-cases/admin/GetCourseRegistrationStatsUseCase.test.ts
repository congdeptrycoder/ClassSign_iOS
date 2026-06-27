import { GetCourseRegistrationStatsUseCase } from '../../../../src/application/use-cases/GetCourseRegistrationStatsUseCase';
import { IAdminRepository } from '../../../../src/domain/repositories/IAdminRepository';
import { CourseRegistrationStat } from '../../../../src/domain/entities/CourseRegistrationStat';

describe('GetCourseRegistrationStatsUseCase', () => {
    let useCase: GetCourseRegistrationStatsUseCase;
    let mockAdminRepository: jest.Mocked<IAdminRepository>;

    beforeEach(() => {
        mockAdminRepository = {
            createClassCourse: jest.fn(),
            deleteClassCourse: jest.fn(),
            getAllClasses: jest.fn(),
            getClassesByCourse: jest.fn(),
            getCourseRegistrationStats: jest.fn(),
            updateClassCourse: jest.fn(),
        };
        useCase = new GetCourseRegistrationStatsUseCase(mockAdminRepository);
    });

    it('should call getCourseRegistrationStats on the repository and return results', async () => {
        const mockSemester = 20241;
        const mockResult = [new CourseRegistrationStat(1, 'IT101', 'Intro to IT', 'IT', 100, 2, 120)];
        mockAdminRepository.getCourseRegistrationStats.mockResolvedValue(mockResult);

        const result = await useCase.execute(mockSemester);
        expect(mockAdminRepository.getCourseRegistrationStats).toHaveBeenCalledWith(mockSemester);
        expect(result).toEqual(mockResult);
    });

    it('should throw an error if repository throws', async () => {
        const mockSemester = 20241;
        const mockError = new Error('Repository error');
        mockAdminRepository.getCourseRegistrationStats.mockRejectedValue(mockError);

        await expect(useCase.execute(mockSemester)).rejects.toThrow('Repository error');
    });
});
