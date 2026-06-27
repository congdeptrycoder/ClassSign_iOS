import { CancelCourseRegistrationUseCase } from '../../../../src/application/use-cases/CancelCourseRegistrationUseCase';
import { ICourseRegistrationRepository } from '../../../../src/domain/repositories/ICourseRegistrationRepository';

describe('CancelCourseRegistrationUseCase', () => {
    let useCase: CancelCourseRegistrationUseCase;
    let mockRepository: jest.Mocked<ICourseRegistrationRepository>;

    beforeEach(() => {
        mockRepository = {
            getCurriculum: jest.fn(),
            getRegisteredCourses: jest.fn(),
            searchCourseSuggestions: jest.fn(),
            registerCourse: jest.fn(),
            deleteRegisteredCourse: jest.fn(),
        };
        useCase = new CancelCourseRegistrationUseCase(mockRepository);
    });

    it('should call deleteRegisteredCourse on the repository with correct parameters', async () => {
        const mockStudentId = 1;
        const mockCourseId = 101;
        const mockSemester = '20241';
        
        mockRepository.deleteRegisteredCourse.mockResolvedValue();

        await useCase.execute(mockStudentId, mockCourseId, mockSemester);

        expect(mockRepository.deleteRegisteredCourse).toHaveBeenCalledWith(mockStudentId, mockCourseId, mockSemester);
    });
});
