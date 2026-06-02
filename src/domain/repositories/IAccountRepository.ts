import { Account } from '../entities/Account';

/**
 * Repository interface (Port) cho việc xác thực tài khoản.
 * Tuân thủ Dependency Inversion Principle:
 * - Domain định nghĩa interface này
 * - Infrastructure implement nó (AccountRepositoryImpl)
 */
export interface IAccountRepository {
    /**
     * Xác thực đăng nhập bằng username và password.
     * @param username - Tên đăng nhập
     * @param password - Mật khẩu dạng TEXT thuần
     * @returns Promise<Account> nếu thành công
     * @throws Error nếu sai thông tin hoặc lỗi mạng
     */
    login(username: string, password: string): Promise<Account>;
}
