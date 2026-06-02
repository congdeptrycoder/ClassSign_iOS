import { ManageRegistrationPhases } from '../../../src/application/use-cases/ManageRegistrationPhases';
import { IRegistrationPhaseRepository } from '../../../src/domain/repositories/IRegistrationPhaseRepository';

describe('ManageRegistrationPhases Use Case', () => {
  let mockRepository: jest.Mocked<IRegistrationPhaseRepository>;
  let useCase: ManageRegistrationPhases;

  beforeEach(() => {
    mockRepository = {
      getPhases: jest.fn(),
      addPhase: jest.fn(),
      updatePhase: jest.fn(),
      deletePhase: jest.fn(),
      getActivePhase: jest.fn(),
      subscribe: jest.fn(),
    };
    useCase = new ManageRegistrationPhases(mockRepository);
  });

  it('should successfully add a valid phase', () => {
    const newPhaseInput = {
      type: 'course' as const,
      startTime: '2026-06-02 12:00',
      endTime: '2026-06-02 15:00',
    };
    const returnedPhase = { id: 'p123', ...newPhaseInput };
    mockRepository.addPhase.mockReturnValue(returnedPhase);

    const result = useCase.addPhase(newPhaseInput);

    expect(mockRepository.addPhase).toHaveBeenCalledWith(newPhaseInput);
    expect(result).toBe(returnedPhase);
  });

  it('should throw an error if start or end time is invalid', () => {
    const invalidInput = {
      type: 'course' as const,
      startTime: 'invalid-date',
      endTime: '2026-06-02 15:00',
    };
    expect(() => useCase.addPhase(invalidInput)).toThrow(
      'Định dạng thời gian không hợp lệ. Vui lòng nhập YYYY-MM-DD HH:mm'
    );
  });

  it('should throw an error if end time is before or equal to start time', () => {
    const invalidRange = {
      type: 'course' as const,
      startTime: '2026-06-02 15:00',
      endTime: '2026-06-02 12:00',
    };
    expect(() => useCase.addPhase(invalidRange)).toThrow(
      'Thời gian kết thúc phải sau thời gian bắt đầu!'
    );
  });

  it('should call updatePhase on the repository for a valid update', () => {
    const updateInput = {
      id: 'p123',
      type: 'class' as const,
      startTime: '2026-06-02 10:00',
      endTime: '2026-06-02 12:00',
    };
    useCase.updatePhase(updateInput);
    expect(mockRepository.updatePhase).toHaveBeenCalledWith(updateInput);
  });

  it('should call deletePhase on the repository', () => {
    useCase.deletePhase('p123');
    expect(mockRepository.deletePhase).toHaveBeenCalledWith('p123');
  });
});
