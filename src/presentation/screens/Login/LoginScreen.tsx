import React, { useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLoginViewModel } from '../../../interface-adapters/viewmodels/Login/useLoginViewModel';
import { useTheme } from '../../components/ThemeContext';
import { createLoginStyles } from './styles';

type LoginScreenProps = {
    onLoginSuccess?: (role: string) => void;
};

export const LoginScreen = ({ onLoginSuccess }: LoginScreenProps) => {
    const { password, setPassword, handleLogin } = useLoginViewModel(onLoginSuccess);
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const { isDark, toggleTheme, colors } = useTheme();
    // Memo-ize styles dựa trên colors để tránh tạo lại không cần thiết
    const styles = createLoginStyles(colors);

    const [usernameInput, setUsernameInput] = useState('');

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
                    <Text style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</Text>
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

                        <TextInput
                            style={[styles.input, isLandscape && styles.inputLandscape]}
                            placeholder="Tài khoản"
                            value={usernameInput}
                            onChangeText={setUsernameInput}
                            autoCapitalize="none"
                            placeholderTextColor={colors.textSecondary}
                        />

                        <TextInput
                            style={[styles.input, isLandscape && styles.inputLandscape]}
                            placeholder="Mật khẩu"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor={colors.textSecondary}
                        />

                        <TouchableOpacity
                            style={[
                                styles.loginButton,
                                isLandscape && styles.loginButtonLandscape,
                            ]}
                            onPress={handlePressLogin}
                        >
                            <Text style={styles.loginButtonText}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};
