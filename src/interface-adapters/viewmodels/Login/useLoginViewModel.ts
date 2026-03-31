import { useState } from 'react';

export const useLoginViewModel = (onLoginSuccess?: (role: string) => void) => {
    const [password, setPassword] = useState('');

    const handleLogin = (currentUsername: string) => {
        if (currentUsername === 'admin' && password === '1') {
            onLoginSuccess?.('admin');
            return;
        }

        if (currentUsername === 'user' && password === '1') {
            onLoginSuccess?.('student');
            return;
        }

        console.log('Login attempt with:', {
            username: currentUsername,
            password,
        });
    };

    return {
        password,
        setPassword,
        handleLogin,
    };
};
