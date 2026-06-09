import { Account } from '../../domain/entities/Account';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { apiClient } from '../api/apiClient';

interface LoginResponseData {
    user: {
        id: number;
        username: string;
        name: string;
        role: 'admin' | 'student' | 'lecturer';
        id_card?: string | null;
    };
}

export class AccountRepositoryImpl implements IAccountRepository {
    async login(username: string, password: string): Promise<Account> {
        try {
            const { user } = await apiClient.post<LoginResponseData>('/auth/login', {
                username,
                password,
            });

            return {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                id_card: user.id_card,
            };
        } catch (err) {
            if (err instanceof Error) throw err;
            throw new Error('Unknown login error.');
        }
    }
}
