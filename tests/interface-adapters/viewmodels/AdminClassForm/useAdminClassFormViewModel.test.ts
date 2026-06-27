import { renderHook, act } from '@testing-library/react-native';
import { useAdminClassFormViewModel, CreateClassFormData, EditClassFormData } from '../../../../src/interface-adapters/viewmodels/AdminClassForm/useAdminClassFormViewModel';
import { createClassCourseUseCase, updateClassCourseUseCase } from '../../../../src/di/admin.di';
import { Alert } from 'react-native';

jest.mock('../../../../src/di/admin.di', () => ({
    createClassCourseUseCase: { execute: jest.fn() },
    updateClassCourseUseCase: { execute: jest.fn() },
}));

jest.spyOn(Alert, 'alert');

describe('useAdminClassFormViewModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockGoBack = jest.fn();

    it('should submit new class if mode is create', async () => {
        const createData: CreateClassFormData = {
            mode: 'create',
            ky: '20241',
            truong_khoa: 'IT',
            ma_hp: 'IT101',
            ten_hp: 'Intro'
        };

        const { result } = renderHook(() => useAdminClassFormViewModel(createData, mockGoBack));
        
        act(() => {
            result.current.setMaLop('123');
            result.current.setTietBd('1');
            result.current.setTietKt('3');
            result.current.setBuoi('Sáng');
            result.current.setPhongHoc('D3-101');
            result.current.setSlMax('50');
            result.current.setThu('2');
        });

        await act(async () => {
            await result.current.handleSave();
        });

        expect(createClassCourseUseCase.execute).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith('Thành công', 'Đã tạo lớp học mới', expect.any(Array));
    });

    it('should call update if mode is edit', async () => {
        const editData: EditClassFormData = {
            mode: 'edit',
            id: 1,
            ky: '20241',
            khoa_truong: 'IT',
            ma_hp: 'IT101',
            ten_hp: 'Intro',
            ma_lop: '123',
            ma_lop_kem: '',
            ghi_chu: '',
            thu: '2',
            tiet_bd: '1',
            tiet_kt: '3',
            buoi: 'Sáng',
            phong_hoc: 'D3-101',
            can_tn: '',
            sl_max: '50',
            teaching_type: ''
        };

        const { result } = renderHook(() => useAdminClassFormViewModel(editData, mockGoBack));
        
        act(() => {
            result.current.setSlMax('60');
        });

        await act(async () => {
            await result.current.handleSave();
        });

        expect(updateClassCourseUseCase.execute).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith('Thành công', 'Đã cập nhật thông tin lớp học', expect.any(Array));
    });

    it('should show error if missing required fields', async () => {
        const createData: CreateClassFormData = {
            mode: 'create',
            ky: '20241',
            truong_khoa: 'IT',
            ma_hp: 'IT101',
            ten_hp: 'Intro'
        };

        const { result } = renderHook(() => useAdminClassFormViewModel(createData, mockGoBack));
        
        await act(async () => {
            await result.current.handleSave();
        });

        expect(createClassCourseUseCase.execute).not.toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith('Lỗi', expect.stringContaining('Vui lòng nhập đầy đủ thông tin'));
    });
});
