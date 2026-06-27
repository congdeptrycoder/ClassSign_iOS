import { TimetableEntry } from '../../domain/entities/StudentRegistration';

/**
 * timetableUtils.ts — Shared Utility
 *
 * Chứa logic parse và xử lý dữ liệu thời khóa biểu.
 * Tách ra khỏi ViewModel để tuân thủ SRP:
 * - ViewModel chỉ quản lý state và điều phối action
 * - Utility này chỉ chứa logic biến đổi dữ liệu timetable
 */

export interface TimeEvent {
    day: string;
    period: number;
    name: string;
}

/**
 * Parse danh sách TimetableEntry thành mảng TimeEvent để render lên lưới thời khóa biểu.
 * @param entries - Danh sách lớp học đã đăng ký từ API
 * @returns Mảng TimeEvent mô tả từng tiết học cụ thể
 */
export function parseTimetableEvents(entries: TimetableEntry[]): TimeEvent[] {
    return entries.flatMap(entry => {
        if (!entry.detail) return [];

        try {
            const detail = JSON.parse(entry.detail);

            if (detail.thu && detail.tiet_bd && detail.tiet_kt) {
                const dayStr = `T${detail.thu}`;
                let start = parseInt(detail.tiet_bd, 10);
                let end = parseInt(detail.tiet_kt, 10);
                if (isNaN(start) || isNaN(end)) return [];

                if (detail.buoi === 'Chiều') {
                    start += 6;
                    end += 6;
                }

                const events: TimeEvent[] = [];
                for (let i = start; i <= end; i++) {
                    events.push({
                        day: dayStr,
                        period: i,
                        name: entry.code,
                    });
                }
                return events;
            }

            const slots = Array.isArray(detail) ? detail : detail.slots;
            if (!Array.isArray(slots)) return [];

            return slots.flatMap((slot: any) => {
                const periods = Array.isArray(slot.periods)
                    ? slot.periods
                    : [slot.period].filter(Boolean);

                return periods.map((period: number) => ({
                    day: slot.day,
                    period,
                    name: entry.code,
                }));
            });
        } catch (_err) {
            return [];
        }
    });
}
