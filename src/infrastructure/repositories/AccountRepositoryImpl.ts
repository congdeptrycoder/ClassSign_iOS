import { Account } from '../../domain/entities/Account';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { apiClient } from '../api/apiClient';

interface LoginResponseData {
    user: {
        id: number;
        username: string;
        name: string;
        role: 'admin' | 'student' | 'lecturer';
    };
}

/**
 * Triển khai IAccountRepository sử dụng backend HTTP API.
 * Tuân thủ Repository Pattern và DIP.
 */
export class AccountRepositoryImpl implements IAccountRepository {
    /**
     * Gọi API đăng nhập và trả về Account entity.
     * @throws Error nếu đăng nhập thất bại hoặc lỗi mạng
     */
    async login(username: string, password: string): Promise<Account> {
        try {
            const response = await apiClient.post<LoginResponseData>(
                '/auth/login',
                { username, password }
            );

            if (!response.success || !response.data) {
                throw new Error(
                    response.message ?? 'Đăng nhập thất bại. Vui lòng thử lại.'
                );
            }

            const { user } = response.data;
            return {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
            };
        } catch (err) {
            if (err instanceof Error) throw err;
            throw new Error('Lỗi không xác định khi đăng nhập.');
        }
    }
}
