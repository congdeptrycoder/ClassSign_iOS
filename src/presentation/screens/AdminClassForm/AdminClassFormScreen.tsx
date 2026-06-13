import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    AdminClassFormData,
    useAdminClassFormViewModel,
} from '../../../interface-adapters/viewmodels/AdminClassForm/useAdminClassFormViewModel';
import { useTheme } from '../../components/ThemeContext';
import { createAdminClassFormStyles } from './styles';

type AdminClassFormScreenProps = {
    formData: AdminClassFormData;
    onGoBack: () => void;
};

/**
 * AdminClassFormScreen — màn hình gộp cho Create và Edit lớp học.
 * - mode='create': form trống, lưu bằng INSERT
 * - mode='edit':   form điền sẵn, lưu bằng UPDATE
 */
export const AdminClassFormScreen = ({
    formData,
    onGoBack,
}: AdminClassFormScreenProps) => {
    const { colors } = useTheme();
    const styles = createAdminClassFormStyles(colors);

    const {
        ky,
        truong_khoa,
        ma_hp,
        ten_hp,
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
        handleSave,
    } = useAdminClassFormViewModel(formData, onGoBack);

    const isEdit = formData.mode === 'edit';
    const headerTitle = isEdit ? 'Chỉnh sửa Lớp học' : 'Khởi tạo Lớp học';
    const saveBtnLabel = isEdit ? 'Lưu Thay Đổi' : 'Tạo Lớp';

    // Style riêng cho input bị vô hiệu hoá
    const disabledInputStyle = [styles.input, { backgroundColor: colors.separator }];

    // Dropdown state cho Buổi
    const [isBuoiModalOpen, setIsBuoiModalOpen] = useState(false);
    const buoiOptions = ['Sáng', 'Chiều'];

    return (
        <SafeAreaView style={styles.container}>
            {/* ── Header ────────────────────────────────────────────── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>{'< Quay lại'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{headerTitle}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* ── Các trường chỉ đọc ──────────────────────────── */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Kỳ</Text>
                    <TextInput style={disabledInputStyle} value={ky} editable={false} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Trường/Khoa</Text>
                    <TextInput style={disabledInputStyle} value={truong_khoa} editable={false} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mã HP</Text>
                    <TextInput style={disabledInputStyle} value={ma_hp} editable={false} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tên HP</Text>
                    <TextInput style={disabledInputStyle} value={ten_hp} editable={false} />
                </View>

                {/* ── Các trường có thể chỉnh sửa ─────────────────── */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mã lớp <Text style={{ color: 'red' }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={maLop}
                        onChangeText={setMaLop}
                        placeholder="Nhập mã lớp"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mã lớp kèm</Text>
                    <TextInput
                        style={styles.input}
                        value={maLopKem}
                        onChangeText={setMaLopKem}
                        placeholder="Nhập mã lớp kèm"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Ghi chú</Text>
                    <TextInput
                        style={styles.input}
                        value={ghiChu}
                        onChangeText={setGhiChu}
                        placeholder="Nhập ghi chú"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Thứ <Text style={{ color: 'red' }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={thu}
                        onChangeText={setThu}
                        keyboardType="numeric"
                        placeholder="Nhập thứ (ví dụ: 2, 3...)"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={styles.label}>Tiết BD <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            value={tietBd}
                            onChangeText={(text) => setTietBd(text.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            placeholder="Tiết BD"
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={styles.label}>Tiết KT <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            value={tietKt}
                            onChangeText={(text) => setTietKt(text.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            placeholder="Tiết KT"
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Buổi <Text style={{ color: 'red' }}>*</Text></Text>
                    <TouchableOpacity
                        style={[styles.input, { justifyContent: 'center' }]}
                        onPress={() => setIsBuoiModalOpen(true)}
                    >
                        <Text style={{ color: buoi ? colors.inputText : colors.textSecondary }}>
                            {buoi || 'Chọn buổi'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phòng học <Text style={{ color: 'red' }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={phongHoc}
                        onChangeText={setPhongHoc}
                        placeholder="Nhập phòng học"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Cần TN</Text>
                    <TextInput
                        style={styles.input}
                        value={canTn}
                        onChangeText={setCanTn}
                        placeholder="Có cần TN không"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>SL Max <Text style={{ color: 'red' }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={slMax}
                        onChangeText={setSlMax}
                        keyboardType="numeric"
                        placeholder="Nhập số lượng max"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>TeachingType</Text>
                    <TextInput
                        style={styles.input}
                        value={teachingType}
                        onChangeText={setTeachingType}
                        placeholder="Nhập TeachingType"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>{saveBtnLabel}</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Modal dropdown cho Buổi */}
            <Modal visible={isBuoiModalOpen} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setIsBuoiModalOpen(false)}
                >
                    <View style={styles.modalContent}>
                        <FlatList
                            data={buoiOptions}
                            keyExtractor={item => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setBuoi(item);
                                        setIsBuoiModalOpen(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        buoi === item && { fontWeight: 'bold', color: colors.link },
                                    ]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};
