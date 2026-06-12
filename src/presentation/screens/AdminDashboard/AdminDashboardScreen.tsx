import React from 'react';
import {
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    ClassInfo,
    useAdminDashboardViewModel,
} from '../../../interface-adapters/viewmodels/AdminDashboard/useAdminDashboardViewModel';
import { RegistrationPhase } from '../../../domain/entities/RegistrationPhase';
import { useTheme } from '../../components/ThemeContext';
import { createAdminStyles } from './styles';

type AdminDashboardScreenProps = {
    onLogout: () => void;
    onNavigateToEdit?: (item: ClassInfo) => void;
    onNavigateToDetails?: (semesterId: number, semesterName?: string) => void;
};

const tableHeaders = [
    'Kỳ',
    'Trường/Khoa',
    'Mã lớp',
    'Mã lớp kèm',
    'Mã HP',
    'Tên HP',
    'Khối lượng',
    'Ghi chú',
    'Tiết BD',
    'Tiết KT',
    'Buổi',
    'Phòng học',
    'Cần TN',
    'SLDK',
    'SL Max',
    'Trạng thái',
    'TeachingType',
    'Hành động',
];

export const AdminDashboardScreen = ({
    onLogout,
    onNavigateToEdit,
    onNavigateToDetails,
}: AdminDashboardScreenProps) => {
    const {
        isProfileOpen,
        toggleProfile,
        handleLogout,
        handleUpload,
        searchQuery,
        setSearchQuery,
        searchMode,
        setSearchMode,
        department,
        major,
        setMajor,
        handleSearch,
        classesData,
        handleEdit,
        handleDelete,
        isModeModalOpen,
        setModeModalOpen,
        isDeptModalOpen,
        setDeptModalOpen,
        isMajorModalOpen,
        setMajorModalOpen,
        searchModeOptions,
        departmentOptions,
        majorOptions,
        handleSelectDepartment,
        // Giai đoạn đăng ký
        phases,
        phaseType,
        setPhaseType,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        semesterId,
        setSemesterId,
        semestersList,
        isSemesterModalOpen,
        setSemesterModalOpen,
        editingPhaseId,
        handleSavePhase,
        handleEditPhase,
        handleDeletePhase,
        handleCancelEdit,
    } = useAdminDashboardViewModel(onNavigateToEdit, onLogout);

    const { colors } = useTheme();
    const styles = createAdminStyles(colors);

    // Hàm lấy trạng thái giai đoạn
    const getPhaseStatus = (phase: RegistrationPhase) => {
        return phase.isActive === 1 ? 'ĐANG DIỄN RA' : 'ĐÃ KẾT THÚC';
    };


    return (
        <SafeAreaView style={styles.container}>
            {/* ── Header Navbar ─────────────────────────────────── */}
            <View style={styles.navBarHeader} testID="nav-bar-header">
                <Image
                    source={require('../../../../assets/image/hust-logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <TouchableOpacity onPress={toggleProfile}>
                    <Image
                        source={require('../../../../assets/image/hust-logo.png')}
                        style={styles.avatar}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            {/* ── User Profile Box ──────────────────────────────── */}
            {isProfileOpen && (
                <View style={styles.userInfoBox}>
                    <Text style={styles.userInfoText}>Nguyễn Tuấn Anh - PDT3636</Text>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* ── Main Scroll Container ─────────────────────────── */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.warningText}>
                    ĐƯỢC PHÉP CHỈNH SỬA! Giai đoạn TEST
                </Text>

                {/* ── SECTION A: THIẾT LẬP GIAI ĐOẠN ĐĂNG KÝ (MỚI) ─────── */}
                <Text style={styles.phaseTableTitle}>Thiết lập giai đoạn đăng ký học tập</Text>
                
                <View style={styles.phaseSetupContainer} testID="phase-setup-card">
                    {/* Chọn Loại Thiết Lập */}
                    <View style={styles.phaseFormGroup}>
                        <Text style={styles.phaseLabel}>Loại thiết lập</Text>
                        <View style={styles.phaseRadioGroup}>
                            <TouchableOpacity
                                style={[
                                    styles.phaseRadioButton,
                                    phaseType === 'course' && styles.phaseRadioButtonActive,
                                ]}
                                onPress={() => setPhaseType('course')}
                                testID="radio-course"
                            >
                                <Text
                                    style={[
                                        styles.phaseRadioText,
                                        phaseType === 'course' && styles.phaseRadioTextActive,
                                    ]}
                                >
                                    Đăng ký học phần
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.phaseRadioButton,
                                    phaseType === 'class' && styles.phaseRadioButtonActive,
                                ]}
                                onPress={() => setPhaseType('class')}
                                testID="radio-class"
                            >
                                <Text
                                    style={[
                                        styles.phaseRadioText,
                                        phaseType === 'class' && styles.phaseRadioTextActive,
                                    ]}
                                >
                                    Đăng ký lớp học
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Chọn Học Kỳ */}
                    <View style={styles.phaseFormGroup}>
                        <Text style={styles.phaseLabel}>Học kỳ</Text>
                        <TouchableOpacity
                            style={[styles.phaseTextInput, { justifyContent: 'center' }]}
                            onPress={() => setSemesterModalOpen(true)}
                            testID="phase-semester-input"
                        >
                            <Text style={{ color: semesterId ? colors.textPrimary : colors.textSecondary }}>
                                {semesterId ? semestersList.find(s => s.id === semesterId)?.semester || semesterId : 'Chọn học kỳ'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Nhập Thời Gian Bắt Đầu */}
                    <View style={styles.phaseFormGroup}>
                        <Text style={styles.phaseLabel}>Thời gian bắt đầu (YYYY-MM-DD HH:mm)</Text>
                        <TextInput
                            style={styles.phaseTextInput}
                            placeholder="Ví dụ: 2026-06-02 12:00"
                            placeholderTextColor={colors.textSecondary}
                            value={startTime}
                            onChangeText={setStartTime}
                            testID="phase-start-input"
                        />
                    </View>

                    {/* Nhập Thời Gian Kết Thúc */}
                    <View style={styles.phaseFormGroup}>
                        <Text style={styles.phaseLabel}>Thời gian kết thúc (YYYY-MM-DD HH:mm)</Text>
                        <TextInput
                            style={styles.phaseTextInput}
                            placeholder="Ví dụ: 2026-06-02 18:00"
                            placeholderTextColor={colors.textSecondary}
                            value={endTime}
                            onChangeText={setEndTime}
                            testID="phase-end-input"
                        />
                    </View>

                    {/* Các Nút Lưu/Hủy */}
                    <View style={styles.phaseButtonsRow}>
                        <TouchableOpacity
                            style={styles.savePhaseBtn}
                            onPress={handleSavePhase}
                            testID="save-phase-button"
                        >
                            <Text style={styles.savePhaseBtnText}>
                                {editingPhaseId ? 'Cập nhật thiết lập' : 'Thiết lập giai đoạn'}
                            </Text>
                        </TouchableOpacity>

                        {editingPhaseId && (
                            <TouchableOpacity
                                style={styles.cancelPhaseBtn}
                                onPress={handleCancelEdit}
                                testID="cancel-edit-phase-button"
                            >
                                <Text style={styles.cancelPhaseBtnText}>Hủy</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Bảng Danh sách các thiết lập hiện tại */}
                {phases.length > 0 && (
                    <View style={styles.tableSection} testID="phase-list-table">
                        <Text style={styles.phaseTableTitle}>Danh sách thiết lập giai đoạn</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.table}>
                                <View style={[styles.tableRow, styles.tableHeader]}>
                                    <Text style={[styles.cell, styles.headerCell, styles.timeCell]}>
                                        Thời gian
                                    </Text>
                                    <Text style={[styles.cell, styles.headerCell, styles.typeCell]}>
                                        Học kỳ
                                    </Text>
                                    <Text style={[styles.cell, styles.headerCell, styles.typeCell]}>
                                        Loại thiết lập
                                    </Text>
                                    <Text style={[styles.cell, styles.headerCell, styles.statusLabelCell]}>
                                        Trạng thái
                                    </Text>
                                    <Text style={[styles.cell, styles.headerCell, styles.phaseActionCell]}>
                                        Hành động
                                    </Text>
                                </View>

                                {phases.map((item, index) => {
                                    const status = getPhaseStatus(item);
                                    return (
                                        <View key={index} style={styles.tableRow}>
                                            <Text style={[styles.cell, styles.timeCell]}>
                                                {item.startTime} - {item.endTime}
                                            </Text>
                                            <Text style={[styles.cell, styles.typeCell]}>
                                                {item.semesterName || item.semesterId}
                                            </Text>
                                            <Text style={[styles.cell, styles.typeCell]}>
                                                {item.type === 'course' ? 'Đăng ký học phần' : 'Đăng ký lớp học'}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.cell,
                                                    styles.statusLabelCell,
                                                    styles.statusCell,
                                                    status === 'ĐANG DIỄN RA' ? styles.statusOpen : styles.statusClosed,
                                                ]}
                                            >
                                                {status}
                                            </Text>
                                            <View style={[styles.cell, styles.phaseActionCell]}>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        onNavigateToDetails?.(item.semesterId, item.semesterName)
                                                    }
                                                    style={styles.detailBtn}
                                                    testID={`view-detail-btn-${item.id}`}
                                                >
                                                    <Text style={styles.actionText}>Xem chi tiết</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => handleEditPhase(item)}
                                                    style={styles.editBtn}
                                                >
                                                    <Text style={styles.actionText}>Sửa</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => handleDeletePhase(item.id)}
                                                    style={styles.deleteBtn}
                                                >
                                                    <Text style={styles.actionText}>Xoá</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                )}

                <View style={styles.divider} />

                {/* ── SECTION B: QUẢN LÝ LỚP HỌC (CŨ) ────────────────── */}
                <Text style={styles.phaseTableTitle}>Quản lý danh sách lớp học</Text>
                
                <View style={styles.uploadSection}>
                    <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
                        <Text style={styles.uploadBtnText}>Upload file</Text>
                    </TouchableOpacity>
                    <Text style={styles.uploadHint}>* chỉ up file .xlsx</Text>
                </View>

                <View style={styles.searchSection}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Nhập thông tin tìm kiếm..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={colors.textSecondary}
                    />

                    <View style={styles.filtersRow}>
                        <TouchableOpacity
                            style={styles.pickerBtn}
                            onPress={() => setModeModalOpen(true)}
                        >
                            <Text style={styles.pickerBtnText}>Tìm theo: {searchMode}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.pickerBtn}
                            onPress={() => setDeptModalOpen(true)}
                        >
                            <Text style={styles.pickerBtnText}>
                                Khoa/Trường: {department || 'Chọn'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.pickerBtn}
                            onPress={() => setMajorModalOpen(true)}
                        >
                            <Text style={styles.pickerBtnText}>
                                Ngành: {major || 'Chọn'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                        <Text style={styles.searchBtnText}>Tìm kiếm</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.tableSection}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                {tableHeaders.map((header, index) => (
                                    <Text key={index} style={[styles.cell, styles.headerCell]}>
                                        {header}
                                    </Text>
                                ))}
                            </View>

                            {classesData.map((item, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.cell}>{item.ky}</Text>
                                    <Text style={styles.cell}>{item.khoa_truong}</Text>
                                    <Text style={styles.cell}>{item.ma_lop}</Text>
                                    <Text style={styles.cell}>{item.ma_lop_kem}</Text>
                                    <Text style={styles.cell}>{item.ma_hp}</Text>
                                    <Text style={styles.cell}>{item.ten_hp}</Text>
                                    <Text style={styles.cell}>{item.khoi_luong}</Text>
                                    <Text style={styles.cell}>{item.ghi_chu}</Text>
                                    <Text style={styles.cell}>{item.tiet_bd}</Text>
                                    <Text style={styles.cell}>{item.tiet_kt}</Text>
                                    <Text style={styles.cell}>{item.buoi}</Text>
                                    <Text style={styles.cell}>{item.phong_hoc}</Text>
                                    <Text style={styles.cell}>{item.can_tn}</Text>
                                    <Text style={styles.cell}>{item.sl_dk}</Text>
                                    <Text style={styles.cell}>{item.sl_max}</Text>
                                    <Text style={styles.cell}>{item.trang_thai}</Text>
                                    <Text style={styles.cell}>{item.teaching_type}</Text>
                                    <View style={[styles.cell, styles.actionCell]}>
                                        <TouchableOpacity
                                            onPress={() => handleEdit(item)}
                                            style={styles.editBtn}
                                        >
                                            <Text style={styles.actionText}>Sửa</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleDelete(item)}
                                            style={styles.deleteBtn}
                                        >
                                            <Text style={styles.actionText}>Xoá</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Modals cho các bộ lọc Tìm kiếm */}
            <Modal visible={isModeModalOpen} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setModeModalOpen(false)}
                >
                    <View style={styles.modalContent}>
                        <FlatList
                            data={searchModeOptions}
                            keyExtractor={item => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setSearchMode(item);
                                        setModeModalOpen(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal visible={isDeptModalOpen} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setDeptModalOpen(false)}
                >
                    <View style={styles.modalContent}>
                        <FlatList
                            data={departmentOptions}
                            keyExtractor={item => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => handleSelectDepartment(item)}
                                >
                                    <Text style={styles.modalItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal visible={isMajorModalOpen} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setMajorModalOpen(false)}
                >
                    <View style={styles.modalContent}>
                        <FlatList
                            data={majorOptions}
                            keyExtractor={item => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setMajor(item);
                                        setMajorModalOpen(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Modal cho Học kỳ */}
            <Modal visible={isSemesterModalOpen} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setSemesterModalOpen(false)}
                >
                    <View style={styles.modalContent}>
                        <FlatList
                            data={semestersList}
                            keyExtractor={item => String(item.id)}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setSemesterId(item.id);
                                        setSemesterModalOpen(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{item.semester}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};
