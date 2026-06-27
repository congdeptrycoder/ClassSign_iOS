import { CourseRegistrationRepositoryImpl } from '../../../src/infrastructure/repositories/CourseRegistrationRepositoryImpl';
import { apiClient } from '../../../src/infrastructure/api/apiClient';

jest.mock('../../../src/infrastructure/api/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('CourseRegistrationRepositoryImpl', () => {
  let repository: CourseRegistrationRepositoryImpl;
  const mockStudentId = 1;

  beforeEach(() => {
    repository = new CourseRegistrationRepositoryImpl();
    jest.clearAllMocks();
  });

  it('should fetch curriculum correctly', async () => {
    const mockCurriculum = { test: 'data' };
    (apiClient.get as jest.Mock).mockResolvedValue(mockCurriculum);

    const result = await repository.getCurriculum(mockStudentId);
    expect(apiClient.get).toHaveBeenCalledWith(`/students/${mockStudentId}/curriculum`);
    expect(result).toEqual(mockCurriculum);
  });

  it('should fetch registered courses correctly', async () => {
    const mockRegisteredCourses = { semester: '20241', courses: [] };
    (apiClient.get as jest.Mock).mockResolvedValue(mockRegisteredCourses);

    const result = await repository.getRegisteredCourses(mockStudentId);
    expect(apiClient.get).toHaveBeenCalledWith(`/students/${mockStudentId}/registered-courses`);
    expect(result).toEqual(mockRegisteredCourses);
  });

  it('should search course suggestions correctly', async () => {
    const mockSuggestions = [{ id: 1 }];
    const query = 'IT';
    (apiClient.get as jest.Mock).mockResolvedValue(mockSuggestions);

    const result = await repository.searchCourseSuggestions(mockStudentId, query);
    expect(apiClient.get).toHaveBeenCalledWith(`/students/${mockStudentId}/course-suggestions?q=${query}`);
    expect(result).toEqual(mockSuggestions);
  });

  it('should register course correctly', async () => {
    const mockCourseId = 123;
    const mockResponse = { id: 1, courseId: mockCourseId };
    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await repository.registerCourse(mockStudentId, mockCourseId);
    expect(apiClient.post).toHaveBeenCalledWith(`/students/${mockStudentId}/course-registrations`, { courseId: mockCourseId });
    expect(result).toEqual(mockResponse);
  });

  it('should delete registered course correctly', async () => {
    const mockCourseId = 123;
    const mockSemester = '20241';
    (apiClient.delete as jest.Mock).mockResolvedValue({ success: true });

    await repository.deleteRegisteredCourse(mockStudentId, mockCourseId, mockSemester);
    expect(apiClient.delete).toHaveBeenCalledWith(`/students/${mockStudentId}/course-registrations?courseId=${mockCourseId}&semester=${mockSemester}`);
  });
});
