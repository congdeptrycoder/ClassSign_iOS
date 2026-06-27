import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useCourseRegistrationViewModel } from '../../../../src/interface-adapters/viewmodels/StudentDashboard/useCourseRegistrationViewModel';
import { courseRegistrationController, appEventBus } from '../../../../src/di/student.di';
import { Account } from '../../../../src/domain/entities/Account';
import { Alert } from 'react-native';

jest.mock('../../../../src/di/student.di', () => ({
    courseRegistrationController: {
        getRegisteredCourses: jest.fn(),
        getCurriculum: jest.fn(),
        registerCourse: jest.fn(),
        cancelCourseRegistration: jest.fn(),
    },
    appEventBus: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
    }
}));

jest.spyOn(Alert, 'alert');

describe('useCourseRegistrationViewModel', () => {
    const mockAccount = new Account(1, 'student', 'Student 1', 'student', '123', 'study');
    let mockSetIsSubmitting: jest.Mock;
    let mockSetPopupConfig: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSetIsSubmitting = jest.fn();
        mockSetPopupConfig = jest.fn();

        (courseRegistrationController.getRegisteredCourses as jest.Mock).mockResolvedValue({
            studentStatus: 'study',
            courses: [{ id: 1, courseId: 101, semester: '20241', status: 'registered', code: 'IT101', name: 'Toán', credits: 3 }]
        });
        (courseRegistrationController.getCurriculum as jest.Mock).mockResolvedValue({
            courses: [{ id: 1, courseId: 101, code: 'IT101', name: 'Toán', credits: 3 }]
        });
    });

    it('should load initial data', async () => {
        const { result } = renderHook(() => useCourseRegistrationViewModel(mockAccount, 'course', mockSetIsSubmitting, mockSetPopupConfig));

        await waitFor(() => {
            expect(result.current.registeredSubjects.length).toBe(1);
        });

        expect(courseRegistrationController.getRegisteredCourses).toHaveBeenCalledWith(1);
        expect(courseRegistrationController.getCurriculum).toHaveBeenCalledWith(1);
    });

    it('should search courses when typing', async () => {
        const { result } = renderHook(() => useCourseRegistrationViewModel(mockAccount, 'course', mockSetIsSubmitting, mockSetPopupConfig));
        
        await waitFor(() => expect(result.current.registeredSubjects.length).toBe(1));

        act(() => {
            result.current.setSearchQueryCourse('IT101');
        });

        await waitFor(() => {
            expect(result.current.suggestionsCourse.length).toBe(1);
        }, { timeout: 1000 });
        
        expect(result.current.suggestionsCourse[0].code).toBe('IT101');
    });

    it('should register course successfully', async () => {
        (courseRegistrationController.registerCourse as jest.Mock).mockResolvedValue({ message: 'Success' });
        const { result } = renderHook(() => useCourseRegistrationViewModel(mockAccount, 'course', mockSetIsSubmitting, mockSetPopupConfig));
        
        await waitFor(() => expect(result.current.registeredSubjects.length).toBe(1));

        act(() => {
            result.current.setSearchQueryCourse('IT101');
        });

        await waitFor(() => expect(result.current.suggestionsCourse.length).toBe(1), { timeout: 1000 });

        act(() => {
            result.current.handleSelectSuggestionCourse(result.current.suggestionsCourse[0]);
        });

        await act(async () => {
            await result.current.handleRegisterCourse();
        });

        expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
        expect(courseRegistrationController.registerCourse).toHaveBeenCalledWith(1, 101);
        expect(mockSetPopupConfig).toHaveBeenCalledWith(expect.objectContaining({ message: 'Success' }));
        expect(appEventBus.emit).toHaveBeenCalledWith('TIMETABLE_CHANGED');
    });

    it('should cancel course registration successfully', async () => {
        (courseRegistrationController.cancelCourseRegistration as jest.Mock).mockResolvedValue({});
        const { result } = renderHook(() => useCourseRegistrationViewModel(mockAccount, 'course', mockSetIsSubmitting, mockSetPopupConfig));
        
        await waitFor(() => expect(result.current.registeredSubjects.length).toBe(1));

        act(() => {
            result.current.handleRequestDeleteCourse(result.current.registeredSubjects[0]);
        });

        expect(result.current.deletePopupConfig?.visible).toBe(true);

        await act(async () => {
            await result.current.handleConfirmDeleteCourse();
        });

        expect(courseRegistrationController.cancelCourseRegistration).toHaveBeenCalledWith(1, 101, '20241');
        expect(appEventBus.emit).toHaveBeenCalledWith('TIMETABLE_CHANGED');
    });
});
