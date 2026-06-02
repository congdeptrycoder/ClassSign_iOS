import { act, renderHook } from '@testing-library/react-native';
import { useStudentDashboardViewModel } from '../../../../src/interface-adapters/viewmodels/StudentDashboard/useStudentDashboardViewModel';
import { RegistrationPhaseRepositoryImpl } from '../../../../src/infrastructure/repositories/RegistrationPhaseRepositoryImpl';
import { Linking, Alert } from 'react-native';

describe('useStudentDashboardViewModel', () => {
  let phaseRepo: RegistrationPhaseRepositoryImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    phaseRepo = RegistrationPhaseRepositoryImpl.getInstance();
    // Reset repository state
    // We access private array or clear it by deleting phases
    const existing = phaseRepo.getPhases();
    existing.forEach(p => phaseRepo.deletePhase(p.id));
  });

  it('renders default values correctly', () => {
    const { result } = renderHook(() => useStudentDashboardViewModel(jest.fn()));
    expect(result.current.isUserInfoVisible).toBe(false);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.activePhase).toBeNull();
    expect(result.current.registeredSubjects.length).toBe(3);
  });

  it('toggles user info visibility', () => {
    const { result } = renderHook(() => useStudentDashboardViewModel(jest.fn()));
    
    act(() => {
      result.current.toggleUserInfo();
    });
    expect(result.current.isUserInfoVisible).toBe(true);
    
    act(() => {
      result.current.toggleUserInfo();
    });
    expect(result.current.isUserInfoVisible).toBe(false);
  });

  it('opens curriculum URL on view curriculum press', async () => {
    const { result } = renderHook(() => useStudentDashboardViewModel(jest.fn()));
    
    await act(async () => {
      await result.current.handleViewCurriculum();
    });
    
    expect(Linking.canOpenURL).toHaveBeenCalledWith('https://fed.hust.edu.vn');
    expect(Linking.openURL).toHaveBeenCalledWith('https://fed.hust.edu.vn');
  });

  it('filters allowed course suggestions as student types', () => {
    const { result } = renderHook(() => useStudentDashboardViewModel(jest.fn()));
    
    act(() => {
      result.current.setSearchQuery('Web');
    });
    
    // IT4500 is "Công nghệ Web"
    expect(result.current.allowedSuggestions.length).toBe(1);
    expect(result.current.allowedSuggestions[0].code).toBe('IT4500');
  });

  it('should successfully register a valid subject', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { result } = renderHook(() => useStudentDashboardViewModel(jest.fn()));
    
    act(() => {
      result.current.setSearchQuery('IT3180'); // Allowed subject
    });

    act(() => {
      result.current.handleRegisterSubject();
    });

    expect(result.current.registeredSubjects.length).toBe(4);
    expect(result.current.registeredSubjects[3].code).toBe('IT3180');
    expect(result.current.searchQuery).toBe('');
    expect(alertSpy).toHaveBeenCalledWith('Thành công', expect.stringContaining('IT3180'));
    
    alertSpy.mockRestore();
  });

  it('should warn and not register an invalid subject', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { result } = renderHook(() => useStudentDashboardViewModel(jest.fn()));
    
    act(() => {
      result.current.setSearchQuery('IT9999'); // Invalid
    });

    act(() => {
      result.current.handleRegisterSubject();
    });

    expect(result.current.registeredSubjects.length).toBe(3); // Unchanged
    expect(alertSpy).toHaveBeenCalledWith('Cảnh báo', expect.stringContaining('không được phép đăng ký'));
    
    alertSpy.mockRestore();
  });

  it('reacts to active phase changes dynamically via repository subscription', () => {
    const { result } = renderHook(() => useStudentDashboardViewModel(jest.fn()));
    expect(result.current.activePhase).toBeNull();

    const now = new Date();
    const pad = (num: number) => num.toString().padStart(2, '0');
    const startStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    
    // 2 hours later
    const end = new Date(now.getTime() + 7200000);
    const endStr = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())} ${pad(end.getHours())}:${pad(end.getMinutes())}`;

    act(() => {
      phaseRepo.addPhase({
        type: 'course',
        startTime: startStr,
        endTime: endStr,
      });
    });

    // Check if viewmodel automatically received the notification and updated activePhase
    expect(result.current.activePhase).not.toBeNull();
    expect(result.current.activePhase?.type).toBe('course');
  });
});
