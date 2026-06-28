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
import { TimeEvent } from '../../../shared/utils/timetableUtils';
import { useRegistrationPeriodViewModel } from '../../../interface-adapters/viewmodels/StudentDashboard/useRegistrationPeriodViewModel';
import { useTimetableViewModel } from '../../../interface-adapters/viewmodels/StudentDashboard/useTimetableViewModel';
import { useCourseRegistrationViewModel, RegisteredSubjectData } from '../../../interface-adapters/viewmodels/StudentDashboard/useCourseRegistrationViewModel';
import { useClassRegistrationViewModel } from '../../../interface-adapters/viewmodels/StudentDashboard/useClassRegistrationViewModel';
import { AlarmOneChoose } from '../../components/alarm_one_choose';
import { AlarmTwoChoose } from '../../components/alarm_two_choose';
import { DashboardHeader } from '../../components/DashboardHeader/DashboardHeader';
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
    const studentId = account?.id ?? 1;

    // ViewModels (Observer Pattern)
    const { activePhase } = useRegistrationPeriodViewModel();
    const { registeredClasses, timeGridEvents } = useTimetableViewModel(studentId);

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [popupConfig, setPopupConfig] = React.useState<{ visible: boolean; message: string; buttonText: string } | null>(null);
    const closePopup = () => setPopupConfig(null);

    const {
        searchQueryCourse: searchQuery,
        setSearchQueryCourse: setSearchQuery,
        isSuggestionVisibleCourse: isSuggestionVisible,
        setIsSuggestionVisibleCourse: setIsSuggestionVisible,
        isSearchingCourse: isSearching,
        searchErrorCourse: searchError,
        suggestionsCourse: allowedSuggestions,
        handleSelectSuggestionCourse: handleSelectSuggestion,
        handleRegisterCourse: handleRegisterSubject,
        registeredSubjects,
        studentStatus,
        deletePopupConfig,
        handleRequestDeleteCourse,
        handleConfirmDeleteCourse,
        closeDeletePopup,
        totalCredits,
    } = useCourseRegistrationViewModel(
        account || new Account(studentId, '', '', 'student'), 
        activePhase?.type,
        setIsSubmitting,
        setPopupConfig
    );

    const {
        expandedCourseIds,
        courseClassesData,
        isLoadingClasses,
        toggleCourseExpansion,
        handleRegisterClassSection,
        handleCancelClassSection,
    } = useClassRegistrationViewModel(studentId, setIsSubmitting);

    const [isUserInfoVisible, setIsUserInfoVisible] = React.useState(false);
    const toggleUserInfo = () => setIsUserInfoVisible(current => !current);

    const handleLogout = () => {
        setIsUserInfoVisible(false);
        onLogout();
    };

    const handleViewCurriculum = () => {
        onViewCurriculum?.();
    };

    const currentSemesterName = registeredSubjects.length > 0 ? registeredSubjects[0].semester : null;

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
    const getRegistrationStatusStyle = (rawStatus: string) => {
        if (rawStatus === 'registered' || rawStatus === 're_registered') {
            return styles.statusRegistered;   // 🔵 xanh dương
        }
        if (rawStatus === 'completed') {
            return styles.statusCompleted;    // 🟢 xanh lá
        }
        if (rawStatus === 'cancelled') {
            return styles.statusAvailable;    // 🟠 cam
        }
        return styles.statusAvailable;        // fallback
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <DashboardHeader
                    titleLabel={studentLabel}
                    isProfileOpen={isUserInfoVisible}
                    toggleProfile={toggleUserInfo}
                    onLogout={handleLogout}
                />

                <ScrollView
                    style={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.phasePanel}>
                        <Text style={styles.phaseKicker}>Hệ thống đăng ký học tập</Text>
                        <View style={styles.phaseTitleRow}>
                            <View>
                                <Text style={styles.phaseTitle} testID="what-time-is-it">
                                    {phaseMessage}
                                </Text>
                                {currentSemesterName ? (
                                    <Text style={styles.phaseSubtitle}>
                                        Học kỳ: {currentSemesterName}
                                    </Text>
                                ) : null}
                            </View>
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
                            {activePhase.type === 'course' && (
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
                                            {!isSearching && !searchError && allowedSuggestions.length > 0 && (
                                                <ScrollView
                                                    nestedScrollEnabled={true}
                                                    keyboardShouldPersistTaps="handled"
                                                    showsVerticalScrollIndicator={false}
                                                >
                                                    {allowedSuggestions.map((item, index) => (
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
                                                            {'prerequisiteCode' in item && !item.canRegister && item.prerequisiteCode && (
                                                                <Text style={[styles.suggestionStatus, { backgroundColor: colors.surface, color: colors.statusDanger }]}>
                                                                    Cần học {item.prerequisiteCode}-{item.prerequisiteName} trước
                                                                </Text>
                                                            )}
                                                            {'parallelCode' in item && item.parallelCode && (
                                                                (item.parallelCourseRawStatus === 'completed' || item.parallelCourseRawStatus === 're_registered') ? (
                                                                    <Text style={[styles.suggestionStatus, styles.statusCompleted]}>
                                                                        Đã hoàn thành học phần song hành {item.parallelCode}-{item.parallelName}
                                                                    </Text>
                                                                ) : (
                                                                    <Text style={[styles.suggestionStatus, { backgroundColor: colors.surface, color: colors.statusWarning }]}>
                                                                        Học phần song hành {item.parallelCode}-{item.parallelName}
                                                                    </Text>
                                                                )
                                                            )}
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            )}
                                        </View>
                                    )}
                                </View>
                            )}

                            <View style={styles.tableContainer} testID="registration-table">
                                <Text style={styles.sectionTitle}>
                                    Bảng thông tin đăng ký{currentSemesterName ? ` — ${currentSemesterName}` : ''}
                                </Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={styles.table}>
                                        <View style={styles.tableHeader}>
                                            {activePhase?.type === 'class' && <Text style={[styles.headerCell, styles.cellExpand]}>DS lớp</Text>}
                                            <Text style={[styles.headerCell, styles.cellCode]}>Mã HP</Text>
                                            <Text style={[styles.headerCell, styles.cellName]}>Tên học phần</Text>
                                            <Text style={[styles.headerCell, styles.cellStatus]}>TT đăng ký</Text>
                                            <Text style={[styles.headerCell, styles.cellCredits]}>Số TC</Text>
                                            {activePhase?.type === 'course' && <Text style={[styles.headerCell, styles.cellAction]}>Thao tác</Text>}
                                        </View>
                                        {registeredSubjects.map((item: RegisteredSubjectData) => (
                                            <View key={item.id}>
                                                <View style={[styles.tableRow, expandedCourseIds.has(item.courseId) && styles.expandedRow]}>
                                                    {activePhase?.type === 'class' && (
                                                        <TouchableOpacity style={[styles.cell, styles.cellExpand]} onPress={() => toggleCourseExpansion(item.courseId)}>
                                                            <Text style={{ fontSize: 12 }}>{expandedCourseIds.has(item.courseId) ? '▼' : '▶'}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <Text style={[styles.cell, styles.cellCode, styles.courseCodeText]}>{item.code}</Text>
                                                    <Text style={[styles.cell, styles.cellName]}>{item.name}</Text>
                                                    <View style={[styles.cellStatus, styles.tableStatusCell]}>
                                                        <Text style={[
                                                            styles.tableStatusText,
                                                            getRegistrationStatusStyle(item.rawStatus),
                                                        ]}>
                                                            {item.status}
                                                        </Text>
                                                    </View>
                                                    <Text style={[styles.cell, styles.cellCredits]}>{item.credits}</Text>
                                                    {activePhase?.type === 'course' && (
                                                        <TouchableOpacity style={[styles.cell, styles.cellAction]} onPress={() => handleRequestDeleteCourse(item)}>
                                                            <Text style={{ color: 'red' }}>Xoá</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                                {expandedCourseIds.has(item.courseId) && (
                                                    <View style={styles.subTableContainer}>
                                                        <Text style={styles.subTableTitle}>Danh sách lớp học phần</Text>
                                                        {isLoadingClasses[item.courseId] ? (
                                                            <Text style={{ padding: 10 }}>Đang tải...</Text>
                                                        ) : (
                                                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                                <View style={styles.subTable}>
                                                                    <View style={styles.tableHeader}>
                                                                        <Text style={[styles.headerCell, styles.subCellCol, { width: 80 }]}>Mã Lớp</Text>
                                                                        <Text style={[styles.headerCell, styles.subCellCol, { width: 80 }]}>Lớp kèm</Text>
                                                                        <Text style={[styles.headerCell, styles.subCellCol, { width: 40 }]}>Thứ</Text>
                                                                        <Text style={[styles.headerCell, styles.subCellCol, { width: 60 }]}>Buổi</Text>
                                                                        <Text style={[styles.headerCell, styles.subCellCol, { width: 50 }]}>Tiết bd</Text>
                                                                        <Text style={[styles.headerCell, styles.subCellCol, { width: 50 }]}>Tiết kt</Text>
                                                                        <Text style={[styles.headerCell, styles.subCellCol, { width: 80 }]}>Phòng</Text>
                                                                        <Text style={[styles.headerCell, styles.subCellCol, { width: 60 }]}>Cần TN</Text>
                                                                        <Text style={[styles.headerCell, styles.subCellCol, { width: 60 }]}>Số chỗ</Text>
                                                                        <Text style={[styles.headerCell, styles.subCellCol, { width: 100 }]}>Ghi chú</Text>
                                                                        {activePhase?.type === 'class' && <Text style={[styles.headerCell, styles.subCellCol, { width: 80 }]}>Hành động</Text>}
                                                                    </View>
                                                                    {courseClassesData[item.courseId]?.length > 0 ? (
                                                                        courseClassesData[item.courseId].map(cls => {
                                                                            let parsed: any = {};
                                                                            try { parsed = JSON.parse(cls.detail || '{}'); } catch { }
                                                                            const isBlocked = cls.occupiedSlots >= cls.totalSlots;
                                                                            const isRegistered = registeredClasses.some(rc => rc.classId === cls.id);
                                                                            const isAnyClassRegisteredForCourse = registeredClasses.some(rc => rc.code === item.code);

                                                                            return (
                                                                                <View key={cls.id} style={styles.tableRow}>
                                                                                    <Text style={[styles.cell, styles.subCellCol, { width: 80 }]}>{parsed.ma_lop || cls.id}</Text>
                                                                                    <Text style={[styles.cell, styles.subCellCol, { width: 80 }]}>{parsed.ma_lop_kem || ''}</Text>
                                                                                    <Text style={[styles.cell, styles.subCellCol, { width: 40 }]}>{parsed.thu || ''}</Text>
                                                                                    <Text style={[styles.cell, styles.subCellCol, { width: 60 }]}>{parsed.buoi || ''}</Text>
                                                                                    <Text style={[styles.cell, styles.subCellCol, { width: 50 }]}>{parsed.tiet_bd || ''}</Text>
                                                                                    <Text style={[styles.cell, styles.subCellCol, { width: 50 }]}>{parsed.tiet_kt || ''}</Text>
                                                                                    <Text style={[styles.cell, styles.subCellCol, { width: 80 }]}>{parsed.phong_hoc || ''}</Text>
                                                                                    <Text style={[styles.cell, styles.subCellCol, { width: 60 }]}>{parsed.can_tn || ''}</Text>
                                                                                    <View style={[styles.cell, styles.subCellCol, { width: 60 }]}>
                                                                                        <Text style={[styles.suggestionStatus, isBlocked ? styles.statusBlocked : styles.statusAvailable, { paddingVertical: 2, paddingHorizontal: 6, fontSize: 10, alignSelf: 'center', marginTop: 0 }]}>
                                                                                            {cls.occupiedSlots}/{cls.totalSlots}
                                                                                        </Text>
                                                                                    </View>
                                                                                    <Text style={[styles.cell, styles.subCellCol, { width: 100 }]}>{parsed.ghi_chu || ''}</Text>
                                                                                    {activePhase?.type === 'class' && (
                                                                                        <View style={[styles.cell, styles.subCellCol, { width: 80 }]}>
                                                                                            {isRegistered ? (
                                                                                                <TouchableOpacity
                                                                                                    style={[styles.outlineActionButton, { height: 26, paddingHorizontal: 8, paddingVertical: 0, justifyContent: 'center' }]}
                                                                                                    onPress={() => handleCancelClassSection(cls.id, item.code, item.courseId)}
                                                                                                    disabled={isSubmitting}
                                                                                                >
                                                                                                    <Text style={[styles.outlineActionButtonText, { fontSize: 11 }]}>Huỷ lớp</Text>
                                                                                                </TouchableOpacity>
                                                                                            ) : isAnyClassRegisteredForCourse ? null : (
                                                                                                <TouchableOpacity
                                                                                                    style={[styles.registerButton, { height: 26, paddingHorizontal: 8, borderRadius: 4 }, (isSubmitting || isBlocked) && styles.registerButtonDisabled]}
                                                                                                    onPress={() => handleRegisterClassSection(cls.id, item.code, item.courseId)}
                                                                                                    disabled={isSubmitting || isBlocked}
                                                                                                >
                                                                                                    <Text style={[styles.registerButtonText, { fontSize: 11, color: isBlocked ? colors.textSecondary : colors.surface }]}>
                                                                                                        {isBlocked ? 'Hết chỗ' : 'Đăng ký'}
                                                                                                    </Text>
                                                                                                </TouchableOpacity>
                                                                                            )}
                                                                                        </View>
                                                                                    )}
                                                                                </View>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <View style={styles.tableRow}>
                                                                            <Text style={[styles.cell, { flex: 1, textAlign: 'center' }]}>Không có lớp học phần nào đang mở cho học phần này</Text>
                                                                        </View>
                                                                    )}
                                                                </View>
                                                            </ScrollView>
                                                        )}
                                                    </View>
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                                <View style={{ marginTop: 16, paddingHorizontal: 4 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 4 }}>
                                        Tổng số TC: {totalCredits}
                                    </Text>
                                    <Text style={{ fontSize: 14, color: colors.statusDanger, fontStyle: 'italic' }}>
                                        {studentStatus === 'study' ? '* Bạn được đăng ký tối đa 24 TC' :
                                            studentStatus === 'study_cc1' ? '* Bạn đang bị cảnh cáo mức 1. Chỉ được đăng ký tối đa 20 TC' :
                                                studentStatus === 'study_cc2' ? '* Bạn đang bị cảnh cáo mức 2. Chỉ được đăng ký tối đa 16 TC' :
                                                    studentStatus === 'study_cc3' ? '* Bạn đang bị cảnh cáo mức 3. Chỉ được đăng ký tối đa 12 TC' : ''}
                                    </Text>
                                </View>
                            </View>

                            {activePhase.type === 'class' && (
                                <View style={styles.tableContainer} testID="timetable-table">
                                    <Text style={styles.sectionTitle}>Thời khóa biểu tạm thời</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View style={styles.timeGrid}>
                                            <View style={styles.gridRow}>
                                                <View style={styles.gridHeaderCornerSession} />
                                                <View style={styles.gridHeaderCornerPeriod} />
                                                {daysOfWeek.map(day => (
                                                    <View key={day} style={styles.gridHeaderCell}>
                                                        <Text style={styles.gridHeaderText}>{day}</Text>
                                                    </View>
                                                ))}
                                            </View>

                                            <View style={styles.gridRow}>
                                                <View style={styles.gridSessionCell}>
                                                    <Text style={[styles.gridSessionText, { transform: [{ rotate: '-90deg' }] }]}>Sáng</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
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
                                                </View>
                                            </View>

                                            <View style={styles.gridDivider}>
                                                <Text style={styles.gridDividerText}>Nghỉ trưa</Text>
                                            </View>

                                            <View style={styles.gridRow}>
                                                <View style={styles.gridSessionCell}>
                                                    <Text style={[styles.gridSessionText, { transform: [{ rotate: '-90deg' }] }]}>Chiều</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    {afternoonPeriods.map(period => {
                                                        const displayPeriod = period - 6;
                                                        return (
                                                            <View key={`a-${period}`} style={styles.gridRow}>
                                                                <View style={styles.gridPeriodCell}>
                                                                    <Text style={styles.gridPeriodText}>Tiết {displayPeriod}</Text>
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
                                                        );
                                                    })}
                                                </View>
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    )}

                    <View style={styles.bottomSpacer} />
                </ScrollView>

                {popupConfig && (
                    <AlarmOneChoose
                        visible={popupConfig.visible}
                        message={popupConfig.message}
                        buttonText={popupConfig.buttonText}
                        onClose={closePopup}
                    />
                )}

                {deletePopupConfig && (
                    <AlarmTwoChoose
                        visible={deletePopupConfig.visible}
                        message="Xác nhận xoá đăng ký học phần này"
                        cancelText="Huỷ"
                        confirmText="Xác nhận"
                        onCancel={closeDeletePopup}
                        onConfirm={handleConfirmDeleteCourse}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};
