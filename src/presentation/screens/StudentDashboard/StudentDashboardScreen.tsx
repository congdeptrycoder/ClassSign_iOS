import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    RegisteredSubject,
    TimeEvent,
    useStudentDashboardViewModel,
} from '../../../interface-adapters/viewmodels/StudentDashboard/useStudentDashboardViewModel';
import { styles } from './styles';

type StudentDashboardScreenProps = {
    onLogout: () => void;
};

const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const morningPeriods = [1, 2, 3, 4, 5, 6];
const afternoonPeriods = [7, 8, 9, 10, 11, 12];

export const StudentDashboardScreen = ({
    onLogout,
}: StudentDashboardScreenProps) => {
    const {
        isUserInfoVisible,
        toggleUserInfo,
        searchQuery,
        setSearchQuery,
        handleRegisterSubject,
        handleViewCurriculum,
        handleLogout,
        registeredSubjects,
        timeGridEvents,
    } = useStudentDashboardViewModel(onLogout);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.navBarHeader} testID="nav-bar-header">
                    <Image
                            source={require('../../../../assets/image/hust-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <TouchableOpacity onPress={toggleUserInfo}>
                        <Image
                                source={require('../../../../assets/image/hust-logo.png')}
                            style={styles.avatar}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                {isUserInfoVisible && (
                    <View style={styles.userInfoBox}>
                        <Text style={styles.userInfoText}>
                            Phan Chí Công - 20231566
                        </Text>
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <ScrollView
                    style={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.whatTimeIsIt} testID="what-time-is-it">
                        Đây đang là giai đoạn đăng ký học phần TEST
                    </Text>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleViewCurriculum}
                    >
                        <Text style={styles.actionButtonText}>
                            Xem Chương Trình Đào Tạo
                        </Text>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.searchInput}
                        placeholder="Nhập mã/tên học phần"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#999"
                    />

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={handleRegisterSubject}
                    >
                        <Text style={styles.registerButtonText}>Đăng ký</Text>
                    </TouchableOpacity>

                    <View style={styles.tableContainer}>
                        <Text style={styles.sectionTitle}>
                            Bảng Thông tin đăng ký
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.table}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.headerCell, styles.cellId]}>ID</Text>
                                    <Text style={[styles.headerCell, styles.cellCode]}>
                                        Mã HP
                                    </Text>
                                    <Text style={[styles.headerCell, styles.cellName]}>
                                        Tên học phần
                                    </Text>
                                    <Text style={[styles.headerCell, styles.cellStatus]}>
                                        TT Đăng ký
                                    </Text>
                                    <Text style={[styles.headerCell, styles.cellCredits]}>
                                        Số TC
                                    </Text>
                                </View>
                                {registeredSubjects.map(
                                    (item: RegisteredSubject, index: number) => (
                                        <View key={index} style={styles.tableRow}>
                                            <Text style={[styles.cell, styles.cellId]}>
                                                {item.id}
                                            </Text>
                                            <Text style={[styles.cell, styles.cellCode]}>
                                                {item.code}
                                            </Text>
                                            <Text style={[styles.cell, styles.cellName]}>
                                                {item.name}
                                            </Text>
                                            <Text style={[styles.cell, styles.cellStatus]}>
                                                {item.status}
                                            </Text>
                                            <Text style={[styles.cell, styles.cellCredits]}>
                                                {item.credits}
                                            </Text>
                                        </View>
                                    ),
                                )}
                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.tableContainer}>
                        <Text style={styles.sectionTitle}>
                            Thời khóa biểu tạm thời
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.timeGrid}>
                                <View style={styles.gridRow}>
                                    <View style={styles.gridHeaderCorner} />
                                    {daysOfWeek.map((day: string) => (
                                        <View key={day} style={styles.gridHeaderCell}>
                                            <Text style={styles.gridHeaderText}>{day}</Text>
                                        </View>
                                    ))}
                                </View>

                                {morningPeriods.map((period: number) => (
                                    <View key={`m-${period}`} style={styles.gridRow}>
                                        <View style={styles.gridPeriodCell}>
                                            <Text style={styles.gridPeriodText}>
                                                Tiết {period}
                                            </Text>
                                        </View>
                                        {daysOfWeek.map((day: string) => {
                                            const event = timeGridEvents.find(
                                                (gridEvent: TimeEvent) =>
                                                    gridEvent.day === day &&
                                                    gridEvent.period === period,
                                            );

                                            return (
                                                <View
                                                    key={`${day}-${period}`}
                                                    style={[
                                                        styles.gridCell,
                                                        event && styles.gridCellActive,
                                                    ]}
                                                >
                                                    {event && (
                                                        <Text style={styles.gridEventText}>
                                                            {event.name}
                                                        </Text>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </View>
                                ))}

                                <View style={styles.gridDivider}>
                                    <Text style={styles.gridDividerText}>Nghỉ trưa</Text>
                                </View>

                                {afternoonPeriods.map((period: number) => (
                                    <View key={`a-${period}`} style={styles.gridRow}>
                                        <View style={styles.gridPeriodCell}>
                                            <Text style={styles.gridPeriodText}>
                                                Tiết {period}
                                            </Text>
                                        </View>
                                        {daysOfWeek.map((day: string) => {
                                            const event = timeGridEvents.find(
                                                (gridEvent: TimeEvent) =>
                                                    gridEvent.day === day &&
                                                    gridEvent.period === period,
                                            );

                                            return (
                                                <View
                                                    key={`${day}-${period}`}
                                                    style={[
                                                        styles.gridCell,
                                                        event && styles.gridCellActive,
                                                    ]}
                                                >
                                                    {event && (
                                                        <Text style={styles.gridEventText}>
                                                            {event.name}
                                                        </Text>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};
