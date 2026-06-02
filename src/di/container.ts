/**
 * Dependency Injection Container (Manual DI).
 *
 * Nơi duy nhất khởi tạo và kết nối:
 *   AccountRepositoryImpl → LoginUseCase
 *
 * Tuân thủ:
 * - DIP: ViewModel / UseCase không biết về implementation cụ thể
 * - SRP: DI container chỉ lo việc wiring
 */

import { AccountRepositoryImpl } from '../infrastructure/repositories/AccountRepositoryImpl';
import { LoginUseCase } from '../application/use-cases/LoginUseCase';

// ── Singletons ────────────────────────────────────────────────────────────────

const accountRepository = new AccountRepositoryImpl();

export const loginUseCase = new LoginUseCase(accountRepository);
