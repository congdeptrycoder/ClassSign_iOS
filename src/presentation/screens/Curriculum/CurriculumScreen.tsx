import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Account } from '../../../domain/entities/Account';
import { CurriculumCourse } from '../../../domain/entities/StudentRegistration';
import { useCurriculumViewModel } from '../../../interface-adapters/viewmodels/Curriculum/useCurriculumViewModel';
import { useTheme } from '../../components/ThemeContext';
import { AlarmOneChoose } from '../../components/alarm_one_choose';
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
    popupConfig,
    closePopup,
    handleRegisterCourse,
  } = useCurriculumViewModel(account?.id ?? 1);
  const totalCourses = curriculum?.courses.length ?? 0;
  const completedCourses = curriculum?.courses.filter(course => course.status === 'completed').length ?? 0;
  const registeredCourses = curriculum?.courses.filter(course => course.status === 'registered').length ?? 0;

  const [searchQuery, setSearchQuery] = useState('');
  const filteredCourses = curriculum?.courses.filter(course =>
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  const renderCourseRow = (course: CurriculumCourse) => {
    let rowBgColor = undefined;
    let textColor = undefined;
    if (course.status === 'completed') {
      rowBgColor = '#708238';
      textColor = '#FFF';
    } else if (course.status === 'registered') {
      rowBgColor = '#C49102';
      textColor = '#FFF';
    }

    return (
      <View key={course.curriculumId} style={[styles.tableRow, rowBgColor ? { backgroundColor: rowBgColor } : {}]}>
        <Text style={[styles.cell, styles.cellCode, styles.courseCodeText, textColor ? { color: textColor } : {}]}>{course.code}</Text>
        <Text style={[styles.cell, styles.cellName, textColor ? { color: textColor } : {}]}>{course.name}</Text>
        <Text style={[styles.cell, styles.cellCredits, textColor ? { color: textColor } : {}]}>{course.credits}</Text>
        <Text style={[styles.cell, styles.cellName, textColor ? { color: textColor } : {}]}>
          {course.prerequisiteCode ?? '-'}
        </Text>
        <Text style={[styles.cell, styles.cellName, textColor ? { color: textColor } : {}]}>
          {course.parallelCode ?? '-'}
        </Text>
        <View style={styles.curriculumActionCell}>
          <TouchableOpacity
            style={styles.inlineActionButton}
            onPress={() => handleRegisterCourse(course)}
            disabled={registeringCourseId === course.courseId}
          >
            <Text style={styles.inlineActionButtonText}>
              {registeringCourseId === course.courseId ? '...' : 'Đăng ký'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
              <View style={[styles.summaryCard, { backgroundColor: '#708238' }]}>
                <Text style={[styles.summaryLabel, { color: '#FFF' }]}>Đã học xong</Text>
                <Text style={[styles.summaryValue, { color: '#FFF' }]}>{completedCourses}</Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: '#C49102' }]}>
                <Text style={[styles.summaryLabel, { color: '#FFF' }]}>Đã đăng ký, chưa học xong</Text>
                <Text style={[styles.summaryValue, { color: '#FFF' }]}>{registeredCourses}</Text>
              </View>
            </View>
            <Text style={styles.sectionTitle}>
              {curriculum.student.name} - {curriculum.student.id_card ?? curriculum.student.username}
            </Text>
            <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm mã hoặc tên học phần..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.headerCell, styles.cellCode]}>Mã HP</Text>
                  <Text style={[styles.headerCell, styles.cellName]}>Tên học phần</Text>
                  <Text style={[styles.headerCell, styles.cellCredits]}>TC</Text>
                  <Text style={[styles.headerCell, styles.cellName]}>Tiên quyết</Text>
                  <Text style={[styles.headerCell, styles.cellName]}>Song hành</Text>
                  <Text style={[styles.headerCell, styles.cellStatus]}>Thao tác</Text>
                </View>
                {filteredCourses.map(renderCourseRow)}
              </View>
            </ScrollView>
            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}
        {popupConfig && (
          <AlarmOneChoose
            visible={popupConfig.visible}
            message={popupConfig.message}
            buttonText={popupConfig.buttonText}
            onClose={closePopup}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
