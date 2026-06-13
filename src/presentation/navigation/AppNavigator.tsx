import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoginScreen } from '../screens/Login/LoginScreen';
import { StudentDashboardScreen } from '../screens/StudentDashboard/StudentDashboardScreen';
import { AdminDashboardScreen } from '../screens/AdminDashboard/AdminDashboardScreen';
import { AdminEditClassScreen } from '../screens/AdminEditClass/AdminEditClassScreen';
import { AdminCourseRegistrationDetailsScreen } from '../screens/AdminCourseRegistrationDetails/AdminCourseRegistrationDetailsScreen';
import { AdminCreateClassScreen } from '../screens/AdminCreateClass/AdminCreateClassScreen';
import { ClassInfo } from '../../interface-adapters/viewmodels/AdminDashboard/useAdminDashboardViewModel';
import { useTheme } from '../components/ThemeContext';
import { Account } from '../../domain/entities/Account';
import { CurriculumScreen } from '../screens/Curriculum/CurriculumScreen';

export const AppNavigator = () => {
    const { colors } = useTheme();
    const [currentScreen, setCurrentScreen] = useState<
        'Login' | 'StudentDashboard' | 'AdminDashboard' | 'AdminEditClass' | 'Curriculum' | 'AdminCourseRegistrationDetails' | 'AdminCreateClass'
    >('Login');
    const [editingClass, setEditingClass] = useState<any | null>(null);
    const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
    const [detailsSemesterId, setDetailsSemesterId] = useState<number | null>(null);
    const [detailsSemesterName, setDetailsSemesterName] = useState<string | undefined>(undefined);
    const [createClassData, setCreateClassData] = useState<{ ky: string; truong_khoa: string; ma_hp: string; ten_hp: string } | null>(null);

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
        setCreateClassData(null);
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
                    onGoBack={() => setCurrentScreen('AdminCourseRegistrationDetails')}
                    initialData={editingClass ?? undefined}
                />
            )}
            {currentScreen === 'AdminCourseRegistrationDetails' && detailsSemesterId !== null && (
                <AdminCourseRegistrationDetailsScreen
                    semester={detailsSemesterId}
                    semesterName={detailsSemesterName}
                    onGoBack={() => setCurrentScreen('AdminDashboard')}
                    onNavigateToCreateClass={(ky, truongKhoa, maHp, tenHp) => {
                        setCreateClassData({ ky, truong_khoa: truongKhoa, ma_hp: maHp, ten_hp: tenHp });
                        setCurrentScreen('AdminCreateClass');
                    }}
                    onNavigateToEditClass={(classData) => {
                        setEditingClass(classData);
                        setCurrentScreen('AdminEditClass');
                    }}
                />
            )}
            {currentScreen === 'AdminCreateClass' && createClassData && (
                <AdminCreateClassScreen
                    onGoBack={() => setCurrentScreen('AdminCourseRegistrationDetails')}
                    initialData={createClassData}
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
