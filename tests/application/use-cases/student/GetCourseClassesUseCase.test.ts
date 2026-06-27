import { GetCourseClassesUseCase } from '../../../../src/application/use-cases/GetCourseClassesUseCase';
import { IClassRegistrationRepository } from '../../../../src/domain/repositories/IClassRegistrationRepository';

describe('GetCourseClassesUseCase', () => {
    let useCase: GetCourseClassesUseCase;
    let mockRepository: jest.Mocked<IClassRegistrationRepository>;

    beforeEach(() => {
        mockRepository = {
            searchClassSuggestions: jest.fn(),
            registerClass: jest.fn(),
            getCourseClasses: jest.fn(),
            cancelClassRegistration: jest.fn(),
        };
        useCase = new GetCourseClassesUseCase(mockRepository);
    });

    it('should call getCourseClasses on the repository with correct parameters', async () => {
        const mockStudentId = 1;
        const mockCourseId = 101;
        const mockResponse = [{ classId: 1, name: 'Lớp 1' }] as any;
        mockRepository.getCourseClasses.mockResolvedValue(mockResponse);

        const result = await useCase.execute(mockStudentId, mockCourseId);

        expect(mockRepository.getCourseClasses).toHaveBeenCalledWith(mockStudentId, mockCourseId);
        expect(result).toEqual(mockResponse);
    });
});
