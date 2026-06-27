import { RegistrationPhase } from '../../domain/entities/RegistrationPhase';

/**
 * IRegistrationPhaseObservable.ts — Application Layer Interface
 *
 * Tách biệt hành vi Observable ra khỏi Repository interface.
 * Repository chỉ chịu trách nhiệm truy xuất dữ liệu (SRP).
 * Observable chịu trách nhiệm thông báo khi dữ liệu thay đổi (Observer Pattern).
 *
 * Design Pattern: Observer (Subject/Observable)
 * SOLID:
 *   - SRP: Tách subscribe() ra khỏi IRegistrationPhaseRepository
 *   - ISP: ViewModel chỉ cần Observable không cần toàn bộ Repository
 *   - DIP: ViewModel phụ thuộc interface này, không phụ thuộc RegistrationPhaseRepositoryImpl
 */
export interface IRegistrationPhaseObservable {
  /**
   * Đăng ký nhận thông báo khi danh sách giai đoạn đăng ký thay đổi.
   * @param callback - Hàm được gọi mỗi khi data thay đổi
   * @returns Hàm unsubscribe — phải gọi trong cleanup của useEffect để tránh memory leak
   */
  subscribe(callback: (phases: RegistrationPhase[]) => void): () => void;
}
