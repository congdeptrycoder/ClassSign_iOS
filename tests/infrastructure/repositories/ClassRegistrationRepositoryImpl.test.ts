import { ClassRegistrationRepositoryImpl } from '../../../src/infrastructure/repositories/ClassRegistrationRepositoryImpl';
import { apiClient } from '../../../src/infrastructure/api/apiClient';

jest.mock('../../../src/infrastructure/api/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('ClassRegistrationRepositoryImpl', () => {
  let repository: ClassRegistrationRepositoryImpl;
  const mockStudentId = 1;

  beforeEach(() => {
    repository = new ClassRegistrationRepositoryImpl();
    jest.clearAllMocks();
  });

  it('should search class suggestions correctly', async () => {
    const mockSuggestions = [{ classId: 1, name: 'Lớp 1' }];
    const query = 'IT';
    (apiClient.get as jest.Mock).mockResolvedValue(mockSuggestions);

    const result = await repository.searchClassSuggestions(mockStudentId, query);
    expect(apiClient.get).toHaveBeenCalledWith(`/students/${mockStudentId}/class-suggestions?q=${query}`);
    expect(result).toEqual(mockSuggestions);
  });

  it('should register class correctly', async () => {
    const mockClassId = 123;
    (apiClient.post as jest.Mock).mockResolvedValue({ id: 1 });

    await repository.registerClass(mockStudentId, mockClassId);
    expect(apiClient.post).toHaveBeenCalledWith(`/students/${mockStudentId}/class-registrations`, { classId: mockClassId });
  });

  it('should get course classes correctly', async () => {
    const mockCourseId = 101;
    const mockClasses = [{ classId: 1, name: 'Lớp 1' }];
    (apiClient.get as jest.Mock).mockResolvedValue(mockClasses);

    const result = await repository.getCourseClasses(mockStudentId, mockCourseId);
    expect(apiClient.get).toHaveBeenCalledWith(`/students/${mockStudentId}/courses/${mockCourseId}/classes`);
    expect(result).toEqual(mockClasses);
  });

  it('should cancel class registration correctly', async () => {
    const mockClassId = 123;
    (apiClient.delete as jest.Mock).mockResolvedValue({ success: true });

    await repository.cancelClassRegistration(mockStudentId, mockClassId);
    expect(apiClient.delete).toHaveBeenCalledWith(`/students/${mockStudentId}/class-registrations?classId=${mockClassId}`);
  });
});
