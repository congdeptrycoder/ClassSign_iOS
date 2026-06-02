export const DOMExceptionPolyfill = class DOMException extends Error {
  constructor(message, name) {
    super(message);
    this.name = name || 'DOMException';
    this.code = 0;
  }
};

const globals = [
  typeof globalThis !== 'undefined' ? globalThis : null,
  typeof global !== 'undefined' ? global : null,
  typeof window !== 'undefined' ? window : null,
  typeof self !== 'undefined' ? self : null,
].filter(Boolean);

globals.forEach((g) => {
  if (typeof g.DOMException === 'undefined') {
    g.DOMException = DOMExceptionPolyfill;
  }
});

console.log('[Polyfill] DOMException has been successfully polyfilled.');
