/**
 * IEventBus.ts — Application Layer Interface
 *
 * Định nghĩa contract cho Event Bus (Observer Pattern).
 * - AppEvents: map tên event → kiểu payload, đảm bảo type-safe.
 * - IEventBus: interface dùng để inject vào ViewModel (DIP).
 *
 * Design Pattern: Observer (Publisher/Subscriber)
 * SOLID: DIP — ViewModel phụ thuộc interface này, không phụ thuộc EventBusImpl.
 */

/**
 * Định nghĩa toàn bộ events và kiểu payload tương ứng.
 * - undefined: event không cần payload
 * - object: event cần payload cụ thể
 */
export interface AppEvents {
  /** Thời khóa biểu thay đổi (sau đăng ký/hủy lớp hoặc học phần) */
  TIMETABLE_CHANGED: undefined;
  /** Số chỗ trong một lớp thay đổi, payload chứa courseId để subscriber chỉ reload đúng khóa */
  CLASS_SLOTS_CHANGED: { courseId: number };
}

type EventHandler<T> = T extends undefined ? () => void : (data: T) => void;

/**
 * Interface cho Event Bus.
 * Dùng generic AppEvents để đảm bảo compile-time safety:
 * - emit(TIMETABLE_CHANGED) → không cần payload, TypeScript báo lỗi nếu truyền thừa
 * - emit(CLASS_SLOTS_CHANGED, { courseId }) → bắt buộc phải có payload đúng kiểu
 */
export interface IEventBus {
  on<K extends keyof AppEvents>(event: K, handler: EventHandler<AppEvents[K]>): void;
  off<K extends keyof AppEvents>(event: K, handler: EventHandler<AppEvents[K]>): void;
  emit<K extends keyof AppEvents>(
    ...args: AppEvents[K] extends undefined ? [K] : [K, AppEvents[K]]
  ): void;
}
