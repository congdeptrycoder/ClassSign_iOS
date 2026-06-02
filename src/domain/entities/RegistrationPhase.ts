export interface RegistrationPhase {
  id: string;
  type: 'course' | 'class'; // 'course' = Đăng ký học phần, 'class' = Đăng ký lớp học
  startTime: string; // Định dạng YYYY-MM-DD HH:mm
  endTime: string;   // Định dạng YYYY-MM-DD HH:mm
}
