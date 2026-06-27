import { IStudentStatusStrategy } from './IStudentStatusStrategy';

export class Warning3StudyStrategy implements IStudentStatusStrategy {
    getMaxAllowedCredits(): number {
        return 10;
    }

    getRegistrationStatusNote(): string {
        return 'Cảnh cáo mức 3: Bạn được đăng ký tối đa 10 TC';
    }
}
