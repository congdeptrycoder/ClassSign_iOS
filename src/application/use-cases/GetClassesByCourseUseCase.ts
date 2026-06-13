import { IAdminRepository } from '../../domain/repositories/IAdminRepository';

export class GetClassesByCourseUseCase {
    constructor(private adminRepository: IAdminRepository) {}

    async execute(courseId: number, semester: number): Promise<any[]> {
        return await this.adminRepository.getClassesByCourse(courseId, semester);
    }
}
