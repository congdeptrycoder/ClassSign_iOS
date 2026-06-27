import { DeleteClassCourseUseCase } from '../../../../src/application/use-cases/DeleteClassCourseUseCase';
import { IAdminRepository } from '../../../../src/domain/repositories/IAdminRepository';

describe('DeleteClassCourseUseCase', () => {
    let useCase: DeleteClassCourseUseCase;
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
        useCase = new DeleteClassCourseUseCase(mockAdminRepository);
    });

    it('should call deleteClassCourse on the repository with correct id', async () => {
        const mockId = 1;
        await useCase.execute(mockId);
        expect(mockAdminRepository.deleteClassCourse).toHaveBeenCalledWith(mockId);
        expect(mockAdminRepository.deleteClassCourse).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if repository throws', async () => {
        const mockId = 1;
        const mockError = new Error('Repository error');
        mockAdminRepository.deleteClassCourse.mockRejectedValue(mockError);

        await expect(useCase.execute(mockId)).rejects.toThrow('Repository error');
    });
});
