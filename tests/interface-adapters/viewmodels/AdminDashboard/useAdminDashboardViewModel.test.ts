import { act, renderHook } from '@testing-library/react-native';
import { useAdminDashboardViewModel } from '../../../../src/interface-adapters/viewmodels/AdminDashboard/useAdminDashboardViewModel';
import { RegistrationPhaseRepositoryImpl } from '../../../../src/infrastructure/repositories/RegistrationPhaseRepositoryImpl';
import { Alert } from 'react-native';

describe('useAdminDashboardViewModel', () => {
  let phaseRepo: RegistrationPhaseRepositoryImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    phaseRepo = RegistrationPhaseRepositoryImpl.getInstance();
    // Clear registration phases in repo
    const existing = phaseRepo.getPhases();
    existing.forEach(p => phaseRepo.deletePhase(p.id));
  });

  it('toggles profile open state', () => {
    const { result } = renderHook(() => useAdminDashboardViewModel());

    expect(result.current.isProfileOpen).toBe(false);

    act(() => {
      result.current.toggleProfile();
    });

    expect(result.current.isProfileOpen).toBe(true);
  });

  it('updates search query', () => {
    const { result } = renderHook(() => useAdminDashboardViewModel());

    act(() => {
      result.current.setSearchQuery('test');
    });

    expect(result.current.searchQuery).toBe('test');
  });

  it('updates search mode', () => {
    const { result } = renderHook(() => useAdminDashboardViewModel());

    act(() => {
      result.current.setSearchMode('Mã HP');
    });

    expect(result.current.searchMode).toBe('Mã HP');
  });

  // ── Giai đoạn đăng ký (Phases) tests ───────────────────────────────────
  it('should successfully add a new registration phase', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { result } = renderHook(() => useAdminDashboardViewModel());

    act(() => {
      result.current.setPhaseType('course');
      result.current.setStartTime('2026-06-02 12:00');
      result.current.setEndTime('2026-06-02 18:00');
    });

    act(() => {
      result.current.handleSavePhase();
    });

    expect(result.current.phases.length).toBe(1);
    expect(result.current.phases[0].type).toBe('course');
    expect(result.current.phases[0].startTime).toBe('2026-06-02 12:00');
    expect(result.current.phases[0].endTime).toBe('2026-06-02 18:00');
    expect(alertSpy).toHaveBeenCalledWith('Thành công', expect.stringContaining('thiết lập giai đoạn đăng ký thành công'));

    alertSpy.mockRestore();
  });

  it('should fill form and update phase on edit', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { result } = renderHook(() => useAdminDashboardViewModel());

    let phase;
    act(() => {
      phase = phaseRepo.addPhase({
        type: 'course',
        startTime: '2026-06-02 12:00',
        endTime: '2026-06-02 18:00',
      });
    });

    // Triggers edit mode
    act(() => {
      result.current.handleEditPhase(phase);
    });

    expect(result.current.editingPhaseId).toBe(phase.id);
    expect(result.current.startTime).toBe('2026-06-02 12:00');

    // Modify values
    act(() => {
      result.current.setEndTime('2026-06-02 23:59');
    });

    act(() => {
      result.current.handleSavePhase();
    });

    expect(result.current.phases.length).toBe(1);
    expect(result.current.phases[0].endTime).toBe('2026-06-02 23:59');
    expect(result.current.editingPhaseId).toBeNull(); // Reset edit mode

    alertSpy.mockRestore();
  });

  it('should reset form on edit cancel', () => {
    const { result } = renderHook(() => useAdminDashboardViewModel());
    
    let phase;
    act(() => {
      phase = phaseRepo.addPhase({
        type: 'course',
        startTime: '2026-06-02 12:00',
        endTime: '2026-06-02 18:00',
      });
    });

    act(() => {
      result.current.handleEditPhase(phase);
    });

    expect(result.current.editingPhaseId).toBe(phase.id);

    act(() => {
      result.current.handleCancelEdit();
    });

    expect(result.current.editingPhaseId).toBeNull();
    expect(result.current.startTime).toBe('');
    expect(result.current.endTime).toBe('');
  });

  it('should call deletePhase when confirm deletion', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, msg, buttons) => {
      // Auto press Delete button
      if (buttons && buttons[1] && buttons[1].onPress) {
        buttons[1].onPress();
      }
    });

    const { result } = renderHook(() => useAdminDashboardViewModel());
    
    let phase;
    act(() => {
      phase = phaseRepo.addPhase({
        type: 'class',
        startTime: '2026-06-02 12:00',
        endTime: '2026-06-02 18:00',
      });
    });

    expect(result.current.phases.length).toBe(1);

    act(() => {
      result.current.handleDeletePhase(phase.id);
    });

    expect(result.current.phases.length).toBe(0);

    alertSpy.mockRestore();
  });
});
