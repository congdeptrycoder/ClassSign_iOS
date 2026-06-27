import { RegistrationPhaseRepositoryImpl } from '../../../src/infrastructure/repositories/RegistrationPhaseRepositoryImpl';
import { apiClient } from '../../../src/infrastructure/api/apiClient';

jest.mock('../../../src/infrastructure/api/apiClient', () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    }
}));

describe('RegistrationPhaseRepositoryImpl', () => {
    let repository: RegistrationPhaseRepositoryImpl;

    beforeEach(() => {
        repository = RegistrationPhaseRepositoryImpl.getInstance();
        jest.clearAllMocks();
    });

    it('should get phases', async () => {
        const mockData = [{ id: '1', name: 'Phase 1', type: 'course', start_time: '2024-01-01', end_time: '2024-01-10', is_active: 1, semester_id: 1, semester_name: 'HK1' }];
        (apiClient.get as jest.Mock).mockResolvedValue(mockData);

        const result = await repository.getPhases();
        expect(apiClient.get).toHaveBeenCalledWith('/academic-periods');
        expect(result.length).toBe(1);
    });

    it('should add phase', async () => {
        const mockPhase = { type: 'course', startTime: '2024-01-01', endTime: '2024-01-10', semesterId: 1 } as any;
        const mockResponse = { id: '1', ...mockPhase, is_active: 0, semester_name: 'HK1' };
        (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

        const result = await repository.addPhase(mockPhase);
        expect(apiClient.post).toHaveBeenCalledWith('/academic-periods', mockPhase);
        expect(result.id).toBe('1');
    });

    it('should update phase', async () => {
        const mockPhase = { id: '1', type: 'course', startTime: '2024-01-01', endTime: '2024-01-10', semesterId: 1, isActive: true, semesterName: 'HK1' } as any;
        await repository.updatePhase(mockPhase);
        expect(apiClient.put).toHaveBeenCalledWith('/academic-periods/1', mockPhase);
    });

    it('should delete phase', async () => {
        await repository.deletePhase('1');
        expect(apiClient.delete).toHaveBeenCalledWith('/academic-periods/1');
    });
});
