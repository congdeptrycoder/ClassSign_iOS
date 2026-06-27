import { RegistrationPhase } from '../entities/RegistrationPhase';

/**
 * IRegistrationPhaseRepository — Domain Repository Interface
 *
 * Chỉ định nghĩa các phương thức truy xuất và thao tác dữ liệu (CRUD).
 * Hành vi Observable (subscribe/notify) được tách sang IRegistrationPhaseObservable
 * tại application/interfaces/ để tuân thủ SRP và ISP.
 *
 * SOLID:
 *   - SRP: Repository chỉ chịu trách nhiệm truy xuất dữ liệu
 *   - ISP: ViewModel chỉ cần Observable, không cần toàn bộ Repository
 */
export interface IRegistrationPhaseRepository {
  getPhases(): Promise<RegistrationPhase[]>;
  addPhase(phase: Omit<RegistrationPhase, 'id' | 'isActive' | 'semesterName'>): Promise<RegistrationPhase>;
  updatePhase(phase: RegistrationPhase): Promise<void>;
  deletePhase(id: string): Promise<void>;
}
