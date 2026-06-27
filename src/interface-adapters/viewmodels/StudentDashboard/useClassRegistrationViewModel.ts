import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { classRegistrationController, appEventBus } from '../../../di/student.di';
import { logMessage } from '../../../shared/utils/logger';
import { ClassSuggestion } from '../../../domain/entities/StudentRegistration';

export const useClassRegistrationViewModel = (
    studentId: number,
    setIsSubmitting: (val: boolean) => void
) => {
    const [expandedCourseIds, setExpandedCourseIds] = useState<Set<number>>(new Set());
    const [courseClassesData, setCourseClassesData] = useState<Record<number, ClassSuggestion[]>>({});
    const [isLoadingClasses, setIsLoadingClasses] = useState<Record<number, boolean>>({});

    const refreshCourseClasses = useCallback(async (courseId: number) => {
        setIsLoadingClasses(prev => ({ ...prev, [courseId]: true }));
        try {
            const classes = await classRegistrationController.getCourseClasses(studentId, courseId);
            setCourseClassesData(prev => ({ ...prev, [courseId]: classes }));
        } catch (error: any) {
            logMessage('ERROR', `refreshCourseClasses error courseId=${courseId}: ${error.message}`, error);
        } finally {
            setIsLoadingClasses(prev => ({ ...prev, [courseId]: false }));
        }
    }, [studentId]);

    useEffect(() => {
        const handleSlotsChanged = (data?: { courseId: number }) => {
            if (data?.courseId && expandedCourseIds.has(data.courseId)) {
                refreshCourseClasses(data.courseId);
            }
        };

        appEventBus.on('CLASS_SLOTS_CHANGED', handleSlotsChanged);
        return () => {
            appEventBus.off('CLASS_SLOTS_CHANGED', handleSlotsChanged);
        };
    }, [refreshCourseClasses, expandedCourseIds]);

    const toggleCourseExpansion = async (courseId: number) => {
        const newExpanded = new Set(expandedCourseIds);
        if (newExpanded.has(courseId)) {
            newExpanded.delete(courseId);
            setExpandedCourseIds(newExpanded);
        } else {
            newExpanded.add(courseId);
            setExpandedCourseIds(newExpanded);

            if (!courseClassesData[courseId]) {
                await refreshCourseClasses(courseId);
            }
        }
    };

    const handleRegisterClassSection = async (classId: number, courseCode: string, courseId: number) => {
        try {
            setIsSubmitting(true);
            await classRegistrationController.registerClass(studentId, classId);
            Alert.alert('Thành công', `Đã đăng ký lớp học phần cho học phần ${courseCode}.`);
            appEventBus.emit('CLASS_SLOTS_CHANGED', { courseId });
            appEventBus.emit('TIMETABLE_CHANGED');
        } catch (error: any) {
            Alert.alert('Cảnh báo', error.message || 'Đăng ký thất bại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelClassSection = async (classId: number, courseCode: string, courseId: number) => {
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
                            appEventBus.emit('CLASS_SLOTS_CHANGED', { courseId });
                            appEventBus.emit('TIMETABLE_CHANGED');
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
        expandedCourseIds,
        courseClassesData,
        isLoadingClasses,
        toggleCourseExpansion,
        handleRegisterClassSection,
        handleCancelClassSection,
    };
};
