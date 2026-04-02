import { Dimensions, StyleSheet } from 'react-native';
import { ThemeColors } from '../../../shared/types/theme.types';

const { width } = Dimensions.get('window');
const gridColumnWidth = Math.max((width - 90) / 7, 60);

/**
 * createStudentStyles(colors) — Strategy Pattern.
 * Tạo style động dựa trên theme hiện tại.
 */
export const createStudentStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: colors.background,
        },
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
        // ── Content ─────────────────────────────────────────────────────
        contentContainer: {
            flex: 1,
            padding: 15,
        },
        whatTimeIsIt: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#8dca1a',
            textAlign: 'center',
            marginVertical: 15,
        },
        actionButton: {
            backgroundColor: colors.buttonSecondary,
            paddingVertical: 12,
            borderRadius: 6,
            alignItems: 'center',
            marginBottom: 20,
        },
        actionButtonText: {
            color: colors.buttonSecondaryText,
            fontWeight: 'bold',
            fontSize: 16,
        },
        searchInput: {
            height: 50,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            borderRadius: 6,
            paddingHorizontal: 15,
            fontSize: 16,
            marginBottom: 15,
            backgroundColor: colors.inputBackground,
            color: colors.inputText,
        },
        registerButton: {
            backgroundColor: colors.buttonPrimary,
            paddingVertical: 12,
            borderRadius: 6,
            alignItems: 'center',
            marginBottom: 25,
        },
        registerButtonText: {
            color: colors.buttonPrimaryText,
            fontWeight: 'bold',
            fontSize: 16,
        },
        // ── Bảng đăng ký ────────────────────────────────────────────────
        tableContainer: {
            marginBottom: 30,
            backgroundColor: colors.surface,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 10,
        },
        table: {
            borderWidth: 1,
            borderColor: colors.tableBorder,
        },
        tableHeader: {
            flexDirection: 'row',
            backgroundColor: colors.tableHeader,
            borderBottomWidth: 1,
            borderBottomColor: colors.tableBorder,
        },
        tableRow: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: colors.tableBorder,
        },
        headerCell: {
            padding: 10,
            fontWeight: 'bold',
            fontSize: 12,
            color: colors.tableHeaderText,
            textAlign: 'center',
        },
        cell: {
            padding: 10,
            fontSize: 12,
            color: colors.tableCell,
            textAlign: 'center',
        },
        cellId: { width: 50 },
        cellCode: { width: 80 },
        cellName: { width: 180 },
        cellStatus: { width: 100 },
        cellCredits: { width: 60 },
        // ── Time Grid ────────────────────────────────────────────────────
        timeGrid: {
            borderWidth: 1,
            borderColor: colors.tableBorder,
        },
        gridRow: { flexDirection: 'row' },
        gridHeaderCorner: {
            width: 60,
            height: 40,
            backgroundColor: colors.tableHeader,
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.tableBorder,
        },
        gridHeaderCell: {
            width: gridColumnWidth,
            height: 40,
            backgroundColor: colors.tableHeader,
            justifyContent: 'center',
            alignItems: 'center',
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.tableBorder,
        },
        gridHeaderText: {
            fontWeight: 'bold',
            fontSize: 12,
            color: colors.tableHeaderText,
        },
        gridPeriodCell: {
            width: 60,
            height: 50,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.tableBorder,
        },
        gridPeriodText: {
            fontSize: 12,
            color: colors.textSecondary,
        },
        gridCell: {
            width: gridColumnWidth,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.tableBorder,
            backgroundColor: colors.background,
        },
        gridCellActive: {
            backgroundColor: '#E6F3FF',
        },
        gridEventText: {
            fontSize: 10,
            color: '#0055A4',
            textAlign: 'center',
            padding: 2,
        },
        gridDivider: {
            backgroundColor: colors.tableBorder,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        gridDividerText: {
            fontSize: 10,
            color: colors.textSecondary,
            fontWeight: 'bold',
        },
        bottomSpacer: { height: 40 },
    });
