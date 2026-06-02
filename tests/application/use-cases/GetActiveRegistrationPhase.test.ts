import { GetActiveRegistrationPhase } from '../../../src/application/use-cases/GetActiveRegistrationPhase';
import { IRegistrationPhaseRepository } from '../../../src/domain/repositories/IRegistrationPhaseRepository';
import { RegistrationPhase } from '../../../src/domain/entities/RegistrationPhase';

describe('GetActiveRegistrationPhase Use Case', () => {
  let mockRepository: jest.Mocked<IRegistrationPhaseRepository>;
  let useCase: GetActiveRegistrationPhase;

  beforeEach(() => {
    mockRepository = {
      getPhases: jest.fn(),
      addPhase: jest.fn(),
      updatePhase: jest.fn(),
      deletePhase: jest.fn(),
      getActivePhase: jest.fn(),
      subscribe: jest.fn(),
    };
    useCase = new GetActiveRegistrationPhase(mockRepository);
  });

  it('should call getActivePhase on the repository with current time', () => {
    const testTime = new Date('2026-06-02T13:00:00');
    const mockPhase: RegistrationPhase = {
      id: 'p1',
      type: 'course',
      startTime: '2026-06-02 12:00',
      endTime: '2026-06-02 15:00',
    };
    
    mockRepository.getActivePhase.mockReturnValue(mockPhase);

    const activePhase = useCase.execute(testTime);

    expect(mockRepository.getActivePhase).toHaveBeenCalledWith(testTime);
    expect(activePhase).toBe(mockPhase);
  });
});
