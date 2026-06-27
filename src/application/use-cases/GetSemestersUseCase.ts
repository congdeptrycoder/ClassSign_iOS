import { Semester } from '../../domain/entities/Semester';
import { ISemesterRepository } from '../../domain/repositories/ISemesterRepository';

/**
 * GetSemestersUseCase - Application Use Case
 * Lấy danh sách tất cả học kỳ trong hệ thống.
 *
 * Tuân thủ SRP: chỉ chịu trách nhiệm lấy danh sách học kỳ.
 * Tuân thủ DIP: phụ thuộc vào interface ISemesterRepository.
 */
export class GetSemestersUseCase {
    constructor(private readonly semesterRepository: ISemesterRepository) {}

    async execute(): Promise<Semester[]> {
        return this.semesterRepository.getSemesters();
    }
}
