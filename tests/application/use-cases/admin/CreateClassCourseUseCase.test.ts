import { CreateClassCourseUseCase } from '../../../../src/application/use-cases/CreateClassCourseUseCase';
import { IAdminRepository } from '../../../../src/domain/repositories/IAdminRepository';

describe('CreateClassCourseUseCase', () => {
    let useCase: CreateClassCourseUseCase;
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
        useCase = new CreateClassCourseUseCase(mockAdminRepository);
    });

    it('should call createClassCourse on the repository with correct data', async () => {
        const mockData = { name: 'Class 1', courseId: 1 };
        await useCase.execute(mockData);
        expect(mockAdminRepository.createClassCourse).toHaveBeenCalledWith(mockData);
        expect(mockAdminRepository.createClassCourse).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if repository throws', async () => {
        const mockData = { name: 'Class 1', courseId: 1 };
        const mockError = new Error('Repository error');
        mockAdminRepository.createClassCourse.mockRejectedValue(mockError);

        await expect(useCase.execute(mockData)).rejects.toThrow('Repository error');
    });
});
