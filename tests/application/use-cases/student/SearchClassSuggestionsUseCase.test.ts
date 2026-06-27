import { SearchClassSuggestionsUseCase } from '../../../../src/application/use-cases/SearchClassSuggestionsUseCase';
import { IClassRegistrationRepository } from '../../../../src/domain/repositories/IClassRegistrationRepository';

describe('SearchClassSuggestionsUseCase', () => {
    let useCase: SearchClassSuggestionsUseCase;
    let mockRepository: jest.Mocked<IClassRegistrationRepository>;

    beforeEach(() => {
        mockRepository = {
            searchClassSuggestions: jest.fn(),
            registerClass: jest.fn(),
            getCourseClasses: jest.fn(),
            cancelClassRegistration: jest.fn(),
        };
        useCase = new SearchClassSuggestionsUseCase(mockRepository);
    });

    it('should call searchClassSuggestions on the repository with correct parameters', async () => {
        const mockStudentId = 1;
        const mockQuery = 'Lớp IT';
        const mockResponse = [{ classId: 1, name: 'Lớp IT' }] as any;
        mockRepository.searchClassSuggestions.mockResolvedValue(mockResponse);

        const result = await useCase.execute(mockStudentId, mockQuery);

        expect(mockRepository.searchClassSuggestions).toHaveBeenCalledWith(mockStudentId, mockQuery);
        expect(result).toEqual(mockResponse);
    });
});
