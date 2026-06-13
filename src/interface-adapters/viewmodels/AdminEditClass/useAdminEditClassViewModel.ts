import { useState } from 'react';
import { Alert } from 'react-native';
import { AdminRepositoryImpl } from '../../../infrastructure/repositories/AdminRepositoryImpl';
import { UpdateClassCourseUseCase } from '../../../application/use-cases/UpdateClassCourseUseCase';

export type EditClassInitialData = {
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

export const useAdminEditClassViewModel = (
    initialData: EditClassInitialData,
    onGoBack: () => void
) => {
    const [maLop, setMaLop] = useState(initialData.ma_lop || '');
    const [maLopKem, setMaLopKem] = useState(initialData.ma_lop_kem !== 'NULL' ? initialData.ma_lop_kem : '');
    const [ghiChu, setGhiChu] = useState(initialData.ghi_chu !== 'NULL' ? initialData.ghi_chu : '');
    const [thu, setThu] = useState(initialData.thu || '');
    const [tietBd, setTietBd] = useState(initialData.tiet_bd || '');
    const [tietKt, setTietKt] = useState(initialData.tiet_kt || '');
    const [buoi, setBuoi] = useState(initialData.buoi || '');
    const [phongHoc, setPhongHoc] = useState(initialData.phong_hoc || '');
    const [canTn, setCanTn] = useState(initialData.can_tn !== 'NULL' ? initialData.can_tn : '');
    const [slMax, setSlMax] = useState(initialData.sl_max || '');
    const [teachingType, setTeachingType] = useState(initialData.teaching_type !== 'NULL' ? initialData.teaching_type : '');

    const handleSave = async () => {
        if (!maLop || !tietBd || !tietKt || !buoi || !phongHoc || !slMax || !thu) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc (Mã lớp, Thứ, Tiết BD/KT, Buổi, Phòng học, SL Max)');
            return;
        }

        const payload = {
            ma_lop: maLop,
            ma_lop_kem: maLopKem || 'NULL',
            ghi_chu: ghiChu || 'NULL',
            thu: thu,
            tiet_bd: tietBd,
            tiet_kt: tietKt,
            buoi: buoi,
            phong_hoc: phongHoc,
            can_tn: canTn || 'NULL',
            sl_max: slMax,
            teaching_type: teachingType || 'NULL',
        };

        try {
            const repository = new AdminRepositoryImpl();
            const useCase = new UpdateClassCourseUseCase(repository);
            
            await useCase.execute(initialData.id, payload);
            
            Alert.alert('Thành công', 'Đã cập nhật thông tin lớp học', [
                { text: 'OK', onPress: onGoBack }
            ]);
        } catch (error: any) {
            Alert.alert('Lỗi', error.message || 'Lỗi hệ thống khi cập nhật lớp học');
        }
    };

    return {
        // Disabled fields
        ky: initialData.ky,
        truong_khoa: initialData.khoa_truong,
        ma_hp: initialData.ma_hp,
        ten_hp: initialData.ten_hp,
        
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

        // Actions
        handleSave,
    };
};
