import { RegistrationPhase } from '../../domain/entities/RegistrationPhase';
import { IRegistrationPhaseRepository } from '../../domain/repositories/IRegistrationPhaseRepository';

export class RegistrationPhaseRepositoryImpl implements IRegistrationPhaseRepository {
  private static instance: RegistrationPhaseRepositoryImpl;
  private phases: RegistrationPhase[] = [];
  private listeners: ((phases: RegistrationPhase[]) => void)[] = [];

  private constructor() {
    // Mặc định không có giai đoạn đăng ký nào khi khởi chạy ứng dụng
    this.phases = [];
  }

  public static getInstance(): RegistrationPhaseRepositoryImpl {
    if (!RegistrationPhaseRepositoryImpl.instance) {
      RegistrationPhaseRepositoryImpl.instance = new RegistrationPhaseRepositoryImpl();
    }
    return RegistrationPhaseRepositoryImpl.instance;
  }

  public getPhases(): RegistrationPhase[] {
    return [...this.phases];
  }

  public addPhase(phase: Omit<RegistrationPhase, 'id'>): RegistrationPhase {
    const newPhase: RegistrationPhase = {
      ...phase,
      id: Math.random().toString(36).substring(2, 9),
    };
    this.phases.push(newPhase);
    this.notify();
    return newPhase;
  }

  public updatePhase(updatedPhase: RegistrationPhase): void {
    this.phases = this.phases.map(p => (p.id === updatedPhase.id ? updatedPhase : p));
    this.notify();
  }

  public deletePhase(id: string): void {
    this.phases = this.phases.filter(p => p.id !== id);
    this.notify();
  }

  public getActivePhase(currentTime?: Date): RegistrationPhase | null {
    const now = currentTime || new Date();
    
    for (const phase of this.phases) {
      try {
        // Thay thế khoảng trắng bằng 'T' để Date parser hoạt động ổn định trên mọi nền tảng
        const start = new Date(phase.startTime.replace(' ', 'T'));
        const end = new Date(phase.endTime.replace(' ', 'T'));
        if (now >= start && now <= end) {
          return phase;
        }
      } catch (error) {
        console.error('Lỗi khi parse thời gian của giai đoạn đăng ký:', error);
      }
    }
    return null;
  }

  public subscribe(callback: (phases: RegistrationPhase[]) => void): () => void {
    this.listeners.push(callback);
    // Gọi callback ngay khi vừa đăng ký để nhận giá trị hiện tại
    callback(this.getPhases());
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.getPhases());
      } catch (error) {
        console.error('Lỗi khi gọi listener thông báo thay đổi giai đoạn:', error);
      }
    }
  }
}
export default RegistrationPhaseRepositoryImpl;
