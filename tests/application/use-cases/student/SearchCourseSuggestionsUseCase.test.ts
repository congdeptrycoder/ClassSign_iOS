import { SearchCourseSuggestionsUseCase } from '../../../../src/application/use-cases/SearchCourseSuggestionsUseCase';
import { ICourseRegistrationRepository } from '../../../../src/domain/repositories/ICourseRegistrationRepository';

describe('SearchCourseSuggestionsUseCase', () => {
    let useCase: SearchCourseSuggestionsUseCase;
    let mockRepository: jest.Mocked<ICourseRegistrationRepository>;

    beforeEach(() => {
        mockRepository = {
            getCurriculum: jest.fn(),
            getRegisteredCourses: jest.fn(),
            searchCourseSuggestions: jest.fn(),
            registerCourse: jest.fn(),
            deleteRegisteredCourse: jest.fn(),
        };
        useCase = new SearchCourseSuggestionsUseCase(mockRepository);
    });

    it('should call searchCourseSuggestions on the repository with correct parameters', async () => {
        const mockStudentId = 1;
        const mockQuery = 'Toán';
        const mockResponse = [{ id: 1, courseName: 'Toán' }] as any;
        mockRepository.searchCourseSuggestions.mockResolvedValue(mockResponse);

        const result = await useCase.execute(mockStudentId, mockQuery);

        expect(mockRepository.searchCourseSuggestions).toHaveBeenCalledWith(mockStudentId, mockQuery);
        expect(result).toEqual(mockResponse);
    });
});
