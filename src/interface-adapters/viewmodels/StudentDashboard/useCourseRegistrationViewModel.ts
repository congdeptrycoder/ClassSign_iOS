import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { CurriculumCourse } from '../../../domain/entities/StudentRegistration';
import { courseRegistrationController, appEventBus } from '../../../di/student.di';
import { logMessage } from '../../../shared/utils/logger';
import { toStatusLabel } from '../../../shared/utils/statusLabelUtils';
import { RegisteredSubject } from './useStudentDashboardViewModel'; // Will move this interface here
import { Account } from '../../../domain/entities/Account';

export interface RegisteredSubjectData {
    id: string;
    courseId: number;
    semester: string;
    rawStatus: string;
    code: string;
    name: string;
    status: string;
    credits: number;
}

export const useCourseRegistrationViewModel = (
    account: Account,
    activePhaseType: string | undefined,
    setIsSubmitting: (val: boolean) => void,
    setPopupConfig: (config: any) => void
) => {
    const studentId = account.id;
    const [searchQuery, setSearchQuery] = useState('');
    const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
    const [suggestions, setSuggestions] = useState<CurriculumCourse[]>([]);
    const [curriculumCourses, setCurriculumCourses] = useState<CurriculumCourse[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState<CurriculumCourse | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [registeredSubjects, setRegisteredSubjects] = useState<RegisteredSubjectData[]>([]);
    const [studentStatus, setStudentStatus] = useState<string>(account.status || 'study');
    
    const [deletePopupConfig, setDeletePopupConfig] = useState<{ visible: boolean; subject: RegisteredSubjectData | null } | null>(null);

    const reloadCourses = useCallback(async () => {
        try {
            const [response, curriculum] = await Promise.all([
                courseRegistrationController.getRegisteredCourses(studentId),
                courseRegistrationController.getCurriculum(studentId),
            ]);

            if (response.studentStatus) {
                setStudentStatus(response.studentStatus);
            }

            setRegisteredSubjects(
                response.courses.map(course => ({
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
            setCurriculumCourses(curriculum.courses);
        } catch (error) {
            logMessage('ERROR', 'Không thể tải dữ liệu học phần', error);
        }
    }, [studentId]);

    useEffect(() => {
        reloadCourses();

        const handleTimetableChanged = () => {
            reloadCourses();
        };

        appEventBus.on('TIMETABLE_CHANGED', handleTimetableChanged);
        return () => {
            appEventBus.off('TIMETABLE_CHANGED', handleTimetableChanged);
        };
    }, [reloadCourses]);

    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();
        if (activePhaseType !== 'course') {
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
    }, [activePhaseType, searchQuery, curriculumCourses]);

    const handleSearchQueryChange = (value: string) => {
        setSearchQuery(value);
        setSelectedSuggestion(null);
        setIsSuggestionVisible(true);
    };

    const handleSelectSuggestion = (item: CurriculumCourse) => {
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

    const handleRegisterCourse = async () => {
        if (!searchQuery.trim()) {
            Alert.alert('Cảnh báo', 'Vui lòng nhập mã hoặc tên học phần.');
            return;
        }

        if (!registerTarget) {
            Alert.alert('Cảnh báo', 'Vui lòng chọn một gợi ý hợp lệ từ danh sách.');
            return;
        }

        // Strategy pattern encapsulation via Domain Entity
        const strategyAccount = new Account(account.id, account.username, account.name, account.role, account.id_card, studentStatus);
        const maxCredits = strategyAccount.getMaxAllowedCredits();
        const currentTotalCredits = registeredSubjects.reduce((sum, item) => sum + item.credits, 0);
        const targetCredits = registerTarget.credits;

        if (currentTotalCredits + targetCredits > maxCredits) {
            setPopupConfig({
                visible: true,
                message: `Tổng số TC vượt quá giới hạn. Số TC cho phép của bạn là ${maxCredits} TC.`,
                buttonText: 'Đóng'
            });
            return;
        }

        try {
            setIsSubmitting(true);
            const result = await courseRegistrationController.registerCourse(
                studentId,
                registerTarget.courseId
            );
            const message = (result as any).message || `Đã đăng ký học phần ${registerTarget.code}.`;
            setPopupConfig({
                visible: true,
                message: message,
                buttonText: 'Đóng'
            });

            setSearchQuery('');
            setSuggestions([]);
            setSelectedSuggestion(null);
            setIsSuggestionVisible(false);
            appEventBus.emit('TIMETABLE_CHANGED');
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

    const handleRequestDeleteCourse = (subject: RegisteredSubjectData) => {
        setDeletePopupConfig({ visible: true, subject });
    };

    const handleConfirmDeleteCourse = async () => {
        if (!deletePopupConfig?.subject) return;
        const { courseId, semester } = deletePopupConfig.subject;
        try {
            await courseRegistrationController.cancelCourseRegistration(studentId, courseId, semester);
            setDeletePopupConfig(null);
            appEventBus.emit('TIMETABLE_CHANGED');
        } catch (error: any) {
            Alert.alert('Cảnh báo', error.message || 'Xoá đăng ký thất bại.');
        }
    };

    return {
        searchQueryCourse: searchQuery,
        setSearchQueryCourse: handleSearchQueryChange,
        isSuggestionVisibleCourse: isSuggestionVisible,
        setIsSuggestionVisibleCourse: setIsSuggestionVisible,
        isSearchingCourse: isSearching,
        searchErrorCourse: searchError,
        suggestionsCourse: suggestions,
        handleSelectSuggestionCourse: handleSelectSuggestion,
        handleRegisterCourse,
        registeredSubjects,
        studentStatus,
        deletePopupConfig,
        handleRequestDeleteCourse,
        handleConfirmDeleteCourse,
        closeDeletePopup: () => setDeletePopupConfig(null),
        totalCredits: registeredSubjects.reduce((sum, item) => sum + item.credits, 0),
    };
};
