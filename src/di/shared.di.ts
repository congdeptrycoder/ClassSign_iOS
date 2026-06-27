/**
 * shared.di.ts — Dependency Injection (Shared)
 *
 * Khởi tạo singleton EventBus dùng chung cho toàn bộ ứng dụng.
 * Import từ đây để đảm bảo cùng một instance được dùng ở mọi nơi.
 *
 * Design Pattern: Observer + Singleton (qua module-level export)
 */
import { EventBusImpl } from '../infrastructure/services/EventBusImpl';
import { IEventBus } from '../application/interfaces/IEventBus';

export const appEventBus: IEventBus = new EventBusImpl();
