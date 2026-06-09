import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Account } from '../../../domain/entities/Account';
import { CurriculumCourse } from '../../../domain/entities/StudentRegistration';
import { useCurriculumViewModel } from '../../../interface-adapters/viewmodels/Curriculum/useCurriculumViewModel';
import { useTheme } from '../../components/ThemeContext';
import { createStudentStyles } from '../StudentDashboard/styles';

type CurriculumScreenProps = {
  account?: Account | null;
  onGoBack: () => void;
};

export const CurriculumScreen = ({ account, onGoBack }: CurriculumScreenProps) => {
  const { colors } = useTheme();
  const styles = createStudentStyles(colors);
  const {
    curriculum,
    isLoading,
    error,
    registeringCourseId,
    handleRegisterCourse,
  } = useCurriculumViewModel(account?.id ?? 1);
  const totalCourses = curriculum?.courses.length ?? 0;
  const completedCourses = curriculum?.courses.filter(course => course.hasStudied).length ?? 0;
  const registeredCourses = curriculum?.courses.filter(course => course.status === 'registered').length ?? 0;
  const availableCourses = curriculum?.courses.filter(course => course.status === 'available').length ?? 0;

  const getCourseStudyStatusStyle = (course: CurriculumCourse) => {
    return course.hasStudied ? styles.statusCompleted : styles.statusUnlearned;
  };

  const renderCourseRow = (course: CurriculumCourse) => (
    <View key={course.curriculumId} style={styles.tableRow}>
      <Text style={[styles.cell, styles.cellCode, styles.courseCodeText]}>{course.code}</Text>
      <Text style={[styles.cell, styles.cellName]}>{course.name}</Text>
      <Text style={[styles.cell, styles.cellCredits]}>{course.credits}</Text>
      <Text style={[styles.cell, styles.cellName]}>
        {course.prerequisiteCode ?? '-'}
      </Text>
      <Text style={[styles.cell, styles.cellName]}>
        {course.parallelCode ?? '-'}
      </Text>
      <View style={[styles.cellStatus, styles.tableStatusCell]}>
        <Text style={[styles.tableStatusText, getCourseStudyStatusStyle(course)]}>
          {course.studyStatusLabel}
        </Text>
      </View>
      <View style={styles.curriculumActionCell}>
        {course.canRegister ? (
          <TouchableOpacity
            style={styles.inlineActionButton}
            onPress={() => handleRegisterCourse(course)}
            disabled={registeringCourseId === course.courseId}
          >
            <Text style={styles.inlineActionButtonText}>
              {registeringCourseId === course.courseId ? '...' : 'Đăng ký'}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.mutedCellText}>-</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.curriculumHeader}>
          <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
          <View style={styles.curriculumTitleBlock}>
            <Text style={styles.curriculumTitle}>Chương trình đào tạo</Text>
            <Text style={styles.curriculumSubtitle}>
              {curriculum?.program
                ? `${curriculum.program.code} - ${curriculum.program.name}`
                : account?.name ?? 'Sinh viên'}
            </Text>
          </View>
        </View>

        {isLoading && (
          <View style={styles.noPhaseContainer}>
            <ActivityIndicator color={colors.buttonPrimary} />
            <Text style={styles.noPhaseSubText}>Đang tải dữ liệu...</Text>
          </View>
        )}

        {error && !isLoading && (
          <View style={styles.noPhaseContainer}>
            <Text style={styles.noPhaseTitle}>Không thể tải dữ liệu</Text>
            <Text style={styles.noPhaseSubText}>{error}</Text>
          </View>
        )}

        {!isLoading && !error && curriculum && (
          <ScrollView style={styles.contentContainer}>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Tổng học phần</Text>
                <Text style={styles.summaryValue}>{totalCourses}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Đã học</Text>
                <Text style={styles.summaryValue}>{completedCourses}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Đã đăng ký</Text>
                <Text style={styles.summaryValue}>{registeredCourses}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Có thể đăng ký</Text>
                <Text style={styles.summaryValue}>{availableCourses}</Text>
              </View>
            </View>
            <Text style={styles.sectionTitle}>
              {curriculum.student.name} - {curriculum.student.id_card ?? curriculum.student.username}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.headerCell, styles.cellCode]}>Mã HP</Text>
                  <Text style={[styles.headerCell, styles.cellName]}>Tên học phần</Text>
                  <Text style={[styles.headerCell, styles.cellCredits]}>TC</Text>
                  <Text style={[styles.headerCell, styles.cellName]}>Tiên quyết</Text>
                  <Text style={[styles.headerCell, styles.cellName]}>Song hành</Text>
                  <Text style={[styles.headerCell, styles.cellStatus]}>Đã học</Text>
                  <Text style={[styles.headerCell, styles.cellStatus]}>Thao tác</Text>
                </View>
                {curriculum.courses.map(renderCourseRow)}
              </View>
            </ScrollView>
            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};
