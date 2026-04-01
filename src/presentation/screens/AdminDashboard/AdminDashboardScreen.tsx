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
import { useTheme } from '../../components/ThemeContext';
import { createAdminStyles } from './styles';

type AdminDashboardScreenProps = {
    onLogout: () => void;
    onNavigateToEdit?: (item: ClassInfo) => void;
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
    } = useAdminDashboardViewModel(onNavigateToEdit, onLogout);

    const { colors } = useTheme();
    const styles = createAdminStyles(colors);

    return (
        <SafeAreaView style={styles.container}>
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

            {isProfileOpen && (
                <View style={styles.userInfoBox}>
                    <Text style={styles.userInfoText}>Nguyễn Tuấn Anh - PDT3636</Text>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.warningText}>
                    ĐƯỢC PHÉP CHỈNH SỬA! Giai đoạn TEST
                </Text>

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
                    <ScrollView horizontal>
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
        </SafeAreaView>
    );
};
