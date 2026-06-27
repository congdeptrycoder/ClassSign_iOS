import { RegistrationPhase } from '../../domain/entities/RegistrationPhase';
import { IRegistrationPhaseRepository } from '../../domain/repositories/IRegistrationPhaseRepository';

export class UpdateRegistrationPhaseUseCase {
  constructor(private phaseRepository: IRegistrationPhaseRepository) {}

  public async execute(phase: RegistrationPhase): Promise<void> {
    const start = new Date(phase.startTime.replace(' ', 'T'));
    const end = new Date(phase.endTime.replace(' ', 'T'));
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Định dạng thời gian không hợp lệ. Vui lòng nhập YYYY-MM-DD HH:mm');
    }
    
    if (end <= start) {
      throw new Error('Thời gian kết thúc phải sau thời gian bắt đầu!');
    }

    await this.phaseRepository.updatePhase(phase);
  }
}
