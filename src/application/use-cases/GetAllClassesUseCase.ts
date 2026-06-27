import { IAdminRepository } from '../../domain/repositories/IAdminRepository';

/**
 * GetAllClassesUseCase - Application Use Case
 * Lấy toàn bộ danh sách lớp học theo học kỳ (dành cho Admin).
 *
 * Tuân thủ SRP: chỉ chịu trách nhiệm lấy danh sách lớp học toàn bộ.
 * Tuân thủ DIP: phụ thuộc vào interface IAdminRepository.
 */
export class GetAllClassesUseCase {
    constructor(private readonly adminRepository: IAdminRepository) {}

    async execute(semester: number): Promise<any[]> {
        if (!semester) {
            throw new Error('Học kỳ là bắt buộc.');
        }
        return this.adminRepository.getAllClasses(semester);
    }
}
