/**
 * shared-styles.ts
 *
 * Chỉ chứa các styles về layout/kích thước KHÔNG phụ thuộc màu sắc.
 * Màu sắc được quản lý hoàn toàn bởi ThemeContext (lightColors / darkColors).
 *
 * Sử dụng createSharedStyles(colors) để tạo styles đầy đủ nếu cần dùng chung.
 */

import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../shared/types/theme.types';

// ─── Layout-only styles (không phụ thuộc màu) ─────────────────────────────────
export const sharedLayout = StyleSheet.create({
    logo: {
        width: 100,
        height: 40,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    tableHeader: {
        borderBottomWidth: 2,
    },
    cell: {
        padding: 10,
        borderRightWidth: 1,
        textAlign: 'center',
        fontSize: 12,
    },
    headerCell: {
        fontWeight: 'bold',
    },
    navBarHeader: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        zIndex: 10,
    },
    userInfoBox: {
        position: 'absolute',
        top: 70,
        right: 15,
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
    logoutButton: {
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 4,
    },
});

// ─── Factory Function (Strategy Pattern) ──────────────────────────────────────
/**
 * createSharedStyles(colors) — tạo styles dùng chung với màu sắc theo theme.
 * Mỗi màn hình có thể gọi hàm này hoặc tự tạo styles riêng dựa trên colors.
 */
export const createSharedStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        navBarHeader: {
            ...sharedLayout.navBarHeader,
            backgroundColor: colors.navBar,
        },
        logo: {
            ...sharedLayout.logo,
        },
        avatar: {
            ...sharedLayout.avatar,
            backgroundColor: colors.card,
        },
        userInfoBox: {
            ...sharedLayout.userInfoBox,
            backgroundColor: colors.card,
        },
        userInfoText: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 10,
            color: colors.cardText,
        },
        logoutButton: {
            ...sharedLayout.logoutButton,
            backgroundColor: colors.buttonPrimary,
        },
        logoutButtonText: {
            color: colors.buttonPrimaryText,
            fontWeight: 'bold',
            fontSize: 12,
        },
        scrollContent: {
            ...sharedLayout.scrollContent,
        },
        tableRow: {
            ...sharedLayout.tableRow,
            borderColor: colors.tableBorder,
        },
        tableHeader: {
            ...sharedLayout.tableHeader,
            backgroundColor: colors.tableHeader,
            borderColor: colors.tableBorder,
        },
        cell: {
            ...sharedLayout.cell,
            borderColor: colors.tableBorder,
            color: colors.tableCell,
        },
        headerCell: {
            ...sharedLayout.headerCell,
        },
    });

// Backward compatible alias — để các file styles.ts cũ vẫn import được
// Sẽ dần dần migrate từng màn hình sang dùng createSharedStyles(colors)
export const sharedStyles = createSharedStyles({
    background: '#FFFFFF',
    surface: '#F8F8F8',
    navBar: '#CC0000',
    text: '#333333',
    textSecondary: '#666666',
    buttonPrimary: '#8B0000',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondary: '#FFD700',
    buttonSecondaryText: '#8B0000',
    tableHeader: '#F0F0F0',
    tableBorder: '#EEEEEE',
    tableHeaderText: '#555555',
    tableCell: '#333333',
    inputBackground: 'rgba(255, 255, 255, 0.9)',
    inputText: '#333333',
    inputBorder: '#DDDDDD',
    card: '#FFFFFF',
    cardText: '#333333',
    link: '#0275d8',
    separator: '#EEEEEE',
    searchSection: '#F9F9F9',
    searchButton: '#8B0000',
    modalBackground: '#FFFFFF',
    loginGradient: ['#8B0000', '#FF4D4D'],
    themeToggleBackground: 'rgba(255,255,255,0.25)',
    themeToggleText: '#FFFFFF',
});
