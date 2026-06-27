import { IStudentStatusStrategy } from './IStudentStatusStrategy';

export class Warning1StudyStrategy implements IStudentStatusStrategy {
    getMaxAllowedCredits(): number {
        return 18;
    }

    getRegistrationStatusNote(): string {
        return 'Cảnh cáo mức 1: Bạn được đăng ký tối đa 18 TC';
    }
}
