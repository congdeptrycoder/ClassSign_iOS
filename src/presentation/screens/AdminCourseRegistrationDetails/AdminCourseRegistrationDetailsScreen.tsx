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

type AdminCourseRegistrationDetailsScreenProps = {
    semester: number;
    semesterName?: string;
    onGoBack: () => void;
};

export const AdminCourseRegistrationDetailsScreen = ({
    semester,
    semesterName,
    onGoBack,
}: AdminCourseRegistrationDetailsScreenProps) => {
    const { colors } = useTheme();

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
    } = useAdminCourseRegistrationDetailsViewModel(semester);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        // ── Header ─────────────────────────────────────────────────────
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.navBar,
        },
        headerTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#ffffff',
            flex: 1,
        },
        backBtn: {
            backgroundColor: '#d9534f',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 4,
        },
        backBtnText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 13,
        },
        // ── Info card ──────────────────────────────────────────────────
        infoCard: {
            margin: 16,
            padding: 12,
            backgroundColor: colors.card,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.tableBorder,
        },
        infoText: {
            fontSize: 15,
            fontWeight: 'bold',
            color: colors.cardText,
        },
        // ── Filter input trong Header ───────────────────────────────────
        headerFilterInput: {
            borderWidth: 1,
            borderColor: colors.inputBorder,
            borderRadius: 4,
            padding: 4,
            marginTop: 4,
            backgroundColor: colors.inputBackground,
            color: colors.inputText,
            fontSize: 11,
            width: '100%',
        },
        // ── Table ──────────────────────────────────────────────────────
        tableWrapper: {
            flex: 1,
            marginHorizontal: 16,
        },
        tableHeader: {
            flexDirection: 'row',
            backgroundColor: colors.tableHeader,
            borderBottomWidth: 2,
            borderColor: colors.tableBorder,
        },
        tableRow: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: colors.tableBorder,
            alignItems: 'center',
        },
        cell: {
            padding: 10,
            borderRightWidth: 1,
            borderColor: colors.tableBorder,
            fontSize: 12,
            color: colors.tableCell,
            textAlign: 'center',
        },
        headerCell: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerText: {
            fontWeight: 'bold',
            color: colors.tableHeaderText,
            textAlign: 'center',
        },
        cellMaHp: { width: 90 },
        cellTenHp: { width: 140 },
        cellTruongKhoa: { width: 120 },
        cellSoLuong: { width: 90 },
        cellSoLuongLop: { width: 90 },
        cellSoLuongToiDa: { width: 100 },
        cellTrangThai: { width: 150 },
        cellAction: {
            width: 160,
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
        },
        actionBtnMopLop: {
            backgroundColor: '#5cb85c',
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderRadius: 4,
            marginRight: 4,
        },
        actionBtnXemDS: {
            backgroundColor: '#337ab7',
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderRadius: 4,
        },
        actionBtnText: {
            color: '#fff',
            fontSize: 11,
            fontWeight: 'bold',
        },
        // ── States ─────────────────────────────────────────────────────
        centeredBox: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        errorText: {
            color: '#d9534f',
            fontSize: 14,
            textAlign: 'center',
        },
        emptyText: {
            color: colors.textSecondary,
            fontSize: 14,
            textAlign: 'center',
        },
    });

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
                                        <Text style={styles.headerText}>Số lượng ĐK</Text>
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
                                        <Text style={styles.headerText}>SL ĐK tối đa</Text>
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
                                            <Text style={[styles.cell, styles.cellTrangThai, { color: trangThai ? '#d9534f' : colors.tableCell, fontWeight: trangThai ? 'bold' : 'normal' }]}>
                                                {trangThai}
                                            </Text>
                                            <View style={[styles.cellAction, { borderRightWidth: 0, borderBottomWidth: 0 }]}>
                                                <TouchableOpacity style={styles.actionBtnMopLop} onPress={() => {}}>
                                                    <Text style={styles.actionBtnText}>Mở lớp</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.actionBtnXemDS} onPress={() => {}}>
                                                    <Text style={styles.actionBtnText}>Xem danh sách lớp</Text>
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
                    </ScrollView>
                </>
            )}
        </SafeAreaView>
    );
};
