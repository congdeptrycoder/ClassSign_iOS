import { useState } from 'react';
import { Alert } from 'react-native';
import { AdminRepositoryImpl } from '../../../infrastructure/repositories/AdminRepositoryImpl';
import { CreateClassCourseUseCase } from '../../../application/use-cases/CreateClassCourseUseCase';

export type CreateClassInitialData = {
    ky: string;
    truong_khoa: string;
    ma_hp: string;
    ten_hp: string;
};

export const useAdminCreateClassViewModel = (
    initialData: CreateClassInitialData,
    onGoBack: () => void
) => {
    const [maLop, setMaLop] = useState('');
    const [maLopKem, setMaLopKem] = useState('');
    const [ghiChu, setGhiChu] = useState('');
    const [tietKt, setTietKt] = useState('');
    const [thu, setThu] = useState('');
    const [buoi, setBuoi] = useState('');
    const [phongHoc, setPhongHoc] = useState('');
    const [canTn, setCanTn] = useState('');
    const [slMax, setSlMax] = useState('');
    const [teachingType, setTeachingType] = useState('');

    const handleSave = async () => {
        if (!maLop || !tietBd || !tietKt || !buoi || !phongHoc || !slMax || !thu) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc (Mã lớp, Thứ, Tiết BD/KT, Buổi, Phòng học, SL Max)');
            return;
        }

        const payload = {
            ky: initialData.ky,
            ma_hp: initialData.ma_hp,
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
            const useCase = new CreateClassCourseUseCase(repository);
            
            await useCase.execute(payload);
            
            Alert.alert('Thành công', 'Đã tạo lớp học mới', [
                { text: 'OK', onPress: onGoBack }
            ]);
        } catch (error: any) {
            Alert.alert('Lỗi', error.message || 'Lỗi hệ thống khi tạo lớp học');
        }
    };

    return {
        // Disabled fields
        ky: initialData.ky,
        truong_khoa: initialData.truong_khoa,
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
