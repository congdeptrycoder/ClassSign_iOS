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
import { useLoginViewModel } from './useLoginViewModel';
import { styles } from './styles';

export const LoginScreen = () => {
    const { password, setPassword, handleLogin } = useLoginViewModel();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const [nameInput, setNameInput] = useState('');
    const [name, setName] = useState('');

    const handlePressLogin = () => {
        setName(nameInput);
        handleLogin();
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
                            He thong dang ky hoc tap tien loi
                        </Text>

                        <TextInput
                            style={[styles.input, isLandscape && styles.inputLandscape]}
                            placeholder="Tai khoan"
                            value={nameInput}
                            onChangeText={setNameInput}
                            autoCapitalize="none"
                            placeholderTextColor="#666"
                        />

                        <TextInput
                            style={[styles.input, isLandscape && styles.inputLandscape]}
                            placeholder="Mat khau"
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
                            <Text style={styles.loginButtonText}>Dang nhap</Text>
                        </TouchableOpacity>

                        {name ? <Text style={styles.welcomeText}>Chao mung: {name}</Text> : null}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};
