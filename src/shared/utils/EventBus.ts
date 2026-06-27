/**
 * EventBus.ts — Shared Utils (Re-export shim)
 *
 * File này chỉ giữ lại để tương thích ngược trong quá trình migration.
 * Source of truth đã chuyển sang:
 *   - Interface: src/application/interfaces/IEventBus.ts
 *   - Implementation: src/infrastructure/services/EventBusImpl.ts
 *   - Singleton: inject qua src/di/student.di.ts và src/di/admin.di.ts
 *
 * @deprecated Import trực tiếp từ di/ thay vì từ file này.
 */

export { appEventBus as FrontendEventBus } from '../../di/shared.di';
export type { AppEvents } from '../../application/interfaces/IEventBus';

/**
 * Danh sách tên event (type-safe, không còn dùng string cứng).
 * Chỉ gồm các event ĐANG ĐƯỢC DÙNG THỰC TẾ.
 */
export const FRONTEND_EVENTS = {
  CLASS_SLOTS_CHANGED: 'CLASS_SLOTS_CHANGED',
  TIMETABLE_CHANGED: 'TIMETABLE_CHANGED',
} as const satisfies Record<string, keyof AppEvents>;
