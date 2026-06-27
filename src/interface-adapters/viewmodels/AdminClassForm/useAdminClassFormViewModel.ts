import { useState } from 'react';
import { Alert } from 'react-native';
import { createClassCourseUseCase, updateClassCourseUseCase } from '../../../di/admin.di';
import { logMessage } from '../../../shared/utils/logger';

// ── Dữ liệu đầu vào cho mode CREATE ─────────────────────────────────────────
export type CreateClassFormData = {
    mode: 'create';
    ky: string;
    truong_khoa: string;
    ma_hp: string;
    ten_hp: string;
};

// ── Dữ liệu đầu vào cho mode EDIT ───────────────────────────────────────────
export type EditClassFormData = {
    mode: 'edit';
    id: number;
    ky: string;
    khoa_truong: string;
    ma_hp: string;
    ten_hp: string;
    ma_lop: string;
    ma_lop_kem: string;
    ghi_chu: string;
    thu: string;
    tiet_bd: string;
    tiet_kt: string;
    buoi: string;
    phong_hoc: string;
    can_tn: string;
    sl_max: string;
    teaching_type: string;
};

export type AdminClassFormData = CreateClassFormData | EditClassFormData;

// ── Helper lấy giá trị an toàn (bỏ qua chuỗi 'NULL') ────────────────────────
const safeValue = (value: string | undefined): string =>
    value && value !== 'NULL' ? value : '';

/**
 * useAdminClassFormViewModel — ViewModel (MVVM)
 *
 * Tuân thủ DIP: không tự khởi tạo Repository hay UseCase.
 * Thay vào đó sử dụng các use case đã được inject từ admin.di.ts.
 *
 * Tuân thủ SRP: chỉ quản lý state form và điều phối action tạo/cập nhật lớp học.
 */
export const useAdminClassFormViewModel = (
    formData: AdminClassFormData,
    onGoBack: () => void,
) => {
    const isEdit = formData.mode === 'edit';
    const editData = isEdit ? (formData as EditClassFormData) : null;

    // ── Editable fields ──────────────────────────────────────────────────────
    const [maLop, setMaLop] = useState(isEdit ? safeValue(editData!.ma_lop) : '');
    const [maLopKem, setMaLopKem] = useState(isEdit ? safeValue(editData!.ma_lop_kem) : '');
    const [ghiChu, setGhiChu] = useState(isEdit ? safeValue(editData!.ghi_chu) : '');
    const [thu, setThu] = useState(isEdit ? safeValue(editData!.thu) : '');
    const [tietBd, setTietBd] = useState(isEdit ? safeValue(editData!.tiet_bd) : '');
    const [tietKt, setTietKt] = useState(isEdit ? safeValue(editData!.tiet_kt) : '');
    const [buoi, setBuoi] = useState(isEdit ? safeValue(editData!.buoi) : '');
    const [phongHoc, setPhongHoc] = useState(isEdit ? safeValue(editData!.phong_hoc) : '');
    const [canTn, setCanTn] = useState(isEdit ? safeValue(editData!.can_tn) : '');
    const [slMax, setSlMax] = useState(isEdit ? safeValue(editData!.sl_max) : '');
    const [teachingType, setTeachingType] = useState(isEdit ? safeValue(editData!.teaching_type) : '');

    // ── Action: Lưu (create hoặc update tùy mode) ────────────────────────────
    const handleSave = async () => {
        if (!maLop || !tietBd || !tietKt || !buoi || !phongHoc || !slMax || !thu) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc (Mã lớp, Thứ, Tiết BD/KT, Buổi, Phòng học, SL Max)');
            return;
        }

        try {
            if (isEdit) {
                // ── UPDATE ──────────────────────────────────────────────
                const payload = {
                    ma_lop: maLop,
                    ma_lop_kem: maLopKem || 'NULL',
                    ghi_chu: ghiChu || 'NULL',
                    thu,
                    tiet_bd: tietBd,
                    tiet_kt: tietKt,
                    buoi,
                    phong_hoc: phongHoc,
                    can_tn: canTn || 'NULL',
                    sl_max: slMax,
                    teaching_type: teachingType || 'NULL',
                };
                await updateClassCourseUseCase.execute(editData!.id, payload);
                logMessage('INFO', `Cập nhật lớp học thành công: ID=${editData!.id}`);
                Alert.alert('Thành công', 'Đã cập nhật thông tin lớp học', [
                    { text: 'OK', onPress: onGoBack },
                ]);
            } else {
                // ── CREATE ──────────────────────────────────────────────
                const createData = formData as CreateClassFormData;
                const payload = {
                    ky: createData.ky,
                    ma_hp: createData.ma_hp,
                    ma_lop: maLop,
                    ma_lop_kem: maLopKem || 'NULL',
                    ghi_chu: ghiChu || 'NULL',
                    thu,
                    tiet_bd: tietBd,
                    tiet_kt: tietKt,
                    buoi,
                    phong_hoc: phongHoc,
                    can_tn: canTn || 'NULL',
                    sl_max: slMax,
                    teaching_type: teachingType || 'NULL',
                };
                await createClassCourseUseCase.execute(payload);
                logMessage('INFO', `Tạo lớp học mới thành công: ma_hp=${createData.ma_hp}, ma_lop=${maLop}`);
                Alert.alert('Thành công', 'Đã tạo lớp học mới', [
                    { text: 'OK', onPress: onGoBack },
                ]);
            }
        } catch (error: any) {
            const errorMsg = error.message || 'Lỗi hệ thống';
            logMessage('ERROR', `Lưu lớp học thất bại: ${errorMsg}`);
            Alert.alert('Lỗi', errorMsg);
        }
    };

    return {
        // Disabled (readonly) fields — lấy từ formData
        ky: formData.ky,
        truong_khoa: formData.mode === 'edit' ? (formData as EditClassFormData).khoa_truong : (formData as CreateClassFormData).truong_khoa,
        ma_hp: formData.ma_hp,
        ten_hp: formData.ten_hp,

        // Editable fields
        maLop, setMaLop,
        maLopKem, setMaLopKem,
        ghiChu, setGhiChu,
        thu, setThu,
        tietBd, setTietBd,
        tietKt, setTietKt,
        buoi, setBuoi,
        phongHoc, setPhongHoc,
        canTn, setCanTn,
        slMax, setSlMax,
        teachingType, setTeachingType,

        // Action
        handleSave,
    };
};
