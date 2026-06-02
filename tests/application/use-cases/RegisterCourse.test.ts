import { RegisterCourse } from '../../../src/application/use-cases/RegisterCourse';

describe('RegisterCourse Use Case', () => {
  let useCase: RegisterCourse;

  beforeEach(() => {
    useCase = new RegisterCourse();
  });

  it('should successfully register an allowed course', () => {
    const registered = useCase.execute('IT3180', []);
    expect(registered.code).toBe('IT3180');
    expect(registered.name).toBe('Hệ cơ sở dữ liệu');
    expect(registered.status).toBe('Thành công');
    expect(registered.credits).toBe(3);
  });

  it('should match course by name case-insensitively', () => {
    const registered = useCase.execute('toán rời rạc', []);
    expect(registered.code).toBe('IT3020');
  });

  it('should throw an error for empty course code/name input', () => {
    expect(() => useCase.execute('  ', [])).toThrow('Vui lòng nhập mã hoặc tên học phần!');
  });

  it('should throw an error for course not in allowed list', () => {
    expect(() => useCase.execute('IT9999', [])).toThrow(
      'Học phần không được phép đăng ký hoặc không tồn tại trong chương trình đào tạo!'
    );
  });

  it('should throw an error if the course is already registered', () => {
    const alreadyRegistered = [{ code: 'IT3020' }];
    expect(() => useCase.execute('IT3020', alreadyRegistered)).toThrow(
      'Học phần này đã được đăng ký trước đó!'
    );
  });
});
