import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../shared/types/theme.types';

/**
 * createAdminClassFormStyles(colors) — Strategy Pattern.
 * Tạo style động dựa trên theme hiện tại cho AdminClassFormScreen (dùng chung Create & Edit).
 */
export const createAdminClassFormStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            padding: 16,
            borderBottomWidth: 1,
            borderColor: colors.separator,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
        },
        backBtn: {
            marginRight: 16,
            padding: 8,
        },
        backBtnText: {
            color: colors.link,
            fontWeight: 'bold',
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            flexShrink: 1,
        },
        scrollContent: {
            padding: 16,
            paddingBottom: 40,
        },
        inputGroup: {
            marginBottom: 16,
        },
        label: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 8,
            color: colors.text,
        },
        input: {
            borderWidth: 1,
            borderColor: colors.inputBorder,
            borderRadius: 4,
            padding: 10,
            backgroundColor: colors.inputBackground,
            color: colors.inputText,
        },
        saveBtn: {
            backgroundColor: colors.buttonPrimary,
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 20,
        },
        saveBtnText: {
            color: colors.buttonPrimaryText,
            fontWeight: 'bold',
            fontSize: 16,
        },
        // ── Modal dropdown ──────────────────────────────────────────────
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
