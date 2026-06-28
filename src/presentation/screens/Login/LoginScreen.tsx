import React, { useState, useRef, useEffect } from 'react';
import {
    ActivityIndicator,
    Animated,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLoginViewModel } from '../../../interface-adapters/viewmodels/Login/useLoginViewModel';
import { useTheme } from '../../components/ThemeContext';
import { createLoginStyles } from './styles';
import { Account } from '../../../domain/entities/Account';

type LoginScreenProps = {
    onLoginSuccess?: (account: Account) => void;
};

export const LoginScreen = ({ onLoginSuccess }: LoginScreenProps) => {
    const { password, setPassword, handleLogin, isLoading, error, account } = useLoginViewModel(onLoginSuccess);
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const { isDark, toggleTheme, colors } = useTheme();
    const styles = createLoginStyles(colors);

    const [usernameInput, setUsernameInput] = useState('');

    // Animation values cho viền và nền input
    const usernameColorAnim = useRef(new Animated.Value(0)).current;
    const passwordColorAnim = useRef(new Animated.Value(0)).current;
    const usernameBackgroundAnim = useRef(new Animated.Value(0)).current;
    const passwordBackgroundAnim = useRef(new Animated.Value(0)).current;

    // Xử lý animation khi đăng nhập thành công
    useEffect(() => {
        if (account && !isLoading) {
            playSuccessAnimation(account);
        }
    }, [account, isLoading]);

    const playSuccessAnimation = (loggedInAccount: Account) => {
        // Animation 1: Username - viền + nền chuyển sang xanh lá (0.5s)
        Animated.parallel([
            Animated.timing(usernameColorAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
            }),
            Animated.timing(usernameBackgroundAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
            }),
        ]).start(() => {
            // Animation 2: Password - viền + nền chuyển sang xanh lá (0.5s)
            Animated.parallel([
                Animated.timing(passwordColorAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: false,
                }),
                Animated.timing(passwordBackgroundAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                // Sau khi animation xong, gọi onLoginSuccess để chuyển sang giao diện role
                // Reset animations cho lần đăng nhập tiếp theo
                usernameColorAnim.setValue(0);
                passwordColorAnim.setValue(0);
                usernameBackgroundAnim.setValue(0);
                passwordBackgroundAnim.setValue(0);
                onLoginSuccess?.(loggedInAccount);
            });
        });
    };

    // Interpolate animation values thành màu viền và nền
    const usernameBorderColor = usernameColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.inputBorder, colors.statusSuccess], // từ màu ban đầu sang xanh lá
    });

    const passwordBorderColor = passwordColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.inputBorder, colors.statusSuccess], // từ màu ban đầu sang xanh lá
    });

    const usernameBackgroundColor = usernameBackgroundAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.inputBackground, colors.statusSuccess], // từ màu ban đầu sang xanh lá cây nhạt
    });

    const passwordBackgroundColor = passwordBackgroundAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.inputBackground, colors.statusSuccess], // từ màu ban đầu sang xanh lá cây nhạt
    });

    const handlePressLogin = () => {
        handleLogin(usernameInput);
    };

    return (
        <LinearGradient
            colors={colors.loginGradient}
            style={styles.gradientContainer}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* ── Nút Toggle Dark/Light Mode ─────────────────────── */}
                <TouchableOpacity
                    style={styles.themeToggleBtn}
                    onPress={toggleTheme}
                    testID="theme-toggle-btn"
                    accessibilityLabel={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
                >
                    <Text style={styles.themeToggleIcon}>{isDark ? '☀️' : '🌙'}</Text>
                    <Text style={styles.themeToggleText}>
                        {isDark ? 'Giao diện Sáng' : 'Giao diện Tối'}
                    </Text>
                </TouchableOpacity>

                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        isLandscape && styles.scrollContentLandscape,
                    ]}
                    keyboardShouldPersistTaps="handled"
                >
                    <View
                        style={[
                            styles.formContainer,
                            isLandscape && styles.formContainerLandscape,
                        ]}
                    >
                        <View
                            style={[
                                styles.logoContainer,
                                isLandscape && styles.logoContainerLandscape,
                            ]}
                        >
                            <Image
                                source={require('../../../../assets/image/hust-logo.png')}
                                style={[
                                    styles.logo,
                                    isLandscape && styles.logoLandscape,
                                ]}
                            />
                        </View>

                        <Text
                            style={[
                                styles.description,
                                isLandscape && styles.descriptionLandscape,
                            ]}
                        >
                            Hệ thống đăng ký học tập tiện lợi
                        </Text>

                        {/* ── Input Tài khoản với animation ─────────────────── */}
                        <Animated.View
                            style={[
                                styles.inputWrapper,
                                isLandscape && styles.inputWrapperLandscape,
                                {
                                    borderColor: usernameBorderColor,
                                    backgroundColor: usernameBackgroundColor,
                                },
                            ]}
                        >
                            <TextInput
                                style={[styles.inputInner, isLandscape && styles.inputInnerLandscape]}
                                placeholder="Tài khoản"
                                value={usernameInput}
                                onChangeText={setUsernameInput}
                                autoCapitalize="none"
                                placeholderTextColor={!isDark ? '#000000' : colors.textSecondary}
                            />
                        </Animated.View>

                        {/* ── Input Mật khẩu với animation ─────────────────── */}
                        <Animated.View
                            style={[
                                styles.inputWrapper,
                                isLandscape && styles.inputWrapperLandscape,
                                {
                                    borderColor: passwordBorderColor,
                                    backgroundColor: passwordBackgroundColor,
                                },
                            ]}
                        >
                            <TextInput
                                style={[styles.inputInner, isLandscape && styles.inputInnerLandscape]}
                                placeholder="Mật khẩu"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholderTextColor={!isDark ? '#000000' : colors.textSecondary}
                            />
                        </Animated.View>

                        {error !== null && (
                            <Text style={styles.errorText}>{error}</Text>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.loginButton,
                                isLandscape && styles.loginButtonLandscape,
                                isLoading && styles.loginButtonDisabled,
                            ]}
                            onPress={handlePressLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={colors.buttonSecondaryText} />
                            ) : (
                                <Text style={styles.loginButtonText}>Đăng nhập</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};
