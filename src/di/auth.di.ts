import { LoginUseCase } from '../application/use-cases/LoginUseCase';
import { AccountRepositoryImpl } from '../infrastructure/repositories/AccountRepositoryImpl';

const accountRepository = new AccountRepositoryImpl();
export const loginUseCase = new LoginUseCase(accountRepository);
