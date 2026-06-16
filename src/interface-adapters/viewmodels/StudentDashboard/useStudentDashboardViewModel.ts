import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { GetActiveRegistrationPhase } from '../../../application/use-cases/GetActiveRegistrationPhase';
import { ManageStudentRegistration } from '../../../application/use-cases/ManageStudentRegistration';
import { RegistrationPhase } from '../../../domain/entities/RegistrationPhase';
import {
    ClassSuggestion,
    CurriculumCourse,
    TimetableEntry,
} from '../../../domain/entities/StudentRegistration';
import { RegistrationPhaseRepositoryImpl } from '../../../infrastructure/repositories/RegistrationPhaseRepositoryImpl';
import { StudentRegistrationRepositoryImpl } from '../../../infrastructure/repositories/StudentRegistrationRepositoryImpl';
import { logMessage } from '../../../shared/utils/logger';

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

export interface TimeEvent {
    day: string;
    period: number;
    name: string;
}

type Suggestion = CurriculumCourse | ClassSuggestion;

const registrationUseCase = new ManageStudentRegistration(
    new StudentRegistrationRepositoryImpl()
);

function toStatusLabel(status: string) {
    if (status === 'completed') return 'Đã học';
    if (status === 'registered') return 'Học phần chưa hoàn thành';
    if (status === 're_registered') return 'Học cải thiện';
    if (status === 'cancelled') return 'Đã hủy';
    return status;
}

function parseTimetableEvents(entries: TimetableEntry[]): TimeEvent[] {
    return entries.flatMap(entry => {
        if (!entry.detail) return [];

        try {
            const detail = JSON.parse(entry.detail);
            const slots = Array.isArray(detail) ? detail : detail.slots;
            if (!Array.isArray(slots)) return [];

            return slots.flatMap((slot: any) => {
                const periods = Array.isArray(slot.periods)
                    ? slot.periods
                    : [slot.period].filter(Boolean);

                return periods.map((period: number) => ({
                    day: slot.day,
                    period,
                    name: entry.code,
                }));
            });
        } catch (_err) {
            return [];
        }
    });
}

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
    const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
    const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
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
            await registrationUseCase.deleteRegisteredCourse(studentId, courseId, semester);
            setDeletePopupConfig(null);
            await reloadStudentData();
        } catch (error: any) {
            Alert.alert('Cảnh báo', error.message || 'Xoá đăng ký thất bại.');
        }
    };

    const reloadStudentData = async () => {
        const [response, timetable] = await Promise.all([
            registrationUseCase.getRegisteredCourses(studentId),
            registrationUseCase.getTimetable(studentId),
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
        setTimeGridEvents(parseTimetableEvents(timetable));
    };

    useEffect(() => {
        const phaseRepository = RegistrationPhaseRepositoryImpl.getInstance();
        const getActivePhaseUseCase = new GetActiveRegistrationPhase();
        const unsubscribe = phaseRepository.subscribe(phases => {
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
    }, [studentId]);

    useEffect(() => {
        const query = searchQuery.trim();
        if (!activePhase) {
            setSuggestions([]);
            setSelectedSuggestion(null);
            setIsSearching(false);
            setSearchError(null);
            return;
        }

        const timeout = setTimeout(() => {
            setIsSearching(true);
            setSearchError(null);

            const request =
                activePhase.type === 'course'
                    ? registrationUseCase.searchCourseSuggestions(studentId, query)
                    : registrationUseCase.searchClassSuggestions(studentId, query);

            request
                .then(setSuggestions)
                .catch(error => {
                    logMessage('ERROR', 'Không thể tải gợi ý đăng ký', error);
                    setSearchError(
                        error instanceof Error
                            ? error.message
                            : 'Không thể tải gợi ý đăng ký.'
                    );
                    setSuggestions([]);
                })
                .finally(() => {
                    setIsSearching(false);
                });
        }, 250);

        return () => clearTimeout(timeout);
    }, [activePhase, searchQuery, studentId]);

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
            const maxCredits = studentStatus === 'study_cc1' ? 20 :
                               studentStatus === 'study_cc2' ? 16 :
                               studentStatus === 'study_cc3' ? 12 : 24;
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
                const result = await registrationUseCase.registerCourse(
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
                await registrationUseCase.registerClass(
                    studentId,
                    (registerTarget as ClassSuggestion).id
                );
                Alert.alert('Thành công', `Đã đăng ký lớp học phần ${registerTarget.code}.`);
            }

            setSearchQuery('');
            setSuggestions([]);
            setSelectedSuggestion(null);
            setIsSuggestionVisible(false);
            await reloadStudentData();
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
                    const classes = await registrationUseCase.getCourseClasses(studentId, courseId);
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
            await registrationUseCase.registerClass(studentId, classId);
            Alert.alert('Thành công', `Đã đăng ký lớp học phần cho học phần ${courseCode}.`);
            await reloadStudentData();
        } catch (error: any) {
            Alert.alert('Cảnh báo', error.message || 'Đăng ký thất bại.');
        } finally {
            setIsSubmitting(false);
        }
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
    };
};
