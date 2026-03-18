import React, { useState } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLoginViewModel } from './useLoginViewModel';
import { styles } from './styles';

export const LoginScreen = () => {
    const {
        username, // Lưu ý: Trong code cũ của bạn không thấy dùng biến này cho input, tôi giữ nguyên
        setUsername,
        password,
        setPassword,
        handleLogin,
        handleRegister,
    } = useLoginViewModel();

    const [nameInput, setNameInput] = useState("");
    const [name, setName] = useState("");

    const handlePressLogin = () => {
        setName(nameInput);
        handleLogin();
    };

    return (
        /* LinearGradient đưa ra ngoài cùng để phủ màu toàn bộ màn hình */
        <LinearGradient
            colors={['#8B0000', '#FF4D4D']} // Dark red to light red
            style={styles.gradientContainer}
        >
            {/* SafeAreaView bọc nội dung để không bị lẹm vào tai thỏ/thanh trạng thái */}
            <SafeAreaView style={styles.safeArea}>
                {/* View này dùng để căn giữa các thẻ theo trục dọc */}
                <View style={styles.formContainer}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../../../assets/image/hust-logo.png')}
                            style={styles.logo}
                        />
                    </View>

                    <Text style={styles.description}>
                        Hệ thống đăng ký học tập tiện lợi
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Tài khoản"
                        value={nameInput}
                        onChangeText={setNameInput}
                        autoCapitalize="none"
                        placeholderTextColor="#666"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#666"
                    />

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handlePressLogin}
                    >
                        <Text style={styles.loginButtonText}>Đăng nhập</Text>
                    </TouchableOpacity>


                    {name ? (
                        <Text style={styles.welcomeText}>
                            Chào mừng: {name}
                        </Text>
                    ) : null}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};
