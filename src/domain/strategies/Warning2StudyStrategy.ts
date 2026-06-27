import { IStudentStatusStrategy } from './IStudentStatusStrategy';

export class Warning2StudyStrategy implements IStudentStatusStrategy {
    getMaxAllowedCredits(): number {
        return 14;
    }

    getRegistrationStatusNote(): string {
        return 'Cảnh cáo mức 2: Bạn được đăng ký tối đa 14 TC';
    }
}
