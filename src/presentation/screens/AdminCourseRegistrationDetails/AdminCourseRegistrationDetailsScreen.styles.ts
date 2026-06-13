import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) =>
    StyleSheet.create({
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
            width: 200,
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
            alignItems: 'center',
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
        // ── Sub-Table ────────────────────────────────────────────────
        subTableWrapper: {
            backgroundColor: colors.card,
            padding: 10,
            borderBottomWidth: 1,
            borderColor: colors.tableBorder,
        },
        subTableHeaderRow: {
            flexDirection: 'row',
            backgroundColor: colors.tableHeader,
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderColor: colors.tableBorder,
        },
        subTableRow: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: colors.tableBorder,
            paddingVertical: 8,
            alignItems: 'center',
        },
        subCell: {
            flex: 1,
            fontSize: 11,
            color: colors.tableCell,
            textAlign: 'center',
            minWidth: 70,
        },
        subActionBtn: {
            padding: 6,
            borderRadius: 4,
            marginHorizontal: 2,
        },
        editBtn: { backgroundColor: '#f0ad4e' },
        deleteBtn: { backgroundColor: '#d9534f' },
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
