import { DeleteRegistrationPhaseUseCase } from '../../../../src/application/use-cases/DeleteRegistrationPhaseUseCase';
import { IRegistrationPhaseRepository } from '../../../../src/domain/repositories/IRegistrationPhaseRepository';

describe('DeleteRegistrationPhaseUseCase', () => {
    let useCase: DeleteRegistrationPhaseUseCase;
    let mockRepo: jest.Mocked<IRegistrationPhaseRepository>;

    beforeEach(() => {
        mockRepo = {
            addPhase: jest.fn(),
            deletePhase: jest.fn(),
            getPhases: jest.fn(),
            updatePhase: jest.fn(),
        };
        useCase = new DeleteRegistrationPhaseUseCase(mockRepo);
    });

    it('should call deletePhase on the repository with correct id', async () => {
        const mockId = 'phase-1';
        await useCase.execute(mockId);
        expect(mockRepo.deletePhase).toHaveBeenCalledWith(mockId);
    });
});
