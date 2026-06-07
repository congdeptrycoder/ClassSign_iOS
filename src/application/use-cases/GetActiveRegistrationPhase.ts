import { RegistrationPhase } from '../../domain/entities/RegistrationPhase';

export class GetActiveRegistrationPhase {
  public execute(phases: RegistrationPhase[], currentTime?: Date): RegistrationPhase | null {
    const now = currentTime || new Date();
    
    for (const phase of phases) {
      try {
        if (phase.isActive === 1) {
          const start = new Date(phase.startTime.replace(' ', 'T'));
          const end = new Date(phase.endTime.replace(' ', 'T'));
          if (now >= start && now <= end) {
            return phase;
          }
        }
      } catch (error) {
        console.error('Lỗi khi parse thời gian của giai đoạn đăng ký:', error);
      }
    }
    return null;
  }
}
