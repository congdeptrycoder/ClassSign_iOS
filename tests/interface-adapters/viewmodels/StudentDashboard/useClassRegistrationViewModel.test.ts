import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useClassRegistrationViewModel } from '../../../../src/interface-adapters/viewmodels/StudentDashboard/useClassRegistrationViewModel';
import { classRegistrationController, appEventBus } from '../../../../src/di/student.di';
import { Alert } from 'react-native';

jest.mock('../../../../src/di/student.di', () => ({
    classRegistrationController: {
        getCourseClasses: jest.fn(),
        registerClass: jest.fn(),
        cancelClassRegistration: jest.fn(),
    },
    appEventBus: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
    }
}));

describe('useClassRegistrationViewModel', () => {
    let mockSetIsSubmitting: jest.Mock;
    const studentId = 1;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSetIsSubmitting = jest.fn();
        jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
            if (buttons && buttons.length > 1 && buttons[1].onPress) {
                buttons[1].onPress();
            }
        });
    });

    it('should fetch course classes and toggle expansion', async () => {
        const courseId = 101;
        const mockClasses = [{ classId: 1, name: 'Lớp 1' }];
        (classRegistrationController.getCourseClasses as jest.Mock).mockResolvedValue(mockClasses);

        const { result } = renderHook(() => useClassRegistrationViewModel(studentId, mockSetIsSubmitting));

        await act(async () => {
            await result.current.toggleCourseExpansion(courseId);
        });

        expect(classRegistrationController.getCourseClasses).toHaveBeenCalledWith(studentId, courseId);
        expect(result.current.expandedCourseIds.has(courseId)).toBe(true);
        expect(result.current.courseClassesData[courseId]).toEqual(mockClasses);

        // Collapse
        await act(async () => {
            await result.current.toggleCourseExpansion(courseId);
        });
        expect(result.current.expandedCourseIds.has(courseId)).toBe(false);
    });

    it('should register class successfully', async () => {
        (classRegistrationController.registerClass as jest.Mock).mockResolvedValue(undefined);
        const { result } = renderHook(() => useClassRegistrationViewModel(studentId, mockSetIsSubmitting));

        await act(async () => {
            await result.current.handleRegisterClassSection(1, 'IT101', 101);
        });

        expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
        expect(classRegistrationController.registerClass).toHaveBeenCalledWith(studentId, 1);
        expect(appEventBus.emit).toHaveBeenCalledWith('CLASS_SLOTS_CHANGED', { courseId: 101 });
        expect(appEventBus.emit).toHaveBeenCalledWith('TIMETABLE_CHANGED');
        expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });

    it('should handle registration error', async () => {
        (classRegistrationController.registerClass as jest.Mock).mockRejectedValue(new Error('Lỗi đầy'));
        const { result } = renderHook(() => useClassRegistrationViewModel(studentId, mockSetIsSubmitting));

        await act(async () => {
            await result.current.handleRegisterClassSection(1, 'IT101', 101);
        });

        expect(Alert.alert).toHaveBeenCalledWith('Cảnh báo', 'Lỗi đầy');
        expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });

    it('should cancel class successfully', async () => {
        (classRegistrationController.cancelClassRegistration as jest.Mock).mockResolvedValue(undefined);
        const { result } = renderHook(() => useClassRegistrationViewModel(studentId, mockSetIsSubmitting));

        await act(async () => {
            await result.current.handleCancelClassSection(1, 'IT101', 101);
        });

        expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
        expect(classRegistrationController.cancelClassRegistration).toHaveBeenCalledWith(studentId, 1);
        expect(appEventBus.emit).toHaveBeenCalledWith('CLASS_SLOTS_CHANGED', { courseId: 101 });
        expect(appEventBus.emit).toHaveBeenCalledWith('TIMETABLE_CHANGED');
        expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });
});
