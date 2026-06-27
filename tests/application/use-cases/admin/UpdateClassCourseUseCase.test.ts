import { UpdateClassCourseUseCase } from '../../../../src/application/use-cases/UpdateClassCourseUseCase';
import { IAdminRepository } from '../../../../src/domain/repositories/IAdminRepository';

describe('UpdateClassCourseUseCase', () => {
    let useCase: UpdateClassCourseUseCase;
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
        useCase = new UpdateClassCourseUseCase(mockAdminRepository);
    });

    it('should call updateClassCourse on the repository with correct id and data', async () => {
        const mockId = 1;
        const mockData = { name: 'Class 1 Updated' };
        await useCase.execute(mockId, mockData);
        expect(mockAdminRepository.updateClassCourse).toHaveBeenCalledWith(mockId, mockData);
        expect(mockAdminRepository.updateClassCourse).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if repository throws', async () => {
        const mockId = 1;
        const mockData = { name: 'Class 1 Updated' };
        const mockError = new Error('Repository error');
        mockAdminRepository.updateClassCourse.mockRejectedValue(mockError);

        await expect(useCase.execute(mockId, mockData)).rejects.toThrow('Repository error');
    });
});
