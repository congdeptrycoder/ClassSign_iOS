import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ClassInfo } from '../../../interface-adapters/viewmodels/AdminDashboard/useAdminDashboardViewModel';
import { useAdminEditClassViewModel } from '../../../interface-adapters/viewmodels/AdminEditClass/useAdminEditClassViewModel';
import { useTheme } from '../../components/ThemeContext';
import { createAdminEditStyles } from './styles';

type AdminEditClassScreenProps = {
    onGoBack: () => void;
    initialData?: ClassInfo;
};

const fields: Array<{ key: keyof ClassInfo; label: string }> = [
    { key: 'ky', label: 'Kỳ' },
    { key: 'khoa_truong', label: 'Trường/Khoa' },
    { key: 'ma_lop', label: 'Mã lớp' },
    { key: 'ma_lop_kem', label: 'Mã lớp kèm' },
    { key: 'ma_hp', label: 'Mã học phần' },
    { key: 'ten_hp', label: 'Tên học phần' },
    { key: 'khoi_luong', label: 'Khối lượng' },
    { key: 'ghi_chu', label: 'Ghi chú' },
    { key: 'tiet_bd', label: 'Tiết bắt đầu' },
    { key: 'tiet_kt', label: 'Tiết kết thúc' },
    { key: 'buoi', label: 'Buổi' },
    { key: 'phong_hoc', label: 'Phòng học' },
    { key: 'can_tn', label: 'Cần thí nghiệm' },
    { key: 'sl_dk', label: 'Số lượng đăng ký' },
    { key: 'sl_max', label: 'Số lượng tối đa' },
    { key: 'trang_thai', label: 'Trạng thái' },
    { key: 'teaching_type', label: 'Teaching Type' },
];

export const AdminEditClassScreen = ({
    onGoBack,
    initialData,
}: AdminEditClassScreenProps) => {
    const { formValues, handleInputChange, handleSave, handleGoBack } =
        useAdminEditClassViewModel(onGoBack, initialData);

    const { colors } = useTheme();
    const styles = createAdminEditStyles(colors);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>{'< Quay lại'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chỉnh sửa thông tin lớp học</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {fields.map(field => (
                    <View key={field.key} style={styles.inputGroup}>
                        <Text style={styles.label}>{field.label}</Text>
                        <TextInput
                            style={styles.input}
                            value={formValues[field.key]}
                            onChangeText={text => handleInputChange(field.key, text)}
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>
                ))}

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};
