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
        // ── Navbar ──────────────────────────────────────────────────────
        navBarHeader: {
            flexDirection: 'row',
            height: 60,
            backgroundColor: colors.navBar,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            zIndex: 10,
        },
        logo: {
            width: 100,
            height: 40,
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.card,
        },
        // ── UserInfo popup ───────────────────────────────────────────────
        userInfoBox: {
            position: 'absolute',
            top: 70,
            right: 15,
            backgroundColor: colors.card,
            padding: 15,
            borderRadius: 8,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            zIndex: 20,
            alignItems: 'center',
        },
        userInfoText: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 10,
            color: colors.cardText,
        },
        logoutButton: {
            backgroundColor: colors.buttonPrimary,
            paddingVertical: 6,
            paddingHorizontal: 15,
            borderRadius: 4,
        },
        logoutButtonText: {
            color: colors.buttonPrimaryText,
            fontWeight: 'bold',
            fontSize: 12,
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
            fontWeight: 'bold',
            color: colors.tableHeaderText,
        },
        actionCell: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: 120,
            alignItems: 'center',
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
    });
