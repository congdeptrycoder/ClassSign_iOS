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
import { Account } from '../../../domain/entities/Account';
import {
    RegisteredSubject,
    TimeEvent,
    useStudentDashboardViewModel,
} from '../../../interface-adapters/viewmodels/StudentDashboard/useStudentDashboardViewModel';
import { useTheme } from '../../components/ThemeContext';
import { createStudentStyles } from './styles';

type StudentDashboardScreenProps = {
    onLogout: () => void;
    onViewCurriculum: () => void;
    account?: Account | null;
};

const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const morningPeriods = [1, 2, 3, 4, 5, 6];
const afternoonPeriods = [7, 8, 9, 10, 11, 12];

export const StudentDashboardScreen = ({
    onLogout,
    onViewCurriculum,
    account,
}: StudentDashboardScreenProps) => {
    const {
        isUserInfoVisible,
        toggleUserInfo,
        searchQuery,
        setSearchQuery,
        isSuggestionVisible,
        setIsSuggestionVisible,
        isSearching,
        searchError,
        handleRegisterSubject,
        handleViewCurriculum,
        handleLogout,
        registeredSubjects,
        timeGridEvents,
        activePhase,
        allowedSuggestions,
        handleSelectSuggestion,
        isSubmitting,
    } = useStudentDashboardViewModel(onLogout, account?.id ?? 1, onViewCurriculum);

    const { colors } = useTheme();
    const styles = createStudentStyles(colors);
    const studentLabel = `${account?.name ?? 'Sinh viên'} - ${account?.id_card ?? account?.username ?? account?.id ?? ''}`;

    const phaseMessage = !activePhase
        ? 'Không có lịch đăng ký'
        : activePhase.type === 'course'
            ? 'Đợt đăng ký học phần'
            : 'Đợt đăng ký lớp học';
    const phaseBadge = activePhase ? 'Đang mở' : 'Đã đóng';
    const searchLabel = activePhase?.type === 'class'
        ? 'Tìm lớp học phần'
        : 'Tìm học phần';

    const placeholder = activePhase?.type === 'class'
        ? 'Nhập mã hoặc tên lớp học phần'
        : 'Nhập mã hoặc tên học phần';
    const getRegistrationStatusStyle = (status: string) => {
        if (status.includes('Thành công') || status.includes('Đã đăng ký')) {
            return styles.statusRegistered;
        }
        if (status.includes('Đã học')) return styles.statusCompleted;
        return styles.statusAvailable;
    };

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
                        <Text style={styles.userInfoText}>{studentLabel}</Text>
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
                    <View style={styles.phasePanel}>
                        <Text style={styles.phaseKicker}>Hệ thống đăng ký học tập</Text>
                        <View style={styles.phaseTitleRow}>
                            <Text style={styles.phaseTitle} testID="what-time-is-it">
                                {phaseMessage}
                            </Text>
                            <Text style={[
                                styles.phaseBadge,
                                activePhase ? styles.phaseBadgeOpen : styles.phaseBadgeClosed,
                            ]}>
                                {phaseBadge}
                            </Text>
                        </View>
                    </View>

                    {!activePhase ? (
                        <View style={styles.noPhaseContainer} testID="no-phase-container">
                            <Text style={styles.noPhaseTitle}>Đang không có lịch đăng ký</Text>
                            <Text style={styles.noPhaseSubText}>
                                Vui lòng quay lại sau hoặc liên hệ Phòng đào tạo để biết thêm chi tiết.
                            </Text>
                            <TouchableOpacity
                                style={styles.outlineActionButton}
                                onPress={handleViewCurriculum}
                            >
                                <Text style={styles.outlineActionButtonText}>Xem CTĐT</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View testID="active-phase-container">
                            <View style={styles.registrationPanel}>
                                <View style={styles.panelHeader}>
                                    <View style={styles.panelTitleBlock}>
                                        <Text style={styles.panelTitle}>{searchLabel}</Text>
                                        <Text style={styles.panelSubtitle}>{studentLabel}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.outlineActionButton}
                                        onPress={handleViewCurriculum}
                                    >
                                        <Text style={styles.outlineActionButtonText}>Xem CTĐT</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.searchRow}>
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder={placeholder}
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        onFocus={() => setIsSuggestionVisible(true)}
                                        placeholderTextColor={colors.textSecondary}
                                        testID="subject-search-input"
                                    />

                                    <TouchableOpacity
                                        style={[
                                            styles.registerButton,
                                            isSubmitting && styles.registerButtonDisabled,
                                        ]}
                                        onPress={handleRegisterSubject}
                                        disabled={isSubmitting}
                                        testID="register-button"
                                    >
                                        <Text style={styles.registerButtonText}>
                                            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {isSuggestionVisible && (
                                    <View style={styles.suggestionsContainer} testID="suggestions-dropdown">
                                        {isSearching && (
                                            <Text style={styles.suggestionStateText}>Đang tìm...</Text>
                                        )}
                                        {!isSearching && searchError && (
                                            <Text style={styles.suggestionErrorText}>{searchError}</Text>
                                        )}
                                        {!isSearching && !searchError && allowedSuggestions.length === 0 && (
                                            <Text style={styles.suggestionStateText}>Không có gợi ý phù hợp</Text>
                                        )}
                                        {!isSearching && !searchError && allowedSuggestions.map((item, index) => (
                                            <TouchableOpacity
                                                key={`${item.code}-${index}`}
                                                style={styles.suggestionItem}
                                                onPress={() => handleSelectSuggestion(item)}
                                            >
                                                <View style={styles.suggestionMainRow}>
                                                    <Text style={styles.suggestionCode}>{item.code}</Text>
                                                    <Text style={styles.suggestionCredits}>{item.credits} TC</Text>
                                                </View>
                                                <Text style={styles.suggestionText}>{item.name}</Text>
                                                {'statusLabel' in item && (
                                                    <Text style={[
                                                        styles.suggestionStatus,
                                                        item.status === 'registered'
                                                            ? styles.statusRegistered
                                                            : item.status === 'completed'
                                                                ? styles.statusCompleted
                                                                : item.status === 'blocked'
                                                                    ? styles.statusBlocked
                                                                    : styles.statusAvailable,
                                                    ]}>
                                                        {item.statusLabel}
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            <View style={styles.tableContainer} testID="registration-table">
                                <Text style={styles.sectionTitle}>Bảng thông tin đăng ký</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={styles.table}>
                                        <View style={styles.tableHeader}>
                                            <Text style={[styles.headerCell, styles.cellId]}>ID</Text>
                                            <Text style={[styles.headerCell, styles.cellCode]}>Mã HP</Text>
                                            <Text style={[styles.headerCell, styles.cellName]}>Tên học phần</Text>
                                            <Text style={[styles.headerCell, styles.cellStatus]}>TT đăng ký</Text>
                                            <Text style={[styles.headerCell, styles.cellCredits]}>Số TC</Text>
                                        </View>
                                        {registeredSubjects.map((item: RegisteredSubject) => (
                                            <View key={item.id} style={styles.tableRow}>
                                                <Text style={[styles.cell, styles.cellId]}>{item.id}</Text>
                                                <Text style={[styles.cell, styles.cellCode, styles.courseCodeText]}>{item.code}</Text>
                                                <Text style={[styles.cell, styles.cellName]}>{item.name}</Text>
                                                <View style={[styles.cellStatus, styles.tableStatusCell]}>
                                                    <Text style={[
                                                        styles.tableStatusText,
                                                        getRegistrationStatusStyle(item.status),
                                                    ]}>
                                                        {item.status}
                                                    </Text>
                                                </View>
                                                <Text style={[styles.cell, styles.cellCredits]}>{item.credits}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>

                            {activePhase.type === 'class' && (
                                <View style={styles.tableContainer} testID="timetable-table">
                                    <Text style={styles.sectionTitle}>Thời khóa biểu tạm thời</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View style={styles.timeGrid}>
                                            <View style={styles.gridRow}>
                                                <View style={styles.gridHeaderCorner} />
                                                {daysOfWeek.map(day => (
                                                    <View key={day} style={styles.gridHeaderCell}>
                                                        <Text style={styles.gridHeaderText}>{day}</Text>
                                                    </View>
                                                ))}
                                            </View>

                                            {morningPeriods.map(period => (
                                                <View key={`m-${period}`} style={styles.gridRow}>
                                                    <View style={styles.gridPeriodCell}>
                                                        <Text style={styles.gridPeriodText}>Tiết {period}</Text>
                                                    </View>
                                                    {daysOfWeek.map(day => {
                                                        const event = timeGridEvents.find(
                                                            (gridEvent: TimeEvent) =>
                                                                gridEvent.day === day &&
                                                                gridEvent.period === period
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

                                            {afternoonPeriods.map(period => (
                                                <View key={`a-${period}`} style={styles.gridRow}>
                                                    <View style={styles.gridPeriodCell}>
                                                        <Text style={styles.gridPeriodText}>Tiết {period}</Text>
                                                    </View>
                                                    {daysOfWeek.map(day => {
                                                        const event = timeGridEvents.find(
                                                            (gridEvent: TimeEvent) =>
                                                                gridEvent.day === day &&
                                                                gridEvent.period === period
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
                            )}
                        </View>
                    )}

                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};
