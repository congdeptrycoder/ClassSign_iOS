import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { GetActiveRegistrationPhase } from '../../../application/use-cases/GetActiveRegistrationPhase';
import { RegistrationPhase } from '../../../domain/entities/RegistrationPhase';
import {
    ClassSuggestion,
    CurriculumCourse,
    TimetableEntry,
} from '../../../domain/entities/StudentRegistration';
import {
    courseRegistrationController,
    classRegistrationController,
    timetableController,
    registrationPhaseRepository,
} from '../../../di/student.di';
import { StudentStatusStrategyFactory } from '../../../domain/strategies/StudentStatusStrategyFactory';
import { FrontendEventBus, FRONTEND_EVENTS } from '../../../shared/utils/EventBus';
import { logMessage } from '../../../shared/utils/logger';
import { toStatusLabel } from '../../../shared/utils/statusLabelUtils';
import { parseTimetableEvents, TimeEvent } from '../../../shared/utils/timetableUtils';

export interface RegisteredSubject {
    id: string;
    courseId: number;
    semester: string;
    rawStatus: string;      // Giá trị gốc từ DB: 'registered' | 're_registered' | 'completed' | 'cancelled'
    code: string;
    name: string;
    status: string;         // Đã dịch sang tiếng Việt để hiển thị
    credits: number;
}

export type { TimeEvent };

type Suggestion = CurriculumCourse | ClassSuggestion;

export const useStudentDashboardViewModel = (
    onLogout: () => void,
    studentId = 1,
    onViewCurriculum?: () => void
) => {
    const [isUserInfoVisible, setIsUserInfoVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activePhase, setActivePhase] = useState<RegistrationPhase | null>(null);
    const [registeredSubjects, setRegisteredSubjects] = useState<RegisteredSubject[]>([]);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [curriculumCourses, setCurriculumCourses] = useState<CurriculumCourse[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
    const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [registeredClasses, setRegisteredClasses] = useState<TimetableEntry[]>([]);
    const [timeGridEvents, setTimeGridEvents] = useState<TimeEvent[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [popupConfig, setPopupConfig] = useState<{ visible: boolean; message: string; buttonText: string } | null>(null);
    const [currentSemesterName, setCurrentSemesterName] = useState<string | null>(null);
    const [studentStatus, setStudentStatus] = useState<string>('study');

    const [expandedCourseIds, setExpandedCourseIds] = useState<Set<number>>(new Set());
    const [courseClassesData, setCourseClassesData] = useState<Record<number, ClassSuggestion[]>>({});
    const [isLoadingClasses, setIsLoadingClasses] = useState<Record<number, boolean>>({});

    const [deletePopupConfig, setDeletePopupConfig] = useState<{ visible: boolean; subject: RegisteredSubject | null } | null>(null);

    const closePopup = () => setPopupConfig(null);
    const closeDeletePopup = () => setDeletePopupConfig(null);

    const handleRequestDeleteCourse = (subject: RegisteredSubject) => {
        setDeletePopupConfig({ visible: true, subject });
    };

    const handleConfirmDeleteCourse = async () => {
        if (!deletePopupConfig?.subject) return;
        const { courseId, semester } = deletePopupConfig.subject;
        try {
            await courseRegistrationController.cancelCourseRegistration(studentId, courseId, semester);
            setDeletePopupConfig(null);
            FrontendEventBus.emit(FRONTEND_EVENTS.TIMETABLE_CHANGED);
        } catch (error: any) {
            Alert.alert('Cảnh báo', error.message || 'Xoá đăng ký thất bại.');
        }
    };

    const reloadStudentData = async () => {
        const [response, timetable, curriculum] = await Promise.all([
            courseRegistrationController.getRegisteredCourses(studentId),
            timetableController.getTimetable(studentId),
            courseRegistrationController.getCurriculum(studentId),
        ]);

        const registeredCourses = response.courses;
        setCurrentSemesterName(response.semesterName);
        if (response.studentStatus) {
            setStudentStatus(response.studentStatus);
        }

        setRegisteredSubjects(
            registeredCourses.map(course => ({
                id: String(course.id),
                courseId: course.courseId,
                semester: course.semester,
                rawStatus: course.status,
                code: course.code,
                name: course.name,
                credits: course.credits,
                status: toStatusLabel(course.status),
            }))
        );
        setRegisteredClasses(timetable);
        setTimeGridEvents(parseTimetableEvents(timetable));
        setCurriculumCourses(curriculum.courses);
    };

    useEffect(() => {
        /**
         * Sử dụng registrationPhaseRepository từ student.di.ts thay vì import
         * RegistrationPhaseRepositoryImpl trực tiếp từ infrastructure — tuân thủ DIP.
         */
        const getActivePhaseUseCase = new GetActiveRegistrationPhase();
        const unsubscribe = registrationPhaseRepository.subscribe(phases => {
            setActivePhase(getActivePhaseUseCase.execute(phases));
        });
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        reloadStudentData().catch(error => {
            logMessage('ERROR', 'Không thể tải dữ liệu sinh viên', error);
        });

        // Đăng ký EventBus để reload khi có thay đổi
        const handleTimetableChanged = () => {
            reloadStudentData().catch(e => logMessage('ERROR', 'EventBus reload failed', e));
        };
        FrontendEventBus.on(FRONTEND_EVENTS.TIMETABLE_CHANGED, handleTimetableChanged);
        FrontendEventBus.on(FRONTEND_EVENTS.CLASS_SLOTS_CHANGED, handleTimetableChanged);

        return () => {
            FrontendEventBus.off(FRONTEND_EVENTS.TIMETABLE_CHANGED, handleTimetableChanged);
            FrontendEventBus.off(FRONTEND_EVENTS.CLASS_SLOTS_CHANGED, handleTimetableChanged);
        };
    }, [studentId]);

    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!activePhase || activePhase.type !== 'course') {
            setSuggestions([]);
            setSelectedSuggestion(null);
            setIsSearching(false);
            setSearchError(null);
            return;
        }

        const timeout = setTimeout(() => {
            setIsSearching(true);
            setSearchError(null);

            const filtered = curriculumCourses.filter(course =>
                !query || course.code.toLowerCase().includes(query) || course.name.toLowerCase().includes(query)
            ).slice(0, 10);

            setSuggestions(filtered);
            setIsSearching(false);
        }, 250);

        return () => clearTimeout(timeout);
    }, [activePhase, searchQuery, curriculumCourses]);

    const toggleUserInfo = () => {
        setIsUserInfoVisible(currentValue => !currentValue);
    };

    const handleLogout = () => {
        setIsUserInfoVisible(false);
        onLogout();
    };

    const handleViewCurriculum = () => {
        onViewCurriculum?.();
    };

    const handleSearchQueryChange = (value: string) => {
        setSearchQuery(value);
        setSelectedSuggestion(null);
        setIsSuggestionVisible(true);
    };

    const handleSelectSuggestion = (item: Suggestion) => {
        setSelectedSuggestion(item);
        setSearchQuery(item.code);
        setIsSuggestionVisible(false);
    };

    const fallbackSuggestion = useMemo(() => {
        const normalized = searchQuery.trim().toLowerCase();
        return suggestions.find(
            item =>
                item.code.toLowerCase() === normalized ||
                item.name.toLowerCase() === normalized
        );
    }, [searchQuery, suggestions]);

    const registerTarget = selectedSuggestion ?? fallbackSuggestion;

    const handleRegisterSubject = async () => {
        if (!activePhase) {
            Alert.alert('Cảnh báo', 'Hiện không trong giai đoạn đăng ký.');
            return;
        }

        if (!searchQuery.trim()) {
            Alert.alert('Cảnh báo', 'Vui lòng nhập mã hoặc tên học phần/lớp học.');
            return;
        }

        if (!registerTarget) {
            Alert.alert('Cảnh báo', 'Vui lòng chọn một gợi ý hợp lệ từ danh sách.');
            return;
        }

        if (activePhase.type === 'course') {
            const strategy = StudentStatusStrategyFactory.getStrategy(studentStatus);
            const maxCredits = strategy.getMaxAllowedCredits();
            const currentTotalCredits = registeredSubjects.reduce((sum, item) => sum + item.credits, 0);
            const targetCredits = (registerTarget as CurriculumCourse).credits;

            if (currentTotalCredits + targetCredits > maxCredits) {
                setPopupConfig({
                    visible: true,
                    message: `Tổng số TC vượt quá giới hạn. Số TC cho phép của bạn là ${maxCredits} TC.`,
                    buttonText: 'Đóng'
                });
                return;
            }
        }

        try {
            setIsSubmitting(true);

            if (activePhase.type === 'course') {
                const result = await courseRegistrationController.registerCourse(
                    studentId,
                    (registerTarget as CurriculumCourse).courseId
                );
                const message = (result as any).message || `Đã đăng ký học phần ${registerTarget.code}.`;
                setPopupConfig({
                    visible: true,
                    message: message,
                    buttonText: 'Đóng'
                });
            } else {
                await classRegistrationController.registerClass(
                    studentId,
                    (registerTarget as ClassSuggestion).id
                );
                Alert.alert('Thành công', `Đã đăng ký lớp học phần ${registerTarget.code}.`);
                FrontendEventBus.emit(FRONTEND_EVENTS.CLASS_SLOTS_CHANGED, { courseId: (registerTarget as ClassSuggestion).courseId });
            }

            setSearchQuery('');
            setSuggestions([]);
            setSelectedSuggestion(null);
            setIsSuggestionVisible(false);
            FrontendEventBus.emit(FRONTEND_EVENTS.TIMETABLE_CHANGED);
        } catch (error: any) {
            if (error.message === 'Bạn không có quyền thực hiện thao tác này. Liên hệ nhà trường để biết thêm thông tin') {
                setPopupConfig({
                    visible: true,
                    message: error.message,
                    buttonText: 'Đóng'
                });
            } else {
                Alert.alert('Cảnh báo', error.message || 'Đăng ký thất bại.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleCourseExpansion = async (courseId: number) => {
        const newExpanded = new Set(expandedCourseIds);
        if (newExpanded.has(courseId)) {
            newExpanded.delete(courseId);
            setExpandedCourseIds(newExpanded);
        } else {
            newExpanded.add(courseId);
            setExpandedCourseIds(newExpanded);

            if (!courseClassesData[courseId]) {
                setIsLoadingClasses(prev => ({ ...prev, [courseId]: true }));
                try {
                    const classes = await classRegistrationController.getCourseClasses(studentId, courseId);
                    setCourseClassesData(prev => ({ ...prev, [courseId]: classes }));
                } catch (error) {
                    logMessage('ERROR', `Failed to load classes for course ${courseId}`, error);
                } finally {
                    setIsLoadingClasses(prev => ({ ...prev, [courseId]: false }));
                }
            }
        }
    };

    const handleRegisterClassSection = async (classId: number, courseCode: string) => {
        try {
            setIsSubmitting(true);
            await classRegistrationController.registerClass(studentId, classId);
            Alert.alert('Thành công', `Đã đăng ký lớp học phần cho học phần ${courseCode}.`);
            FrontendEventBus.emit(FRONTEND_EVENTS.TIMETABLE_CHANGED);
        } catch (error: any) {
            Alert.alert('Cảnh báo', error.message || 'Đăng ký thất bại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelClassSection = async (classId: number, courseCode: string) => {
        Alert.alert(
            'Xác nhận huỷ lớp',
            `Bạn có chắc chắn muốn huỷ đăng ký lớp học phần ${courseCode}?`,
            [
                { text: 'Huỷ', style: 'cancel' },
                {
                    text: 'Xác nhận',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsSubmitting(true);
                            await classRegistrationController.cancelClassRegistration(studentId, classId);
                            Alert.alert('Thành công', `Đã huỷ đăng ký lớp học phần ${courseCode}.`);
                            FrontendEventBus.emit(FRONTEND_EVENTS.TIMETABLE_CHANGED);
                        } catch (error: any) {
                            Alert.alert('Cảnh báo', error.message || 'Huỷ thất bại.');
                        } finally {
                            setIsSubmitting(false);
                        }
                    },
                },
            ]
        );
    };

    return {
        isUserInfoVisible,
        toggleUserInfo,
        searchQuery,
        setSearchQuery: handleSearchQueryChange,
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
        allowedSuggestions: suggestions,
        handleSelectSuggestion,
        isSubmitting,
        popupConfig,
        closePopup,
        deletePopupConfig,
        closeDeletePopup,
        handleRequestDeleteCourse,
        handleConfirmDeleteCourse,
        currentSemesterName,
        studentStatus,
        totalCredits: registeredSubjects.reduce((sum, item) => sum + item.credits, 0),
        expandedCourseIds,
        courseClassesData,
        isLoadingClasses,
        toggleCourseExpansion,
        handleRegisterClassSection,
        registeredClasses,
        handleCancelClassSection,
    };
};
