import { useState } from 'react';
import { LoginUseCase } from '../../../application/use-cases/LoginUseCase';
import { loginUseCase as defaultLoginUseCase } from '../../../di/container';
import { Account } from '../../../domain/entities/Account';

/**
 * ViewModel cho màn hình đăng nhập.
 *
 * Tuân thủ MVVM: chỉ quản lý UI state và gọi UseCase,
 * không chứa business logic.
 *
 * Tuân thủ DIP: nhận LoginUseCase qua parameter (dễ mock trong test).
 */
export const useLoginViewModel = (
    onLoginSuccess?: (account: Account) => void,
    loginUseCaseDep: LoginUseCase = defaultLoginUseCase
) => {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [account, setAccount] = useState<Account | null>(null);

    const handleLogin = async (currentUsername: string) => {
        setError(null);
        setIsLoading(true);
        setAccount(null);

        try {
            const acc = await loginUseCaseDep.execute(currentUsername, password);
            setAccount(acc);
            // Không gọi onLoginSuccess ở đây, để component xử lý after animation
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Đăng nhập thất bại. Vui lòng thử lại.';
            setError(message);
            console.error('[LoginViewModel] Lỗi đăng nhập:', message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        password,
        setPassword,
        handleLogin,
        isLoading,
        error,
        account,
    };
};
