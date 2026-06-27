import { AddRegistrationPhaseUseCase } from '../../../../src/application/use-cases/AddRegistrationPhaseUseCase';
import { IRegistrationPhaseRepository } from '../../../../src/domain/repositories/IRegistrationPhaseRepository';

describe('AddRegistrationPhaseUseCase', () => {
    let useCase: AddRegistrationPhaseUseCase;
    let mockRepo: jest.Mocked<IRegistrationPhaseRepository>;

    beforeEach(() => {
        mockRepo = {
            addPhase: jest.fn(),
            deletePhase: jest.fn(),
            getPhases: jest.fn(),
            updatePhase: jest.fn(),
        };
        useCase = new AddRegistrationPhaseUseCase(mockRepo);
    });

    it('should call addPhase on the repository with correct data', async () => {
        const mockPhase = { name: 'Phase 1', startTime: '2024-01-01', endTime: '2024-01-10', isClassRegistration: false, semesterId: 1 };
        const mockResult = { id: '1', ...mockPhase, isActive: false, semesterName: 'HK1' };
        mockRepo.addPhase.mockResolvedValue(mockResult);

        const result = await useCase.execute(mockPhase);
        expect(mockRepo.addPhase).toHaveBeenCalledWith(mockPhase);
        expect(result).toEqual(mockResult);
    });
});
