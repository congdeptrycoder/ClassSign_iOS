import { renderHook, act } from '@testing-library/react-native';
import { useAdminDashboardViewModel } from '../../../../src/interface-adapters/viewmodels/AdminDashboard/useAdminDashboardViewModel';
import { getSemestersUseCase, getAllClassesUseCase, registrationPhaseController } from '../../../../src/di/admin.di';
import { Alert } from 'react-native';

jest.mock('../../../../src/di/admin.di', () => ({
    getSemestersUseCase: { execute: jest.fn() },
    createSemesterUseCase: { execute: jest.fn() },
    getAllClassesUseCase: { execute: jest.fn() },
    registrationPhaseController: {
        getPhases: jest.fn(),
        addPhase: jest.fn().mockResolvedValue({ id: '1' }),
        updatePhase: jest.fn(),
        deletePhase: jest.fn(),
    },
    registrationPhaseObservable: { subscribe: jest.fn(() => jest.fn()) }
}));

jest.spyOn(Alert, 'alert');

describe('useAdminDashboardViewModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getSemestersUseCase.execute as jest.Mock).mockResolvedValue([{ id: 1, semester: 20241 }]);
        (getAllClassesUseCase.execute as jest.Mock).mockResolvedValue([]);
    });

    it('should fetch semesters on mount', async () => {
        const { result } = renderHook(() => useAdminDashboardViewModel());
        
        // Wait for async actions in useEffect
        await act(async () => {
            await Promise.resolve();
        });

        expect(getSemestersUseCase.execute).toHaveBeenCalled();
        expect(result.current.semestersList).toEqual([{ id: 1, semester: 20241 }]);
    });

    it('should handle toggle profile', () => {
        const { result } = renderHook(() => useAdminDashboardViewModel());
        
        act(() => {
            result.current.toggleProfile();
        });

        expect(result.current.isProfileOpen).toBe(true);
    });

    it('should handle save phase', async () => {
        const { result } = renderHook(() => useAdminDashboardViewModel());
        
        act(() => {
            result.current.setSemesterId(1);
            result.current.setStartTime('2024-01-01');
            result.current.setEndTime('2024-01-10');
            result.current.setPhaseType('course');
        });

        await act(async () => {
            await result.current.handleSavePhase();
        });

        expect(registrationPhaseController.addPhase).toHaveBeenCalledWith({
            semesterId: 1,
            startTime: '2024-01-01',
            endTime: '2024-01-10',
            type: 'course'
        });
        expect(Alert.alert).toHaveBeenCalledWith('Thành công', 'Đã thiết lập giai đoạn đăng ký thành công.');
    });
});
