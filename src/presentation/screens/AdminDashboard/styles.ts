import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../shared/types/theme.types';

/**
 * createAdminStyles(colors) — Strategy Pattern.
 * Tạo style động dựa trên theme hiện tại cho AdminDashboard.
 */
export const createAdminStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },

        scrollContent: {
            padding: 16,
            paddingBottom: 40,
        },
        // ── Warning ─────────────────────────────────────────────────────
        warningText: {
            color: '#83b13e',
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 16,
        },
        // ── Upload ──────────────────────────────────────────────────────
        uploadSection: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
        },
        uploadBtn: {
            backgroundColor: colors.buttonSecondary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 4,
        },
        uploadBtnText: {
            color: colors.buttonSecondaryText,
            fontWeight: 'bold',
        },
        uploadHint: {
            marginLeft: 10,
            color: colors.textSecondary,
            fontStyle: 'italic',
        },
        // ── Search ──────────────────────────────────────────────────────
        searchSection: {
            backgroundColor: colors.searchSection,
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
        },
        searchInput: {
            borderWidth: 1,
            borderColor: colors.inputBorder,
            borderRadius: 4,
            padding: 8,
            marginBottom: 10,
            backgroundColor: colors.inputBackground,
            color: colors.inputText,
        },
        filtersRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 10,
        },
        pickerBtn: {
            borderWidth: 1,
            borderColor: colors.inputBorder,
            borderRadius: 4,
            padding: 8,
            backgroundColor: colors.inputBackground,
        },
        pickerBtnText: {
            color: colors.text,
        },
        searchBtn: {
            backgroundColor: colors.searchButton,
            padding: 10,
            borderRadius: 4,
            alignItems: 'center',
        },
        searchBtnText: {
            color: '#fff',
            fontWeight: 'bold',
        },
        // ── Table ───────────────────────────────────────────────────────
        tableSection: {
            marginTop: 10,
        },
        tableRow: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: colors.tableBorder,
        },
        tableHeader: {
            backgroundColor: colors.tableHeader,
            borderBottomWidth: 2,
            borderColor: colors.tableBorder,
        },
        cell: {
            width: 100,
            padding: 10,
            borderRightWidth: 1,
            borderColor: colors.tableBorder,
            textAlign: 'center',
            fontSize: 12,
            color: colors.tableCell,
        },
        headerCell: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerText: {
            fontWeight: 'bold',
            color: colors.tableHeaderText,
            marginBottom: 4,
        },
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
        actionCell: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: 120,
            alignItems: 'center',
        },
        detailBtn: {
            backgroundColor: '#337ab7',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
        },
        editBtn: {
            backgroundColor: '#f0ad4e',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
        },
        deleteBtn: {
            backgroundColor: '#d9534f',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
        },
        actionText: {
            color: '#fff',
            fontSize: 12,
        },
        // ── Modal ───────────────────────────────────────────────────────
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            backgroundColor: colors.modalBackground,
            width: '80%',
            maxHeight: '60%',
            borderRadius: 8,
            padding: 10,
        },
        modalItem: {
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: colors.separator,
        },
        modalItemText: {
            fontSize: 16,
            color: colors.text,
            textAlign: 'center',
        },
        // ── Thiết lập giai đoạn đăng ký (Registration Phase Setup) ────
        phaseSetupContainer: {
            backgroundColor: colors.surface,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.tableBorder,
            marginBottom: 20,
        },
        phaseFormGroup: {
            marginBottom: 12,
        },
        phaseLabel: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 6,
        },
        phaseTextInput: {
            borderWidth: 1,
            borderColor: colors.inputBorder,
            borderRadius: 4,
            padding: 10,
            backgroundColor: colors.inputBackground,
            color: colors.inputText,
            fontSize: 14,
        },
        phaseRadioGroup: {
            flexDirection: 'row',
            gap: 10,
            marginBottom: 6,
        },
        phaseRadioButton: {
            flex: 1,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            borderRadius: 4,
            paddingVertical: 10,
            alignItems: 'center',
            backgroundColor: colors.inputBackground,
        },
        phaseRadioButtonActive: {
            backgroundColor: colors.buttonSecondary,
            borderColor: colors.buttonSecondary,
        },
        phaseRadioText: {
            color: colors.text,
            fontSize: 13,
            fontWeight: '600',
        },
        phaseRadioTextActive: {
            color: colors.buttonSecondaryText,
            fontSize: 13,
            fontWeight: 'bold',
        },
        phaseButtonsRow: {
            flexDirection: 'row',
            gap: 10,
            marginTop: 8,
        },
        savePhaseBtn: {
            flex: 2,
            backgroundColor: colors.buttonPrimary,
            paddingVertical: 12,
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
        },
        savePhaseBtnText: {
            color: colors.buttonPrimaryText,
            fontWeight: 'bold',
            fontSize: 14,
        },
        cancelPhaseBtn: {
            flex: 1,
            backgroundColor: '#aaaaaa',
            paddingVertical: 12,
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
        },
        cancelPhaseBtnText: {
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: 14,
        },
        phaseTableTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
            marginTop: 15,
            marginBottom: 10,
        },
        statusCell: {
            fontWeight: 'bold',
        },
        statusOpen: {
            color: '#4caf50', // Màu xanh lá cho ĐANG MỞ
        },
        statusClosed: {
            color: '#f44336', // Màu đỏ cho ĐÃ ĐÓNG
        },
        timeCell: {
            width: 200,
        },
        typeCell: {
            width: 120,
        },
        statusLabelCell: {
            width: 100,
        },
        phaseActionCell: {
            width: 200,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        divider: {
            height: 2,
            backgroundColor: colors.separator,
            marginVertical: 20,
        },
    });
