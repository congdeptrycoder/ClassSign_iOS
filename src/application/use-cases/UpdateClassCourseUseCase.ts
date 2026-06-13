import { IAdminRepository } from '../../domain/repositories/IAdminRepository';

export class UpdateClassCourseUseCase {
    constructor(private adminRepository: IAdminRepository) {}

    async execute(id: number, data: any): Promise<void> {
        await this.adminRepository.updateClassCourse(id, data);
    }
}
