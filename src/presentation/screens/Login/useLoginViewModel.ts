import { useState } from 'react';

export const useLoginViewModel = (onLoginSuccess?: () => void) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (currentUsername: string) => {
        // Basic hardcoded check
        if (currentUsername === 'user' && password === '1') {
            onLoginSuccess?.();
            return;
        }
        console.log('Login attempt with:', { username: currentUsername, password });
    };

    const handleRegister = () => {
        // Basic implementation for now
        console.log('Register attempt with:', { username, password });
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        handleLogin,
        handleRegister,
    };
};
