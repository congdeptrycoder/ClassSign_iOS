import { ClassRegistrationController } from '../../../src/interface-adapters/controllers/ClassRegistrationController';
import { CancelClassRegistrationUseCase } from '../../../src/application/use-cases/CancelClassRegistrationUseCase';
import { GetCourseClassesUseCase } from '../../../src/application/use-cases/GetCourseClassesUseCase';
import { RegisterClassUseCase } from '../../../src/application/use-cases/RegisterClassUseCase';
import { SearchClassSuggestionsUseCase } from '../../../src/application/use-cases/SearchClassSuggestionsUseCase';

describe('ClassRegistrationController', () => {
    let controller: ClassRegistrationController;
    let mockSearchClassSuggestionsUseCase: jest.Mocked<SearchClassSuggestionsUseCase>;
    let mockGetCourseClassesUseCase: jest.Mocked<GetCourseClassesUseCase>;
    let mockRegisterClassUseCase: jest.Mocked<RegisterClassUseCase>;
    let mockCancelClassRegistrationUseCase: jest.Mocked<CancelClassRegistrationUseCase>;

    beforeEach(() => {
        mockSearchClassSuggestionsUseCase = { execute: jest.fn() } as any;
        mockGetCourseClassesUseCase = { execute: jest.fn() } as any;
        mockRegisterClassUseCase = { execute: jest.fn() } as any;
        mockCancelClassRegistrationUseCase = { execute: jest.fn() } as any;

        controller = new ClassRegistrationController(
            mockSearchClassSuggestionsUseCase,
            mockGetCourseClassesUseCase,
            mockRegisterClassUseCase,
            mockCancelClassRegistrationUseCase
        );
    });

    it('should call searchClassSuggestions on searchClassSuggestionsUseCase', async () => {
        const studentId = 1;
        const query = 'Lớp 1';
        const mockResult = [{ classId: 1, name: 'Lớp 1' }] as any;
        mockSearchClassSuggestionsUseCase.execute.mockResolvedValue(mockResult);

        const result = await controller.searchClassSuggestions(studentId, query);
        expect(mockSearchClassSuggestionsUseCase.execute).toHaveBeenCalledWith(studentId, query);
        expect(result).toEqual(mockResult);
    });

    it('should call getCourseClasses on getCourseClassesUseCase', async () => {
        const studentId = 1;
        const courseId = 101;
        const mockResult = [{ classId: 1, name: 'Lớp 1' }] as any;
        mockGetCourseClassesUseCase.execute.mockResolvedValue(mockResult);

        const result = await controller.getCourseClasses(studentId, courseId);
        expect(mockGetCourseClassesUseCase.execute).toHaveBeenCalledWith(studentId, courseId);
        expect(result).toEqual(mockResult);
    });

    it('should call registerClass on registerClassUseCase', async () => {
        const studentId = 1;
        const classId = 123;
        mockRegisterClassUseCase.execute.mockResolvedValue();

        await controller.registerClass(studentId, classId);
        expect(mockRegisterClassUseCase.execute).toHaveBeenCalledWith(studentId, classId);
    });

    it('should call cancelClassRegistration on cancelClassRegistrationUseCase', async () => {
        const studentId = 1;
        const classId = 123;
        mockCancelClassRegistrationUseCase.execute.mockResolvedValue();

        await controller.cancelClassRegistration(studentId, classId);
        expect(mockCancelClassRegistrationUseCase.execute).toHaveBeenCalledWith(studentId, classId);
    });
});
