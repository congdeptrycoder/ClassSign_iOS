import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../shared/types/theme.types';

/**
 * createAdminEditStyles(colors) — Strategy Pattern.
 * Tạo style động dựa trên theme hiện tại cho AdminEditClass.
 */
export const createAdminEditStyles = (colors: ThemeColors) =>
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
            backgroundColor: '#5cb85c',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 20,
        },
        saveBtnText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
        },
    });
