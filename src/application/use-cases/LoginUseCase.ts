import { Account } from '../../domain/entities/Account';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';

/**
 * Use Case: Đăng nhập vào hệ thống.
 *
 * Tuân thủ SRP: chỉ chịu trách nhiệm điều phối luồng đăng nhập.
 * Tuân thủ DIP: phụ thuộc vào interface IAccountRepository, không phụ thuộc implementation.
 */
export class LoginUseCase {
    constructor(private readonly accountRepository: IAccountRepository) {}

    /**
     * Thực hiện đăng nhập.
     * @param username - Tên đăng nhập
     * @param password - Mật khẩu
     * @returns Account nếu đăng nhập thành công
     * @throws Error nếu thất bại
     */
    async execute(username: string, password: string): Promise<Account> {
        if (!username.trim() || !password.trim()) {
            throw new Error('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
        }

        return this.accountRepository.login(username.trim(), password);
    }
}
