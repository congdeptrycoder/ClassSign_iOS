import { AccountRepositoryImpl } from '../../../src/infrastructure/repositories/AccountRepositoryImpl';
import { apiClient } from '../../../src/infrastructure/api/apiClient';

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

    it('returns an account when login succeeds', async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({
            user: {
                id: 1,
                username: 'admin',
                name: 'Administrator',
                role: 'admin',
                id_card: 'PDT0030',
            },
        });

        const account = await repo.login('admin', '123');

        expect(account).toEqual({
            id: 1,
            username: 'admin',
            name: 'Administrator',
            role: 'admin',
            id_card: 'PDT0030',
        });
        expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
            username: 'admin',
            password: '123',
        });
    });

    it('propagates authentication errors from the API client', async () => {
        (apiClient.post as jest.Mock).mockRejectedValue(
            new Error('Tài khoản hoặc mật khẩu không đúng.')
        );

        await expect(repo.login('admin', 'wrong')).rejects.toThrow(
            'Tài khoản hoặc mật khẩu không đúng.'
        );
    });

    it('propagates network errors from the API client', async () => {
        (apiClient.post as jest.Mock).mockRejectedValue(
            new Error('Failed to connect to server.')
        );

        await expect(repo.login('admin', '123')).rejects.toThrow(
            'Failed to connect to server.'
        );
    });
});
