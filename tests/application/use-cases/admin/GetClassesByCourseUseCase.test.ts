import { GetClassesByCourseUseCase } from '../../../../src/application/use-cases/GetClassesByCourseUseCase';
import { IAdminRepository } from '../../../../src/domain/repositories/IAdminRepository';

describe('GetClassesByCourseUseCase', () => {
    let useCase: GetClassesByCourseUseCase;
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
        useCase = new GetClassesByCourseUseCase(mockAdminRepository);
    });

    it('should call getClassesByCourse on the repository and return results', async () => {
        const mockCourseId = 10;
        const mockSemester = 20241;
        const mockResult = [{ id: 1, name: 'Class 1' }];
        mockAdminRepository.getClassesByCourse.mockResolvedValue(mockResult);

        const result = await useCase.execute(mockCourseId, mockSemester);
        expect(mockAdminRepository.getClassesByCourse).toHaveBeenCalledWith(mockCourseId, mockSemester);
        expect(result).toEqual(mockResult);
    });

    it('should throw an error if repository throws', async () => {
        const mockCourseId = 10;
        const mockSemester = 20241;
        const mockError = new Error('Repository error');
        mockAdminRepository.getClassesByCourse.mockRejectedValue(mockError);

        await expect(useCase.execute(mockCourseId, mockSemester)).rejects.toThrow('Repository error');
    });
});
