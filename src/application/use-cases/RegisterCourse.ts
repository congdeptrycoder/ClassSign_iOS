import { Course } from '../../domain/entities/Course';

export interface RegisteredSubjectDTO {
  id: string;
  code: string;
  name: string;
  status: string;
  credits: number;
}

export class RegisterCourse {
  // Danh sách học phần được phép đăng ký (mẫu)
  private allowedCourses: Course[] = [
    { code: 'IT3040', name: 'Kỹ thuật phần mềm', credits: 3 },
    { code: 'IT3020', name: 'Toán rời rạc', credits: 3 },
    { code: 'IT4060', name: 'Thiết kế hệ thống mạng', credits: 3 },
    { code: 'IT3180', name: 'Hệ cơ sở dữ liệu', credits: 3 },
    { code: 'IT3080', name: 'Mạng máy tính', credits: 3 },
    { code: 'IT4100', name: 'Đảm bảo chất lượng phần mềm', credits: 3 },
    { code: 'IT4500', name: 'Công nghệ Web', credits: 3 }
  ];

  public getAllowedCourses(): Course[] {
    return [...this.allowedCourses];
  }

  public execute(
    courseCodeOrName: string,
    alreadyRegistered: { code: string }[]
  ): RegisteredSubjectDTO {
    const trimmedInput = courseCodeOrName.trim().toLowerCase();
    
    if (!trimmedInput) {
      throw new Error('Vui lòng nhập mã hoặc tên học phần!');
    }

    // Tìm trong danh sách cho phép (khớp mã hoặc tên học phần)
    const matchedCourse = this.allowedCourses.find(
      c => c.code.toLowerCase() === trimmedInput || c.name.toLowerCase() === trimmedInput
    );

    if (!matchedCourse) {
      throw new Error('Học phần không được phép đăng ký hoặc không tồn tại trong chương trình đào tạo!');
    }

    // Kiểm tra xem đã đăng ký chưa
    const isAlreadyRegistered = alreadyRegistered.some(
      r => r.code.toLowerCase() === matchedCourse.code.toLowerCase()
    );

    if (isAlreadyRegistered) {
      throw new Error('Học phần này đã được đăng ký trước đó!');
    }

    return {
      id: Math.random().toString(36).substring(2, 9),
      code: matchedCourse.code,
      name: matchedCourse.name,
      status: 'Thành công',
      credits: matchedCourse.credits
    };
  }
}
export default RegisterCourse;
