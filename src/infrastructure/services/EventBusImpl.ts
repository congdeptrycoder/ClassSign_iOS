import { IEventBus, AppEvents } from '../../application/interfaces/IEventBus';

type EventHandler<T> = T extends undefined ? () => void : (data: T) => void;

/**
 * EventBusImpl.ts — Infrastructure Layer
 *
 * Implementation của IEventBus interface.
 * Dùng pattern pub/sub đơn giản với Map để lưu handlers.
 *
 * Design Pattern: Observer (Concrete Subject / Event Bus)
 * SOLID:
 *   - SRP: chỉ chịu trách nhiệm quản lý events
 *   - DIP: implement IEventBus, không expose chi tiết nội bộ
 */
export class EventBusImpl implements IEventBus {
  private readonly events = new Map<string, Set<Function>>();

  on<K extends keyof AppEvents>(event: K, handler: EventHandler<AppEvents[K]>): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler);
  }

  off<K extends keyof AppEvents>(event: K, handler: EventHandler<AppEvents[K]>): void {
    this.events.get(event)?.delete(handler);
  }

  emit<K extends keyof AppEvents>(
    ...args: AppEvents[K] extends undefined ? [K] : [K, AppEvents[K]]
  ): void {
    const [event, data] = args as [K, AppEvents[K]];
    const handlers = this.events.get(event);
    if (!handlers) return;
    handlers.forEach(handler => {
      try {
        (handler as Function)(data);
      } catch (error) {
        console.error(`[EventBus] Error in handler for "${event}":`, error);
      }
    });
  }
}
