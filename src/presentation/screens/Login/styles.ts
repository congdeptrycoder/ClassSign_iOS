import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../shared/types/theme.types';

/**
 * createLoginStyles(colors) — Strategy Pattern.
 * Mỗi lần theme thay đổi, hàm này được gọi để tạo bộ styles mới.
 */
export const createLoginStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        gradientContainer: {
            flex: 1,
        },
        safeArea: {
            flex: 1,
        },
        // ── Nút toggle theme ────────────────────────────────────────────
        themeToggleBtn: {
            position: 'absolute',
            top: 60,
            right: 15,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.themeToggleBackground,
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 5,
            zIndex: 10,
        },
        themeToggleText: {
            color: colors.themeToggleText,
            fontSize: 13,
            fontWeight: 'bold',
            marginLeft: 4,
        },
        themeToggleIcon: {
            fontSize: 16,
        },
        // ── Layout ──────────────────────────────────────────────────────
        scrollContent: {
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingVertical: 24,
        },
        scrollContentLandscape: {
            paddingHorizontal: 32,
            paddingVertical: 18,
        },
        formContainer: {
            width: '100%',
            alignSelf: 'center',
        },
        formContainerLandscape: {
            maxWidth: 560,
        },
        logoContainer: {
            alignItems: 'center',
            marginBottom: 16,
        },
        logoContainerLandscape: {
            marginBottom: 10,
        },
        logo: {
            width: 104,
            height: 152,
            resizeMode: 'contain',
        },
        logoLandscape: {
            width: 84,
            height: 122,
        },
        description: {
            fontSize: 14,
            fontStyle: 'italic',
            color: '#fff',
            textAlign: 'center',
            marginBottom: 40,
            fontWeight: '500',
        },
        descriptionLandscape: {
            marginBottom: 20,
        },
        // ── Input (deprecated, dùng inputWrapper + inputInner thay thế) ──
        input: {
            width: '90%',
            alignSelf: 'center',
            height: 50,
            backgroundColor: colors.inputBackground,
            marginBottom: 15,
            paddingHorizontal: 15,
            borderRadius: 10,
            fontSize: 16,
            color: colors.inputText,
            borderWidth: 1,
            borderColor: colors.inputBorder,
        },
        inputLandscape: {
            width: '100%',
            maxWidth: 460,
            marginBottom: 12,
        },
        // ── Input Wrapper (Animated.View bao quanh) ────────────────────
        inputWrapper: {
            width: '90%',
            alignSelf: 'center',
            height: 50,
            backgroundColor: colors.inputBackground,
            marginBottom: 15,
            borderRadius: 10,
            borderWidth: 3,
            borderColor: colors.inputBorder,
            justifyContent: 'center',
        },
        inputWrapperLandscape: {
            width: '100%',
            maxWidth: 460,
            marginBottom: 12,
        },
        // ── Input Inner (TextInput bên trong Wrapper) ──────────────────
        inputInner: {
            flex: 1,
            paddingHorizontal: 15,
            fontSize: 16,
            color: colors.inputText,
            borderWidth: 0,
        },
        inputInnerLandscape: {
            // Kế thừa từ inputInner, không cần thêm
        },
        // ── Button đăng nhập ────────────────────────────────────────────
        loginButton: {
            height: 50,
            width: '40%',
            alignSelf: 'center',
            backgroundColor: colors.buttonSecondary,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginTop: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        loginButtonLandscape: {
            width: '100%',
            maxWidth: 220,
            marginTop: 4,
        },
        loginButtonDisabled: {
            opacity: 0.6,
        },
        loginButtonText: {
            color: colors.buttonSecondaryText,
            fontSize: 18,
            fontWeight: 'bold',
        },
        // ── Thông báo lỗi ────────────────────────────────────────────────
        errorText: {
            color: '#ffffff',
            fontSize: 13,
            textAlign: 'center',
            marginBottom: 8,
            backgroundColor: '#FFD700',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            alignSelf: 'center',
            width: '90%',
            fontWeight: '500',
        },
    });
