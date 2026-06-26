import { Semester } from '../entities/Semester';

export interface ISemesterRepository {
    getSemesters(): Promise<Semester[]>;
    createSemester(semesterCode: string): Promise<void>;
}
