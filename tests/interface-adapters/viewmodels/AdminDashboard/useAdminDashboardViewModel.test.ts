import { act, renderHook } from '@testing-library/react-native';
import { useAdminDashboardViewModel } from '../../../../src/interface-adapters/viewmodels/AdminDashboard/useAdminDashboardViewModel';

describe('useAdminDashboardViewModel', () => {
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
});
