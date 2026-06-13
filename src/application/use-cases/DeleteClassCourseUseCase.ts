import { IAdminRepository } from '../../domain/repositories/IAdminRepository';

export class DeleteClassCourseUseCase {
    constructor(private adminRepository: IAdminRepository) {}

    async execute(id: number): Promise<void> {
        await this.adminRepository.deleteClassCourse(id);
    }
}
