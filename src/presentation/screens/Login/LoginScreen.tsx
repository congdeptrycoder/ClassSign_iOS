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
import { styles } from './styles';

type LoginScreenProps = {
    onLoginSuccess?: (role: string) => void;
};

export const LoginScreen = ({ onLoginSuccess }: LoginScreenProps) => {
    const { password, setPassword, handleLogin } = useLoginViewModel(onLoginSuccess);
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const [usernameInput, setUsernameInput] = useState('');

    const handlePressLogin = () => {
        handleLogin(usernameInput);
    };

    return (
        <LinearGradient
            colors={['#8B0000', '#FF4D4D']}
            style={styles.gradientContainer}
        >
            <SafeAreaView style={styles.safeArea}>
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
                            placeholderTextColor="#666"
                        />

                        <TextInput
                            style={[styles.input, isLandscape && styles.inputLandscape]}
                            placeholder="Mật khẩu"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#666"
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
