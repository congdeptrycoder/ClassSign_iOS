import { AccountRepositoryImpl } from '../../../src/infrastructure/repositories/AccountRepositoryImpl';
import { apiClient } from '../../../src/infrastructure/api/apiClient';

// Mock module apiClient
jest.mock('../../../src/infrastructure/api/apiClient', () => ({
    apiClient: {
        post: jest.fn(),
    },
}));

describe('AccountRepositoryImpl', () => {
    let repo: AccountRepositoryImpl;

    beforeEach(() => {
        repo = new AccountRepositoryImpl();
        jest.clearAllMocks();
    });

    it('nên trả về Account khi server phản hồi thành công', async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                user: {
                    id: 1,
                    username: 'admin',
                    name: 'Administrator',
                    role: 'admin',
                },
            },
        });

        const account = await repo.login('admin', '123');

        expect(account).toEqual({
            id: 1,
            username: 'admin',
            name: 'Administrator',
            role: 'admin',
        });
        expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
            username: 'admin',
            password: '123',
        });
    });

    it('nên throw error khi server trả về success: false', async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Tài khoản hoặc mật khẩu không đúng.',
        });

        await expect(repo.login('admin', 'wrong')).rejects.toThrow(
            'Tài khoản hoặc mật khẩu không đúng.'
        );
    });

    it('nên throw error khi mạng lỗi', async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Lỗi kết nối đến server.',
        });

        await expect(repo.login('admin', '123')).rejects.toThrow(
            'Lỗi kết nối đến server.'
        );
    });
});
