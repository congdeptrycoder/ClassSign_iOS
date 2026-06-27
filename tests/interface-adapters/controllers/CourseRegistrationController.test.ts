import { CourseRegistrationController } from '../../../src/interface-adapters/controllers/CourseRegistrationController';
import { GetCurriculumUseCase } from '../../../src/application/use-cases/GetCurriculumUseCase';
import { GetRegisteredCoursesUseCase } from '../../../src/application/use-cases/GetRegisteredCoursesUseCase';
import { SearchCourseSuggestionsUseCase } from '../../../src/application/use-cases/SearchCourseSuggestionsUseCase';
import { RegisterCourseUseCase } from '../../../src/application/use-cases/RegisterCourseUseCase';
import { CancelCourseRegistrationUseCase } from '../../../src/application/use-cases/CancelCourseRegistrationUseCase';

describe('CourseRegistrationController', () => {
    let controller: CourseRegistrationController;
    let mockGetCurriculumUseCase: jest.Mocked<GetCurriculumUseCase>;
    let mockGetRegisteredCoursesUseCase: jest.Mocked<GetRegisteredCoursesUseCase>;
    let mockSearchCourseSuggestionsUseCase: jest.Mocked<SearchCourseSuggestionsUseCase>;
    let mockRegisterCourseUseCase: jest.Mocked<RegisterCourseUseCase>;
    let mockCancelCourseRegistrationUseCase: jest.Mocked<CancelCourseRegistrationUseCase>;

    beforeEach(() => {
        mockGetCurriculumUseCase = { execute: jest.fn() } as any;
        mockGetRegisteredCoursesUseCase = { execute: jest.fn() } as any;
        mockSearchCourseSuggestionsUseCase = { execute: jest.fn() } as any;
        mockRegisterCourseUseCase = { execute: jest.fn() } as any;
        mockCancelCourseRegistrationUseCase = { execute: jest.fn() } as any;

        controller = new CourseRegistrationController(
            mockGetCurriculumUseCase,
            mockGetRegisteredCoursesUseCase,
            mockSearchCourseSuggestionsUseCase,
            mockRegisterCourseUseCase,
            mockCancelCourseRegistrationUseCase
        );
    });

    it('should call getCurriculum on getCurriculumUseCase', async () => {
        const studentId = 1;
        const mockResult = { test: 'curriculum' } as any;
        mockGetCurriculumUseCase.execute.mockResolvedValue(mockResult);

        const result = await controller.getCurriculum(studentId);
        expect(mockGetCurriculumUseCase.execute).toHaveBeenCalledWith(studentId);
        expect(result).toEqual(mockResult);
    });

    it('should call getRegisteredCourses on getRegisteredCoursesUseCase', async () => {
        const studentId = 1;
        const mockResult = { semester: '20241', courses: [] } as any;
        mockGetRegisteredCoursesUseCase.execute.mockResolvedValue(mockResult);

        const result = await controller.getRegisteredCourses(studentId);
        expect(mockGetRegisteredCoursesUseCase.execute).toHaveBeenCalledWith(studentId);
        expect(result).toEqual(mockResult);
    });

    it('should call searchCourseSuggestions on searchCourseSuggestionsUseCase', async () => {
        const studentId = 1;
        const query = 'Toán';
        const mockResult = [{ id: 1, courseName: 'Toán' }] as any;
        mockSearchCourseSuggestionsUseCase.execute.mockResolvedValue(mockResult);

        const result = await controller.searchCourseSuggestions(studentId, query);
        expect(mockSearchCourseSuggestionsUseCase.execute).toHaveBeenCalledWith(studentId, query);
        expect(result).toEqual(mockResult);
    });

    it('should call registerCourse on registerCourseUseCase', async () => {
        const studentId = 1;
        const courseId = 101;
        const mockResult = { id: 1, courseId } as any;
        mockRegisterCourseUseCase.execute.mockResolvedValue(mockResult);

        const result = await controller.registerCourse(studentId, courseId);
        expect(mockRegisterCourseUseCase.execute).toHaveBeenCalledWith(studentId, courseId);
        expect(result).toEqual(mockResult);
    });

    it('should call cancelCourseRegistration on cancelCourseRegistrationUseCase', async () => {
        const studentId = 1;
        const courseId = 101;
        const semester = '20241';
        mockCancelCourseRegistrationUseCase.execute.mockResolvedValue();

        await controller.cancelCourseRegistration(studentId, courseId, semester);
        expect(mockCancelCourseRegistrationUseCase.execute).toHaveBeenCalledWith(studentId, courseId, semester);
    });
});
