import { RegisterCourseUseCase } from '../../../../src/application/use-cases/RegisterCourseUseCase';
import { ICourseRegistrationRepository } from '../../../../src/domain/repositories/ICourseRegistrationRepository';

describe('RegisterCourseUseCase', () => {
    let useCase: RegisterCourseUseCase;
    let mockRepository: jest.Mocked<ICourseRegistrationRepository>;

    beforeEach(() => {
        mockRepository = {
            getCurriculum: jest.fn(),
            getRegisteredCourses: jest.fn(),
            searchCourseSuggestions: jest.fn(),
            registerCourse: jest.fn(),
            deleteRegisteredCourse: jest.fn(),
        };
        useCase = new RegisterCourseUseCase(mockRepository);
    });

    it('should call registerCourse on the repository with correct parameters', async () => {
        const mockStudentId = 1;
        const mockCourseId = 101;
        const mockResponse = { id: 1, courseId: mockCourseId } as any;
        mockRepository.registerCourse.mockResolvedValue(mockResponse);

        const result = await useCase.execute(mockStudentId, mockCourseId);

        expect(mockRepository.registerCourse).toHaveBeenCalledWith(mockStudentId, mockCourseId);
        expect(result).toEqual(mockResponse);
    });
});
