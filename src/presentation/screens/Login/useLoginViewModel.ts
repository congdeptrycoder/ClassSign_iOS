import { useState } from 'react';

export const useLoginViewModel = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Basic implementation for now
        console.log('Login attempt with:', { username, password });
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
