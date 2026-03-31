import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoginScreen } from '../screens/Login/LoginScreen';
import { StudentDashboardScreen } from '../screens/StudentDashboard/StudentDashboardScreen';
import { AdminDashboardScreen } from '../screens/AdminDashboard/AdminDashboardScreen';
import { AdminEditClassScreen } from '../screens/AdminEditClass/AdminEditClassScreen';
import { ClassInfo } from '../../interface-adapters/viewmodels/AdminDashboard/useAdminDashboardViewModel';

export const AppNavigator = () => {
    const [currentScreen, setCurrentScreen] = useState<
        'Login' | 'StudentDashboard' | 'AdminDashboard' | 'AdminEditClass'
    >('Login');
    const [editingClass, setEditingClass] = useState<ClassInfo | null>(null);

    const handleLoginSuccess = (role: string) => {
        if (role === 'admin') {
            setCurrentScreen('AdminDashboard');
            return;
        }
        setCurrentScreen('StudentDashboard');
    };

    const handleLogout = () => {
        setEditingClass(null);
        setCurrentScreen('Login');
    };

    return (
        <View style={styles.container}>
            {currentScreen === 'Login' && (
                <LoginScreen onLoginSuccess={handleLoginSuccess} />
            )}
            {currentScreen === 'StudentDashboard' && (
                <StudentDashboardScreen onLogout={handleLogout} />
            )}
            {currentScreen === 'AdminDashboard' && (
                <AdminDashboardScreen
                    onLogout={handleLogout}
                    onNavigateToEdit={item => {
                        setEditingClass(item);
                        setCurrentScreen('AdminEditClass');
                    }}
                />
            )}
            {currentScreen === 'AdminEditClass' && (
                <AdminEditClassScreen
                    onGoBack={() => setCurrentScreen('AdminDashboard')}
                    initialData={editingClass ?? undefined}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
