import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ManageStudentRegistration } from '../../../application/use-cases/ManageStudentRegistration';
import {
  Curriculum,
  CurriculumCourse,
} from '../../../domain/entities/StudentRegistration';
import { StudentRegistrationRepositoryImpl } from '../../../infrastructure/repositories/StudentRegistrationRepositoryImpl';
import { logMessage } from '../../../shared/utils/logger';

const registrationUseCase = new ManageStudentRegistration(
  new StudentRegistrationRepositoryImpl()
);

export const useCurriculumViewModel = (studentId: number) => {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeringCourseId, setRegisteringCourseId] = useState<number | null>(null);

  const loadCurriculum = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setCurriculum(await registrationUseCase.getCurriculum(studentId));
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
    if (!course.canRegister) {
      Alert.alert('Cảnh báo', course.blockingReason || 'Học phần chưa đủ điều kiện đăng ký.');
      return;
    }

    try {
      setRegisteringCourseId(course.courseId);
      await registrationUseCase.registerCourse(studentId, course.courseId);
      Alert.alert('Thành công', `Đã đăng ký học phần ${course.code}.`);
      await loadCurriculum();
    } catch (err: any) {
      Alert.alert('Cảnh báo', err.message || 'Đăng ký học phần thất bại.');
    } finally {
      setRegisteringCourseId(null);
    }
  };

  return {
    curriculum,
    isLoading,
    error,
    registeringCourseId,
    reload: loadCurriculum,
    handleRegisterCourse,
  };
};
