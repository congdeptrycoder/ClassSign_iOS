import { GetAllClassesUseCase } from '../../../../src/application/use-cases/GetAllClassesUseCase';
import { IAdminRepository } from '../../../../src/domain/repositories/IAdminRepository';

describe('GetAllClassesUseCase', () => {
    let useCase: GetAllClassesUseCase;
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
        useCase = new GetAllClassesUseCase(mockAdminRepository);
    });

    it('should call getAllClasses on the repository and return results', async () => {
        const mockSemester = 20241;
        const mockResult = [{ id: 1, name: 'Class 1' }];
        mockAdminRepository.getAllClasses.mockResolvedValue(mockResult);

        const result = await useCase.execute(mockSemester);
        expect(mockAdminRepository.getAllClasses).toHaveBeenCalledWith(mockSemester);
        expect(result).toEqual(mockResult);
    });

    it('should throw an error if repository throws', async () => {
        const mockSemester = 20241;
        const mockError = new Error('Repository error');
        mockAdminRepository.getAllClasses.mockRejectedValue(mockError);

        await expect(useCase.execute(mockSemester)).rejects.toThrow('Repository error');
    });
});
