import { SemesterRepositoryImpl } from '../../../src/infrastructure/repositories/SemesterRepositoryImpl';
import { apiClient } from '../../../src/infrastructure/api/apiClient';

jest.mock('../../../src/infrastructure/api/apiClient', () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
    }
}));

describe('SemesterRepositoryImpl', () => {
    let repository: SemesterRepositoryImpl;

    beforeEach(() => {
        repository = new SemesterRepositoryImpl();
        jest.clearAllMocks();
    });

    it('should get semesters', async () => {
        const mockData = [{ id: 1, semester_code: '20241' }];
        (apiClient.get as jest.Mock).mockResolvedValue(mockData);

        const result = await repository.getSemesters();
        expect(apiClient.get).toHaveBeenCalledWith('/semesters');
        expect(result.length).toBe(1);
    });

    it('should create semester', async () => {
        await repository.createSemester('20241');
        expect(apiClient.post).toHaveBeenCalledWith('/semesters', { semester: '20241' });
    });
});
