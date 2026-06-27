import { renderHook, act } from '@testing-library/react-native';
import { useAdminCourseRegistrationDetailsViewModel } from '../../../../src/interface-adapters/viewmodels/AdminCourseRegistrationDetails/useAdminCourseRegistrationDetailsViewModel';
import { getCourseRegistrationStatsUseCase } from '../../../../src/di/admin.di';

jest.mock('../../../../src/di/admin.di', () => ({
    getCourseRegistrationStatsUseCase: { execute: jest.fn() },
    getSemestersUseCase: { execute: jest.fn().mockResolvedValue([{ id: 1, semester: 20241 }]) }
}));

const mockNavigation = { goBack: jest.fn() } as any;

describe('useAdminCourseRegistrationDetailsViewModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getCourseRegistrationStatsUseCase.execute as jest.Mock).mockResolvedValue([
            { course_id: 1, ma_hp: 'IT101', ten_hp: 'Intro', truong_khoa: 'IT', so_luong_dang_ky: 100, so_luong_lop: 1, so_luong_dk_toi_da: 120 }
        ]);
    });

    it('should fetch stats on mount if semester id is available', async () => {
        const { result } = renderHook(() => useAdminCourseRegistrationDetailsViewModel(1));
        
        // Wait for async effect to finish
        await act(async () => {
            await Promise.resolve();
        });

        expect(getCourseRegistrationStatsUseCase.execute).toHaveBeenCalled();
        expect(result.current.stats).toEqual([
            { course_id: 1, ma_hp: 'IT101', ten_hp: 'Intro', truong_khoa: 'IT', so_luong_dang_ky: 100, so_luong_lop: 1, so_luong_dk_toi_da: 120 }
        ]);
    });
});
