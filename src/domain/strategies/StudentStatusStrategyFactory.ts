import { IStudentStatusStrategy } from './IStudentStatusStrategy';
import { NormalStudyStrategy } from './NormalStudyStrategy';
import { Warning1StudyStrategy } from './Warning1StudyStrategy';
import { Warning2StudyStrategy } from './Warning2StudyStrategy';
import { Warning3StudyStrategy } from './Warning3StudyStrategy';

export class StudentStatusStrategyFactory {
    static getStrategy(statusStr?: string | null): IStudentStatusStrategy {
        if (!statusStr) return new NormalStudyStrategy();
        
        const lowerStatus = statusStr.toLowerCase();
        
        if (lowerStatus.includes('cảnh cáo mức 1')) {
            return new Warning1StudyStrategy();
        } else if (lowerStatus.includes('cảnh cáo mức 2')) {
            return new Warning2StudyStrategy();
        } else if (lowerStatus.includes('cảnh cáo mức 3')) {
            return new Warning3StudyStrategy();
        }
        
        return new NormalStudyStrategy();
    }
}
