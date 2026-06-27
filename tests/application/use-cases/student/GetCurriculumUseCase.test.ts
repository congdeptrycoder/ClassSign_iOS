import { GetCurriculumUseCase } from '../../../../src/application/use-cases/GetCurriculumUseCase';
import { ICourseRegistrationRepository } from '../../../../src/domain/repositories/ICourseRegistrationRepository';

describe('GetCurriculumUseCase', () => {
    let useCase: GetCurriculumUseCase;
    let mockRepository: jest.Mocked<ICourseRegistrationRepository>;

    beforeEach(() => {
        mockRepository = {
            getCurriculum: jest.fn(),
            getRegisteredCourses: jest.fn(),
            searchCourseSuggestions: jest.fn(),
            registerCourse: jest.fn(),
            deleteRegisteredCourse: jest.fn(),
        };
        useCase = new GetCurriculumUseCase(mockRepository);
    });

    it('should call getCurriculum on the repository with correct studentId', async () => {
        const mockStudentId = 1;
        const mockCurriculum = { test: 'curriculum' } as any;
        mockRepository.getCurriculum.mockResolvedValue(mockCurriculum);

        const result = await useCase.execute(mockStudentId);

        expect(mockRepository.getCurriculum).toHaveBeenCalledWith(mockStudentId);
        expect(result).toEqual(mockCurriculum);
    });
});
