import { RegistrationPhase } from '../../domain/entities/RegistrationPhase';
import { IRegistrationPhaseRepository } from '../../domain/repositories/IRegistrationPhaseRepository';
import { IRegistrationPhaseObservable } from '../../application/interfaces/IRegistrationPhaseObservable';
import { apiClient } from '../api/apiClient';

interface CreatedRegistrationPhaseResponse {
  id: string;
}

/**
 * RegistrationPhaseRepositoryImpl — Infrastructure Layer
 *
 * Implement 2 interface độc lập:
 *   1. IRegistrationPhaseRepository  → CRUD (Repository Pattern)
 *   2. IRegistrationPhaseObservable  → subscribe/notify (Observer Pattern)
 *
 * Dùng Singleton để đảm bảo tất cả subscriber dùng chung một state.
 *
 * SOLID:
 *   - SRP: Mỗi interface chịu một trách nhiệm riêng biệt
 *   - OCP: Thêm observer mới không cần sửa Repository logic
 *   - DIP: ViewModel phụ thuộc interface, không phụ thuộc class này
 */
export class RegistrationPhaseRepositoryImpl
  implements IRegistrationPhaseRepository, IRegistrationPhaseObservable
{
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

  // ── IRegistrationPhaseRepository (CRUD) ─────────────────────────────────────

  private async fetchPhasesFromApi(): Promise<void> {
    this.phases = await apiClient.get<RegistrationPhase[]>('/academic-periods');
    this.notify();
  }

  public async getPhases(): Promise<RegistrationPhase[]> {
    await this.fetchPhasesFromApi();
    return [...this.phases];
  }

  public async addPhase(
    phase: Omit<RegistrationPhase, 'id' | 'isActive' | 'semesterName'>
  ): Promise<RegistrationPhase> {
    const created = await apiClient.post<CreatedRegistrationPhaseResponse>(
      '/academic-periods',
      phase
    );
    await this.fetchPhasesFromApi();
    return { ...phase, id: created.id, isActive: 1 };
  }

  public async updatePhase(updatedPhase: RegistrationPhase): Promise<void> {
    await apiClient.put<null>(`/academic-periods/${updatedPhase.id}`, updatedPhase);
    await this.fetchPhasesFromApi();
  }

  public async deletePhase(id: string): Promise<void> {
    await apiClient.delete<null>(`/academic-periods/${id}`);
    await this.fetchPhasesFromApi();
  }

  // ── IRegistrationPhaseObservable (Observer) ──────────────────────────────────

  public subscribe(callback: (phases: RegistrationPhase[]) => void): () => void {
    this.listeners.push(callback);
    this.fetchPhasesFromApi()
      .then(() => callback([...this.phases]))
      .catch(error => {
        console.error('Failed to fetch registration phases:', error);
        callback([...this.phases]);
      });

    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener([...this.phases]);
      } catch (error) {
        console.error('Failed to notify registration phase listener:', error);
      }
    }
  }
}

export default RegistrationPhaseRepositoryImpl;

