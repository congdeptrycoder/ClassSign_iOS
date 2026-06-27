import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  Curriculum,
  CurriculumCourse,
} from '../../../domain/entities/StudentRegistration';
import { courseRegistrationController } from '../../../di/student.di';
import { logMessage } from '../../../shared/utils/logger';

export const useCurriculumViewModel = (studentId: number) => {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeringCourseId, setRegisteringCourseId] = useState<number | null>(null);
  const [popupConfig, setPopupConfig] = useState<{ visible: boolean; message: string; buttonText: string } | null>(null);

  const closePopup = () => setPopupConfig(null);

  const loadCurriculum = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setCurriculum(await courseRegistrationController.getCurriculum(studentId));
    } catch (err: any) {
      const message = err.message || 'Không thể tải chương trình đào tạo.';
      setError(message);
      logMessage('ERROR', message, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCurriculum();
  }, [studentId]);

  const handleRegisterCourse = async (course: CurriculumCourse) => {
    try {
      setRegisteringCourseId(course.courseId);
      const result = await courseRegistrationController.registerCourse(studentId, course.courseId);
      const message = (result as any)?.message || `Đã đăng ký học phần ${course.code}.`;
      setPopupConfig({
        visible: true,
        message: message,
        buttonText: 'Đóng'
      });
      await loadCurriculum();
    } catch (err: any) {
      if (err.message === 'Bạn không có quyền thực hiện thao tác này. Liên hệ nhà trường để biết thêm thông tin') {
        setPopupConfig({
          visible: true,
          message: err.message,
          buttonText: 'Đóng'
        });
      } else {
        Alert.alert('Cảnh báo', err.message || 'Đăng ký học phần thất bại.');
      }
    } finally {
      setRegisteringCourseId(null);
    }
  };

  return {
    curriculum,
    isLoading,
    error,
    registeringCourseId,
    popupConfig,
    closePopup,
    reload: loadCurriculum,
    handleRegisterCourse,
  };
};
