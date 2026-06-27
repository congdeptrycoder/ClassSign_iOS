/**
 * statusLabelUtils.ts — Shared Utility
 *
 * Chuyển đổi status code từ DB sang nhãn hiển thị tiếng Việt.
 * Tách ra khỏi ViewModel để tuân thủ SRP:
 * - ViewModel chỉ quản lý state
 * - Utility này chỉ chứa logic format/display
 */

/**
 * Chuyển đổi status code đăng ký học phần sang nhãn tiếng Việt.
 * @param status - Giá trị gốc từ DB: 'registered' | 're_registered' | 'completed' | 'cancelled'
 * @returns Nhãn hiển thị tiếng Việt
 */
export function toStatusLabel(status: string): string {
    if (status === 'completed') return 'Đã học';
    if (status === 'registered') return 'Học phần chưa hoàn thành';
    if (status === 're_registered') return 'Học cải thiện';
    if (status === 'cancelled') return 'Đã hủy';
    return status;
}
