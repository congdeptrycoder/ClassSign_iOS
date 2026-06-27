import { GetRegisteredCoursesUseCase } from '../../../../src/application/use-cases/GetRegisteredCoursesUseCase';
import { ICourseRegistrationRepository } from '../../../../src/domain/repositories/ICourseRegistrationRepository';

describe('GetRegisteredCoursesUseCase', () => {
    let useCase: GetRegisteredCoursesUseCase;
    let mockRepository: jest.Mocked<ICourseRegistrationRepository>;

    beforeEach(() => {
        mockRepository = {
            getCurriculum: jest.fn(),
            getRegisteredCourses: jest.fn(),
            searchCourseSuggestions: jest.fn(),
            registerCourse: jest.fn(),
            deleteRegisteredCourse: jest.fn(),
        };
        useCase = new GetRegisteredCoursesUseCase(mockRepository);
    });

    it('should call getRegisteredCourses on the repository with correct studentId', async () => {
        const mockStudentId = 1;
        const mockResponse = { semester: '20241', courses: [] } as any;
        mockRepository.getRegisteredCourses.mockResolvedValue(mockResponse);

        const result = await useCase.execute(mockStudentId);

        expect(mockRepository.getRegisteredCourses).toHaveBeenCalledWith(mockStudentId);
        expect(result).toEqual(mockResponse);
    });
});
