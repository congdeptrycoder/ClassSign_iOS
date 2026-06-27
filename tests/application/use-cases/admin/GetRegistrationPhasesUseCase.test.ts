import { GetRegistrationPhasesUseCase } from '../../../../src/application/use-cases/GetRegistrationPhasesUseCase';
import { IRegistrationPhaseRepository } from '../../../../src/domain/repositories/IRegistrationPhaseRepository';

describe('GetRegistrationPhasesUseCase', () => {
    let useCase: GetRegistrationPhasesUseCase;
    let mockRepo: jest.Mocked<IRegistrationPhaseRepository>;

    beforeEach(() => {
        mockRepo = {
            addPhase: jest.fn(),
            deletePhase: jest.fn(),
            getPhases: jest.fn(),
            updatePhase: jest.fn(),
        };
        useCase = new GetRegistrationPhasesUseCase(mockRepo);
    });

    it('should call getPhases on the repository and return results', async () => {
        const mockResult = [{ id: '1', name: 'Phase 1', startDate: '2024-01-01', endDate: '2024-01-10', isClassRegistration: false, semesterId: 1, isActive: false, semesterName: 'HK1' }];
        mockRepo.getPhases.mockResolvedValue(mockResult);

        const result = await useCase.execute();
        expect(mockRepo.getPhases).toHaveBeenCalled();
        expect(result).toEqual(mockResult);
    });
});
