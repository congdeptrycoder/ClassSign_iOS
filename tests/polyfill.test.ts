import { DOMExceptionPolyfill } from '../polyfill';

describe('DOMException Polyfill', () => {
    it('should define DOMException on global and globalThis', () => {
        expect(global.DOMException).toBeDefined();
        expect(globalThis.DOMException).toBeDefined();
    });

    it('should construct DOMException correctly', () => {
        const err = new DOMExceptionPolyfill('Something went wrong', 'AbortError');
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Something went wrong');
        expect(err.name).toBe('AbortError');
        expect(err.code).toBe(0);
    });

    it('should fallback to default error name if not specified', () => {
        const err = new DOMExceptionPolyfill('Default error');
        expect(err.name).toBe('DOMException');
    });
});
