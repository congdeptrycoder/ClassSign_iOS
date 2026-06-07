import { RegistrationPhase } from '../../domain/entities/RegistrationPhase';
import { IRegistrationPhaseRepository } from '../../domain/repositories/IRegistrationPhaseRepository';
import { apiClient } from '../api/apiClient';

export class RegistrationPhaseRepositoryImpl implements IRegistrationPhaseRepository {
  private static instance: RegistrationPhaseRepositoryImpl;
  private phases: RegistrationPhase[] = [];
  private listeners: ((phases: RegistrationPhase[]) => void)[] = [];

  private constructor() {}

  public static getInstance(): RegistrationPhaseRepositoryImpl {
    if (!RegistrationPhaseRepositoryImpl.instance) {
      RegistrationPhaseRepositoryImpl.instance = new RegistrationPhaseRepositoryImpl();
    }
    return RegistrationPhaseRepositoryImpl.instance;
  }

  private async fetchPhasesFromApi(): Promise<void> {
    const res = await apiClient.get<{ success: boolean, data: RegistrationPhase[] }>('/academic-periods');
    if (res.success && res.data) {
      this.phases = res.data.data || [];
      this.notify();
    } else {
      console.error('Lỗi khi fetch phases:', res.message);
    }
  }

  public async getPhases(): Promise<RegistrationPhase[]> {
    await this.fetchPhasesFromApi();
    return [...this.phases];
  }

  public async addPhase(phase: Omit<RegistrationPhase, 'id' | 'isActive' | 'semesterName'>): Promise<RegistrationPhase> {
    const res = await apiClient.post<{ success: boolean, data: { id: string } }>('/academic-periods', phase);
    if (!res.success || !res.data) {
      throw new Error(res.message || 'Lỗi khi thêm kế hoạch đăng ký.');
    }
    
    // Tải lại toàn bộ danh sách để cập nhật is_active các phase cũ
    await this.fetchPhasesFromApi();
    
    return { ...phase, id: res.data.data.id, isActive: 1 };
  }

  public async updatePhase(updatedPhase: RegistrationPhase): Promise<void> {
    const res = await apiClient.put(`/academic-periods/${updatedPhase.id}`, updatedPhase);
    if (!res.success) {
      throw new Error(res.message || 'Lỗi khi cập nhật kế hoạch đăng ký.');
    }
    await this.fetchPhasesFromApi();
  }

  public async deletePhase(id: string): Promise<void> {
    const res = await apiClient.delete(`/academic-periods/${id}`);
    if (!res.success) {
      throw new Error(res.message || 'Lỗi khi xóa kế hoạch đăng ký.');
    }
    await this.fetchPhasesFromApi();
  }


  public subscribe(callback: (phases: RegistrationPhase[]) => void): () => void {
    this.listeners.push(callback);
    // Gọi API để fetch dữ liệu lần đầu khi subscribe
    this.fetchPhasesFromApi().then(() => {
      callback(this.phases);
    });
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener([...this.phases]);
      } catch (error) {
        console.error('Lỗi khi gọi listener thông báo thay đổi giai đoạn:', error);
      }
    }
  }
}
export default RegistrationPhaseRepositoryImpl;
