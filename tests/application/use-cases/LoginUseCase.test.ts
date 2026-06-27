import { LoginUseCase } from '../../../src/application/use-cases/LoginUseCase';
import { IAccountRepository } from '../../../src/domain/repositories/IAccountRepository';
import { Account } from '../../../src/domain/entities/Account';

const mockAccount: Account = new Account(
    1,
    'admin',
    'Administrator',
    'admin'
);

const mockRepository: IAccountRepository = {
    login: jest.fn(),
};

describe('LoginUseCase', () => {
    let useCase: LoginUseCase;

    beforeEach(() => {
        useCase = new LoginUseCase(mockRepository);
        jest.clearAllMocks();
    });

    it('nên trả về Account khi đăng nhập thành công', async () => {
        (mockRepository.login as jest.Mock).mockResolvedValue(mockAccount);

        const result = await useCase.execute('admin', '123');

        expect(result).toEqual(mockAccount);
        expect(mockRepository.login).toHaveBeenCalledWith('admin', '123');
    });

    it('nên throw error khi username rỗng', async () => {
        await expect(useCase.execute('', '123')).rejects.toThrow(
            'Vui lòng nhập đầy đủ tài khoản và mật khẩu.'
        );
        expect(mockRepository.login).not.toHaveBeenCalled();
    });

    it('nên throw error khi password rỗng', async () => {
        await expect(useCase.execute('admin', '')).rejects.toThrow(
            'Vui lòng nhập đầy đủ tài khoản và mật khẩu.'
        );
        expect(mockRepository.login).not.toHaveBeenCalled();
    });

    it('nên trim username trước khi gọi repository', async () => {
        (mockRepository.login as jest.Mock).mockResolvedValue(mockAccount);

        await useCase.execute('  admin  ', '123');

        expect(mockRepository.login).toHaveBeenCalledWith('admin', '123');
    });

    it('nên propagate error từ repository', async () => {
        (mockRepository.login as jest.Mock).mockRejectedValue(
            new Error('Sai mật khẩu')
        );

        await expect(useCase.execute('admin', 'wrong')).rejects.toThrow('Sai mật khẩu');
    });
});
