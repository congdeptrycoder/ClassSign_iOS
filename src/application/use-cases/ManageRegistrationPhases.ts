import { RegistrationPhase } from '../../domain/entities/RegistrationPhase';
import { IRegistrationPhaseRepository } from '../../domain/repositories/IRegistrationPhaseRepository';

export class ManageRegistrationPhases {
  constructor(private phaseRepository: IRegistrationPhaseRepository) {}

  public getPhases(): RegistrationPhase[] {
    return this.phaseRepository.getPhases();
  }

  public addPhase(phase: Omit<RegistrationPhase, 'id'>): RegistrationPhase {
    // Ràng buộc nghiệp vụ: Thời gian kết thúc phải sau thời gian bắt đầu
    const start = new Date(phase.startTime.replace(' ', 'T'));
    const end = new Date(phase.endTime.replace(' ', 'T'));
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Định dạng thời gian không hợp lệ. Vui lòng nhập YYYY-MM-DD HH:mm');
    }
    
    if (end <= start) {
      throw new Error('Thời gian kết thúc phải sau thời gian bắt đầu!');
    }

    return this.phaseRepository.addPhase(phase);
  }

  public updatePhase(phase: RegistrationPhase): void {
    const start = new Date(phase.startTime.replace(' ', 'T'));
    const end = new Date(phase.endTime.replace(' ', 'T'));
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Định dạng thời gian không hợp lệ. Vui lòng nhập YYYY-MM-DD HH:mm');
    }
    
    if (end <= start) {
      throw new Error('Thời gian kết thúc phải sau thời gian bắt đầu!');
    }

    this.phaseRepository.updatePhase(phase);
  }

  public deletePhase(id: string): void {
    this.phaseRepository.deletePhase(id);
  }
}
export default ManageRegistrationPhases;
