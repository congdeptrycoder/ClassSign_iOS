import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoginScreen } from '../screens/Login/LoginScreen';
import { StudentDashboardScreen } from '../screens/StudentDashboard/StudentDashboardScreen';
import { AdminDashboardScreen } from '../screens/AdminDashboard/AdminDashboardScreen';
import { AdminEditClassScreen } from '../screens/AdminEditClass/AdminEditClassScreen';
import { AdminCourseRegistrationDetailsScreen } from '../screens/AdminCourseRegistrationDetails/AdminCourseRegistrationDetailsScreen';
import { ClassInfo } from '../../interface-adapters/viewmodels/AdminDashboard/useAdminDashboardViewModel';
import { useTheme } from '../components/ThemeContext';
import { Account } from '../../domain/entities/Account';
import { CurriculumScreen } from '../screens/Curriculum/CurriculumScreen';

export const AppNavigator = () => {
    const { colors } = useTheme();
    const [currentScreen, setCurrentScreen] = useState<
        'Login' | 'StudentDashboard' | 'AdminDashboard' | 'AdminEditClass' | 'Curriculum' | 'AdminCourseRegistrationDetails'
    >('Login');
    const [editingClass, setEditingClass] = useState<ClassInfo | null>(null);
    const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
    const [detailsSemesterId, setDetailsSemesterId] = useState<number | null>(null);
    const [detailsSemesterName, setDetailsSemesterName] = useState<string | undefined>(undefined);

    const handleLoginSuccess = (account: Account) => {
        setCurrentAccount(account);
        if (account.role === 'admin') {
            setCurrentScreen('AdminDashboard');
            return;
        }
        setCurrentScreen('StudentDashboard');
    };

    const handleLogout = () => {
        setEditingClass(null);
        setCurrentAccount(null);
        setDetailsSemesterId(null);
        setDetailsSemesterName(undefined);
        setCurrentScreen('Login');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {currentScreen === 'Login' && (
                <LoginScreen onLoginSuccess={handleLoginSuccess} />
            )}
            {currentScreen === 'StudentDashboard' && (
                <StudentDashboardScreen
                    account={currentAccount}
                    onLogout={handleLogout}
                    onViewCurriculum={() => setCurrentScreen('Curriculum')}
                />
            )}
            {currentScreen === 'Curriculum' && (
                <CurriculumScreen
                    account={currentAccount}
                    onGoBack={() => setCurrentScreen('StudentDashboard')}
                />
            )}
            {currentScreen === 'AdminDashboard' && (
                <AdminDashboardScreen
                    onLogout={handleLogout}
                    onNavigateToEdit={item => {
                        setEditingClass(item);
                        setCurrentScreen('AdminEditClass');
                    }}
                    onNavigateToDetails={(semesterId, semesterName) => {
                        setDetailsSemesterId(semesterId);
                        setDetailsSemesterName(semesterName);
                        setCurrentScreen('AdminCourseRegistrationDetails');
                    }}
                />
            )}
            {currentScreen === 'AdminEditClass' && (
                <AdminEditClassScreen
                    onGoBack={() => setCurrentScreen('AdminDashboard')}
                    initialData={editingClass ?? undefined}
                />
            )}
            {currentScreen === 'AdminCourseRegistrationDetails' && detailsSemesterId !== null && (
                <AdminCourseRegistrationDetailsScreen
                    semester={detailsSemesterId}
                    semesterName={detailsSemesterName}
                    onGoBack={() => setCurrentScreen('AdminDashboard')}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
