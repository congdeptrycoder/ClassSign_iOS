import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useLoginViewModel } from './useLoginViewModel';
import { styles } from './styles';

export const LoginScreen = () => {
    const {
        username,
        setUsername,
        password,
        setPassword,
        handleLogin,
        handleRegister,
    } = useLoginViewModel();
    const [nameInput, setNameInput] = useState("");
    const [name, setName] = useState("");
    const handlePressLogin = () => {
        setName(nameInput);   // cập nhật name khi nhấn button
        handleLogin();        // gọi login từ ViewModel
    };
    return (
        <View style={styles.container}>
            <Text style={{ color: 'blue', fontSize: 22, fontWeight: 'bold' }}>Click vào đăng nhập để cập nhật TÊN HIỂN THỊ </Text>
            <TextInput
                style={styles.input}
                placeholder="Tên đăng nhập"
                value={nameInput}
                onChangeText={setNameInput}

                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Text style={{ color: 'red', fontStyle: 'italic', fontWeight: 'bold' }}>TÊN HIỂN THỊ: {name}</Text>

            <Button title="Đăng nhập" onPress={handlePressLogin} />
            <View style={{ height: 10 }} />
            <Button title="Đăng ký" onPress={handleRegister} />
        </View>
    );
};
