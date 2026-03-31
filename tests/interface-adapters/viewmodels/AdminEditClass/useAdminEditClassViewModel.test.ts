import { act, renderHook } from '@testing-library/react-native';
import { useAdminEditClassViewModel } from '../../../../src/interface-adapters/viewmodels/AdminEditClass/useAdminEditClassViewModel';

describe('useAdminEditClassViewModel', () => {
  it('updates form values correctly', () => {
    const { result } = renderHook(() => useAdminEditClassViewModel());

    expect(result.current.formValues.ky).toBe('');

    act(() => {
      result.current.handleInputChange('ky', '20231');
    });

    expect(result.current.formValues.ky).toBe('20231');
  });
});
