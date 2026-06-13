import React, { useState } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { LoginScreen } from '../screens/Login/LoginScreen';
import { StudentDashboardScreen } from '../screens/StudentDashboard/StudentDashboardScreen';
import { AdminDashboardScreen } from '../screens/AdminDashboard/AdminDashboardScreen';
import { AdminClassFormScreen } from '../screens/AdminClassForm/AdminClassFormScreen';
import { AdminCourseRegistrationDetailsScreen } from '../screens/AdminCourseRegistrationDetails/AdminCourseRegistrationDetailsScreen';
import {
    AdminClassFormData,
} from '../../interface-adapters/viewmodels/AdminClassForm/useAdminClassFormViewModel';
import { useTheme } from '../components/ThemeContext';
import { Account } from '../../domain/entities/Account';
import { CurriculumScreen } from '../screens/Curriculum/CurriculumScreen';

export const AppNavigator = () => {
    const { colors } = useTheme();
    const [currentScreen, setCurrentScreen] = useState<
        'Login' | 'StudentDashboard' | 'AdminDashboard' | 'AdminClassForm' | 'Curriculum' | 'AdminCourseRegistrationDetails'
    >('Login');
    const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
    const [detailsSemesterId, setDetailsSemesterId] = useState<number | null>(null);
    const [detailsSemesterName, setDetailsSemesterName] = useState<string | undefined>(undefined);

    // Dữ liệu truyền vào AdminClassFormScreen (cả create lẫn edit)
    const [classFormData, setClassFormData] = useState<AdminClassFormData | null>(null);
    // Màn hình sẽ quay về sau khi rời AdminClassForm
    const [classFormOrigin, setClassFormOrigin] = useState<'AdminDashboard' | 'AdminCourseRegistrationDetails'>('AdminDashboard');

    const handleLoginSuccess = (account: Account) => {
        setCurrentAccount(account);
        if (account.role === 'admin') {
            setCurrentScreen('AdminDashboard');
            return;
        }
        setCurrentScreen('StudentDashboard');
    };

    const handleLogout = () => {
        Keyboard.dismiss();
        setCurrentAccount(null);
        setDetailsSemesterId(null);
        setDetailsSemesterName(undefined);
        setClassFormData(null);
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
                    onGoBack={() => {
                        Keyboard.dismiss();
                        setCurrentScreen('StudentDashboard');
                    }}
                />
            )}

            {/* AdminDashboard: dùng display thay vì && để tránh unmount/remount gây mất image */}
            <View style={[styles.screenWrapper, { display: currentScreen === 'AdminDashboard' ? 'flex' : 'none' }]}>
                <AdminDashboardScreen
                    account={currentAccount}
                    onLogout={handleLogout}
                    isVisible={currentScreen === 'AdminDashboard'}
                    onNavigateToEdit={item => {
                        Keyboard.dismiss();
                        setClassFormData({
                            mode: 'edit',
                            id: (item as any).id,
                            ky: (item as any).ky ?? '',
                            khoa_truong: item.khoa_truong,
                            ma_hp: item.ma_hp,
                            ten_hp: item.ten_hp,
                            ma_lop: item.ma_lop,
                            ma_lop_kem: item.ma_lop_kem,
                            ghi_chu: item.ghi_chu,
                            thu: item.thu,
                            tiet_bd: item.tiet_bd,
                            tiet_kt: item.tiet_kt,
                            buoi: item.buoi,
                            phong_hoc: item.phong_hoc,
                            can_tn: item.can_tn,
                            sl_max: item.sl_max,
                            teaching_type: item.teaching_type,
                        });
                        setClassFormOrigin('AdminDashboard');
                        setCurrentScreen('AdminClassForm');
                    }}
                    onNavigateToDetails={(semesterId, semesterName) => {
                        Keyboard.dismiss();
                        setDetailsSemesterId(semesterId);
                        setDetailsSemesterName(semesterName);
                        setCurrentScreen('AdminCourseRegistrationDetails');
                    }}
                />
            </View>

            {/* AdminClassForm: gộp create + edit, dùng && vì cần formData mới mỗi lần */}
            {currentScreen === 'AdminClassForm' && classFormData && (
                <AdminClassFormScreen
                    formData={classFormData}
                    onGoBack={() => {
                        Keyboard.dismiss();
                        setCurrentScreen(classFormOrigin);
                    }}
                />
            )}

            {/* AdminCourseRegistrationDetails: dùng display để tránh remount khi quay lại từ form */}
            {detailsSemesterId !== null && (
                <View style={[styles.screenWrapper, { display: currentScreen === 'AdminCourseRegistrationDetails' ? 'flex' : 'none' }]}>
                    <AdminCourseRegistrationDetailsScreen
                        semester={detailsSemesterId}
                        semesterName={detailsSemesterName}
                        isVisible={currentScreen === 'AdminCourseRegistrationDetails'}
                        onGoBack={() => {
                            Keyboard.dismiss();
                            setCurrentScreen('AdminDashboard');
                        }}
                        onNavigateToCreateClass={(ky, truongKhoa, maHp, tenHp) => {
                            Keyboard.dismiss();
                            setClassFormData({
                                mode: 'create',
                                ky,
                                truong_khoa: truongKhoa,
                                ma_hp: maHp,
                                ten_hp: tenHp,
                            });
                            setClassFormOrigin('AdminCourseRegistrationDetails');
                            setCurrentScreen('AdminClassForm');
                        }}
                        onNavigateToEditClass={(classData) => {
                            Keyboard.dismiss();
                            setClassFormData({
                                mode: 'edit',
                                id: (classData as any).id,
                                ky: (classData as any).ky ?? '',
                                khoa_truong: (classData as any).khoa_truong ?? '',
                                ma_hp: (classData as any).ma_hp ?? '',
                                ten_hp: (classData as any).ten_hp ?? '',
                                ma_lop: (classData as any).ma_lop ?? '',
                                ma_lop_kem: (classData as any).ma_lop_kem ?? '',
                                ghi_chu: (classData as any).ghi_chu ?? '',
                                thu: (classData as any).thu ?? '',
                                tiet_bd: (classData as any).tiet_bd ?? '',
                                tiet_kt: (classData as any).tiet_kt ?? '',
                                buoi: (classData as any).buoi ?? '',
                                phong_hoc: (classData as any).phong_hoc ?? '',
                                can_tn: (classData as any).can_tn ?? '',
                                sl_max: (classData as any).sl_max ?? '',
                                teaching_type: (classData as any).teaching_type ?? '',
                            });
                            setClassFormOrigin('AdminCourseRegistrationDetails');
                            setCurrentScreen('AdminClassForm');
                        }}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    screenWrapper: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});
