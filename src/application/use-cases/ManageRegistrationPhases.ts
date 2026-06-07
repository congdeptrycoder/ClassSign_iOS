import { RegistrationPhase } from '../../domain/entities/RegistrationPhase';
import { IRegistrationPhaseRepository } from '../../domain/repositories/IRegistrationPhaseRepository';

export class ManageRegistrationPhases {
  constructor(private phaseRepository: IRegistrationPhaseRepository) {}

  public async getPhases(): Promise<RegistrationPhase[]> {
    return await this.phaseRepository.getPhases();
  }

  public async addPhase(phase: Omit<RegistrationPhase, 'id' | 'isActive' | 'semesterName'>): Promise<RegistrationPhase> {
    // Ràng buộc nghiệp vụ: Thời gian kết thúc phải sau thời gian bắt đầu
    const start = new Date(phase.startTime.replace(' ', 'T'));
    const end = new Date(phase.endTime.replace(' ', 'T'));
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Định dạng thời gian không hợp lệ. Vui lòng nhập YYYY-MM-DD HH:mm');
    }
    
    if (end <= start) {
      throw new Error('Thời gian kết thúc phải sau thời gian bắt đầu!');
    }

    return await this.phaseRepository.addPhase(phase);
  }

  public async updatePhase(phase: RegistrationPhase): Promise<void> {
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

  public async deletePhase(id: string): Promise<void> {
    await this.phaseRepository.deletePhase(id);
  }
}
export default ManageRegistrationPhases;
