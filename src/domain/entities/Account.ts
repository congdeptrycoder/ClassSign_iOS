/**
 * Domain entity đại diện cho một tài khoản trong hệ thống.
 * Ánh xạ từ bảng accounts trong SQLite.
 */
import { StudentStatusStrategyFactory } from '../strategies/StudentStatusStrategyFactory';

export class Account {
    constructor(
        public readonly id: number,
        public readonly username: string,
        public readonly name: string,
        public readonly role: 'admin' | 'student' | 'lecturer',
        public readonly id_card: string | null = null,
        public readonly status: string = 'study'
    ) {}

    getMaxAllowedCredits(): number {
        return StudentStatusStrategyFactory.getStrategy(this.status).getMaxAllowedCredits();
    }

    getRegistrationStatusNote(): string {
        return StudentStatusStrategyFactory.getStrategy(this.status).getRegistrationStatusNote();
    }
}
