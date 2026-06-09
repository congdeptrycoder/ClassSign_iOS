/**
 * Domain entity đại diện cho một tài khoản trong hệ thống.
 * Ánh xạ từ bảng accounts trong SQLite.
 */
export interface Account {
    id: number;
    username: string;
    name: string;
    role: 'admin' | 'student' | 'lecturer';
    id_card?: string | null;
}
