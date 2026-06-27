import { UpdateRegistrationPhaseUseCase } from '../../../../src/application/use-cases/UpdateRegistrationPhaseUseCase';
import { IRegistrationPhaseRepository } from '../../../../src/domain/repositories/IRegistrationPhaseRepository';

describe('UpdateRegistrationPhaseUseCase', () => {
    let useCase: UpdateRegistrationPhaseUseCase;
    let mockRepo: jest.Mocked<IRegistrationPhaseRepository>;

    beforeEach(() => {
        mockRepo = {
            addPhase: jest.fn(),
            deletePhase: jest.fn(),
            getPhases: jest.fn(),
            updatePhase: jest.fn(),
        };
        useCase = new UpdateRegistrationPhaseUseCase(mockRepo);
    });

    it('should call updatePhase on the repository with correct data', async () => {
        const mockPhase = { id: '1', name: 'Phase 1 Updated', startTime: '2024-01-01', endTime: '2024-01-10', isClassRegistration: false, semesterId: 1, isActive: true, semesterName: 'HK1' };
        await useCase.execute(mockPhase);
        expect(mockRepo.updatePhase).toHaveBeenCalledWith(mockPhase);
    });
});
