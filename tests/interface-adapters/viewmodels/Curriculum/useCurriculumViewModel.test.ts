import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useCurriculumViewModel } from '../../../../src/interface-adapters/viewmodels/Curriculum/useCurriculumViewModel';
import { courseRegistrationController } from '../../../../src/di/student.di';
import { Alert } from 'react-native';

jest.mock('../../../../src/di/student.di', () => ({
    courseRegistrationController: {
        getCurriculum: jest.fn(),
        registerCourse: jest.fn(),
    }
}));

jest.spyOn(Alert, 'alert');

describe('useCurriculumViewModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (courseRegistrationController.getCurriculum as jest.Mock).mockResolvedValue({
            courses: [{ id: 1, courseId: 101, code: 'IT101', name: 'Toán', credits: 3 }]
        });
    });

    it('should load curriculum on mount', async () => {
        const { result } = renderHook(() => useCurriculumViewModel(1));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(courseRegistrationController.getCurriculum).toHaveBeenCalledWith(1);
        expect(result.current.curriculum).toEqual({
            courses: [{ id: 1, courseId: 101, code: 'IT101', name: 'Toán', credits: 3 }]
        });
    });

    it('should register course successfully', async () => {
        (courseRegistrationController.registerCourse as jest.Mock).mockResolvedValue({ message: 'Success' });
        const { result } = renderHook(() => useCurriculumViewModel(1));
        
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        const mockCourse = { id: 1, courseId: 101, code: 'IT101', name: 'Toán', credits: 3 } as any;

        await act(async () => {
            await result.current.handleRegisterCourse(mockCourse);
        });

        expect(courseRegistrationController.registerCourse).toHaveBeenCalledWith(1, 101);
        expect(result.current.popupConfig).toEqual({
            visible: true,
            message: 'Success',
            buttonText: 'Đóng'
        });
    });

    it('should handle registration error', async () => {
        (courseRegistrationController.registerCourse as jest.Mock).mockRejectedValue(new Error('Lỗi chung'));
        const { result } = renderHook(() => useCurriculumViewModel(1));
        
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        const mockCourse = { id: 1, courseId: 101, code: 'IT101', name: 'Toán', credits: 3 } as any;

        await act(async () => {
            await result.current.handleRegisterCourse(mockCourse);
        });

        expect(Alert.alert).toHaveBeenCalledWith('Cảnh báo', 'Lỗi chung');
    });

    it('should handle unauthorized registration error with popup', async () => {
        (courseRegistrationController.registerCourse as jest.Mock).mockRejectedValue(new Error('Bạn không có quyền thực hiện thao tác này. Liên hệ nhà trường để biết thêm thông tin'));
        const { result } = renderHook(() => useCurriculumViewModel(1));
        
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        const mockCourse = { id: 1, courseId: 101, code: 'IT101', name: 'Toán', credits: 3 } as any;

        await act(async () => {
            await result.current.handleRegisterCourse(mockCourse);
        });

        expect(result.current.popupConfig).toEqual({
            visible: true,
            message: 'Bạn không có quyền thực hiện thao tác này. Liên hệ nhà trường để biết thêm thông tin',
            buttonText: 'Đóng'
        });
    });
});
