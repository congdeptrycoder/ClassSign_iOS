import { IAdminRepository } from '../../domain/repositories/IAdminRepository';

export class CreateClassCourseUseCase {
    constructor(private adminRepository: IAdminRepository) {}

    async execute(data: any): Promise<void> {
        await this.adminRepository.createClassCourse(data);
    }
}
