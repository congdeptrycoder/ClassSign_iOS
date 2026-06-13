import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useAdminCourseRegistrationDetailsViewModel } from '../../../interface-adapters/viewmodels/AdminCourseRegistrationDetails/useAdminCourseRegistrationDetailsViewModel';
import { useTheme } from '../../components/ThemeContext';
import { AlarmTwoChoose } from '../../components/alarm_two_choose';
import { createStyles } from './AdminCourseRegistrationDetailsScreen.styles';

type AdminCourseRegistrationDetailsScreenProps = {
    semester: number;
    semesterName?: string;
    onGoBack: () => void;
    onNavigateToCreateClass?: (ky: string, truongKhoa: string, maHp: string, tenHp: string) => void;
    onNavigateToEditClass?: (classData: any) => void;
    isVisible?: boolean;
};

export const AdminCourseRegistrationDetailsScreen = ({
    semester,
    semesterName,
    onGoBack,
    onNavigateToCreateClass,
    onNavigateToEditClass,
    isVisible = true,
}: AdminCourseRegistrationDetailsScreenProps) => {
    const { colors } = useTheme();
    const [classToDelete, setClassToDelete] = useState<number | null>(null);

    const {
        stats,
        loading,
        error,
        filterMaHp,
        setFilterMaHp,
        filterTenHp,
        setFilterTenHp,
        filterTruongKhoa,
        setFilterTruongKhoa,
        filterSoLuong,
        setFilterSoLuong,
        expandedCourseId,
        expandedClasses,
        loadingClasses,
        toggleExpand,
        deleteClass,
    } = useAdminCourseRegistrationDetailsViewModel(semester, isVisible);

    const styles = createStyles(colors);

    return (
        <SafeAreaView style={styles.container}>
            {/* ── Header ──────────────────────────────────────────────── */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chi tiết Đăng ký Học phần</Text>
                <TouchableOpacity style={styles.backBtn} onPress={onGoBack}>
                    <Text style={styles.backBtnText}>Quay lại</Text>
                </TouchableOpacity>
            </View>

            {/* ── Info card ───────────────────────────────────────────── */}
            <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                    Kỳ học: {semesterName || semester || 'Không xác định'}
                </Text>
            </View>

            {/* ── Loading / Error ─────────────────────────────────────── */}
            {loading && (
                <View style={styles.centeredBox}>
                    <ActivityIndicator size="large" color={colors.buttonPrimary} />
                    <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
                        Đang tải dữ liệu...
                    </Text>
                </View>
            )}
            {!loading && error && (
                <View style={styles.centeredBox}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {/* ── Filter Inputs ────────────────────────────────────────── */}
            {!loading && !error && (
                <>
                    {/* ── Table ───────────────────────────────────────────── */}
                    <ScrollView style={styles.tableWrapper} showsVerticalScrollIndicator={false}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View>
                                {/* Header row */}
                                <View style={styles.tableHeader}>
                                    <View style={[styles.cell, styles.headerCell, styles.cellMaHp]}>
                                        <Text style={styles.headerText}>Mã HP</Text>
                                        <TextInput
                                            style={styles.headerFilterInput}
                                            placeholder="Lọc..."
                                            placeholderTextColor={colors.textSecondary}
                                            value={filterMaHp}
                                            onChangeText={setFilterMaHp}
                                        />
                                    </View>
                                    <View style={[styles.cell, styles.headerCell, styles.cellTenHp]}>
                                        <Text style={styles.headerText}>Tên HP</Text>
                                        <TextInput
                                            style={styles.headerFilterInput}
                                            placeholder="Lọc..."
                                            placeholderTextColor={colors.textSecondary}
                                            value={filterTenHp}
                                            onChangeText={setFilterTenHp}
                                        />
                                    </View>
                                    <View style={[styles.cell, styles.headerCell, styles.cellTruongKhoa]}>
                                        <Text style={styles.headerText}>Trường/Khoa</Text>
                                        <TextInput
                                            style={styles.headerFilterInput}
                                            placeholder="Lọc..."
                                            placeholderTextColor={colors.textSecondary}
                                            value={filterTruongKhoa}
                                            onChangeText={setFilterTruongKhoa}
                                        />
                                    </View>
                                    <View style={[styles.cell, styles.headerCell, styles.cellSoLuong]}>
                                        <Text style={styles.headerText}>SL ĐK Học phần</Text>
                                        <TextInput
                                            style={styles.headerFilterInput}
                                            placeholder="Lọc..."
                                            placeholderTextColor={colors.textSecondary}
                                            value={filterSoLuong}
                                            onChangeText={setFilterSoLuong}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <View style={[styles.cell, styles.headerCell, styles.cellSoLuongLop]}>
                                        <Text style={styles.headerText}>Số lượng lớp</Text>
                                    </View>
                                    <View style={[styles.cell, styles.headerCell, styles.cellSoLuongToiDa]}>
                                        <Text style={styles.headerText}>Hỗ trợ Max sinh viên</Text>
                                    </View>
                                    <View style={[styles.cell, styles.headerCell, styles.cellTrangThai]}>
                                        <Text style={styles.headerText}>Trạng thái</Text>
                                    </View>
                                    <View style={[styles.cell, styles.headerCell, styles.cellAction, { borderRightWidth: 0 }]}>
                                        <Text style={styles.headerText}>Hành động</Text>
                                    </View>
                                </View>

                                {/* Data rows */}
                                {stats.map((stat, idx) => {
                                    let trangThai = '';
                                    if (stat.so_luong_lop === 0) {
                                        trangThai = 'Chưa có lớp';
                                    } else if (stat.so_luong_dk_toi_da < stat.so_luong_dang_ky) {
                                        trangThai = 'Chưa phục vụ đủ sinh viên';
                                    } else {
                                        trangThai = 'Đã đáp ứng đủ';
                                    }

                                    return (
                                        <View key={idx} style={styles.tableRow}>
                                            <Text style={[styles.cell, styles.cellMaHp]}>{stat.ma_hp}</Text>
                                            <Text style={[styles.cell, styles.cellTenHp]}>{stat.ten_hp}</Text>
                                            <Text style={[styles.cell, styles.cellTruongKhoa]}>
                                                {stat.truong_khoa}
                                            </Text>
                                            <Text style={[styles.cell, styles.cellSoLuong]}>
                                                {stat.so_luong_dang_ky}
                                            </Text>
                                            <Text style={[styles.cell, styles.cellSoLuongLop]}>
                                                {stat.so_luong_lop}
                                            </Text>
                                            <Text style={[styles.cell, styles.cellSoLuongToiDa]}>
                                                {stat.so_luong_dk_toi_da}
                                            </Text>
                                            <Text style={[styles.cell, styles.cellTrangThai, { color: trangThai === 'Đã đáp ứng đủ' ? '#5cb85c' : '#d9534f', fontWeight: 'bold' }]}>
                                                {trangThai}
                                            </Text>
                                            <View style={[styles.cellAction, { borderRightWidth: 0, borderBottomWidth: 0 }]}>
                                                <TouchableOpacity
                                                    style={styles.actionBtnMopLop}
                                                    onPress={() => onNavigateToCreateClass?.(
                                                        semesterName || String(semester),
                                                        stat.truong_khoa,
                                                        stat.ma_hp,
                                                        stat.ten_hp
                                                    )}
                                                >
                                                    <Text style={styles.actionBtnText}>Mở lớp</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.actionBtnXemDS} onPress={() => toggleExpand(stat.course_id)}>
                                                    <Text style={styles.actionBtnText}>
                                                        {expandedCourseId === stat.course_id ? 'Đóng DS' : 'Xem DS lớp'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })}

                                {stats.length === 0 && (
                                    <View style={[styles.tableRow, { paddingVertical: 20 }]}>
                                        <Text style={styles.emptyText}>
                                            Không có dữ liệu phù hợp
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>

                        {/* Expanded Table at the bottom (or inside row, but React Native ScrollView makes it tricky inside a horizontal ScrollView). 
                            Here we render it as a separate section below the main table for the selected course */}
                        {expandedCourseId && (
                            <View style={[styles.subTableWrapper, { marginTop: 20 }]}>
                                <Text style={{ fontWeight: 'bold', marginBottom: 10, color: colors.text }}>
                                    Danh sách lớp của học phần {stats.find(s => s.course_id === expandedCourseId)?.ma_hp} - {stats.find(s => s.course_id === expandedCourseId)?.ten_hp}
                                </Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                    <View>
                                        <View style={styles.subTableHeaderRow}>
                                            <Text style={[styles.subCell, { fontWeight: 'bold', color: colors.tableHeaderText }]}>Mã lớp</Text>
                                            <Text style={[styles.subCell, { fontWeight: 'bold', color: colors.tableHeaderText }]}>Lớp kèm</Text>
                                            <Text style={[styles.subCell, { fontWeight: 'bold', color: colors.tableHeaderText }]}>Ghi chú</Text>
                                            <Text style={[styles.subCell, { fontWeight: 'bold', color: colors.tableHeaderText }]}>Thứ <Text style={{ color: 'red' }}>*</Text></Text>
                                            <Text style={[styles.subCell, { fontWeight: 'bold', color: colors.tableHeaderText }]}>Tiết BD</Text>
                                            <Text style={[styles.subCell, { fontWeight: 'bold', color: colors.tableHeaderText }]}>Tiết KT</Text>
                                            <Text style={[styles.subCell, { fontWeight: 'bold', color: colors.tableHeaderText }]}>Buổi</Text>
                                            <Text style={[styles.subCell, { fontWeight: 'bold', color: colors.tableHeaderText }]}>Phòng học</Text>
                                            <Text style={[styles.subCell, { fontWeight: 'bold', color: colors.tableHeaderText }]}>Cần TN</Text>
                                            <Text style={[styles.subCell, { fontWeight: 'bold', color: colors.tableHeaderText }]}>TeachingType</Text>
                                            <Text style={[styles.subCell, { fontWeight: 'bold', color: colors.tableHeaderText }]}>SL Max</Text>
                                            <Text style={[styles.subCell, { fontWeight: 'bold', color: colors.tableHeaderText }]}>SLĐK</Text>
                                            <Text style={[styles.subCell, { fontWeight: 'bold', color: colors.tableHeaderText, minWidth: 100 }]}>Hành động</Text>
                                        </View>

                                        {loadingClasses ? (
                                            <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
                                        ) : expandedClasses.length === 0 ? (
                                            <Text style={[styles.emptyText, { marginVertical: 20 }]}>Chưa có lớp học nào</Text>
                                        ) : (
                                            expandedClasses.map(cls => {
                                                const detail = JSON.parse(cls.detail || '{}');
                                                return (
                                                    <View key={cls.id} style={styles.subTableRow}>
                                                        <Text style={styles.subCell}>{detail.ma_lop}</Text>
                                                        <Text style={styles.subCell}>{detail.ma_lop_kem !== 'NULL' ? detail.ma_lop_kem : ''}</Text>
                                                        <Text style={styles.subCell}>{detail.ghi_chu !== 'NULL' ? detail.ghi_chu : ''}</Text>
                                                        <Text style={styles.subCell}>{detail.thu}</Text>
                                                        <Text style={styles.subCell}>{detail.tiet_bd}</Text>
                                                        <Text style={styles.subCell}>{detail.tiet_kt}</Text>
                                                        <Text style={styles.subCell}>{detail.buoi}</Text>
                                                        <Text style={styles.subCell}>{detail.phong_hoc}</Text>
                                                        <Text style={styles.subCell}>{detail.can_tn !== 'NULL' ? detail.can_tn : ''}</Text>
                                                        <Text style={styles.subCell}>{detail.teaching_type !== 'NULL' ? detail.teaching_type : ''}</Text>
                                                        <Text style={styles.subCell}>{cls.total_slots}</Text>
                                                        <Text style={styles.subCell}>{cls.occupied_slots}</Text>
                                                        <View style={[styles.subCell, { flexDirection: 'row', justifyContent: 'center', minWidth: 100 }]}>
                                                            <TouchableOpacity
                                                                style={[styles.subActionBtn, styles.editBtn]}
                                                                onPress={() => {
                                                                    if (onNavigateToEditClass) {
                                                                        const courseStat = stats.find(s => s.course_id === expandedCourseId);
                                                                        onNavigateToEditClass({
                                                                            id: cls.id,
                                                                            ky: semesterName || String(semester),
                                                                            khoa_truong: courseStat?.truong_khoa || '',
                                                                            ma_hp: courseStat?.ma_hp || '',
                                                                            ten_hp: courseStat?.ten_hp || '',
                                                                            ...detail,
                                                                            sl_max: String(cls.total_slots)
                                                                        });
                                                                    }
                                                                }}
                                                            >
                                                                <Text style={styles.actionBtnText}>Sửa</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                style={[styles.subActionBtn, styles.deleteBtn]}
                                                                onPress={() => setClassToDelete(cls.id)}
                                                            >
                                                                <Text style={styles.actionBtnText}>Xoá</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                );
                                            })
                                        )}
                                    </View>
                                </ScrollView>
                            </View>
                        )}
                    </ScrollView>
                </>
            )}

            <AlarmTwoChoose
                visible={classToDelete !== null}
                message="Bạn có chắc chắn muốn xoá lớp học này? Hành động này không thể hoàn tác."
                cancelText="Huỷ"
                confirmText="Xoá"
                onCancel={() => setClassToDelete(null)}
                onConfirm={() => {
                    if (classToDelete) {
                        deleteClass(classToDelete);
                        setClassToDelete(null);
                    }
                }}
            />
        </SafeAreaView>
    );
};
